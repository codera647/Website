-- Kinetiq leads pipeline — run this in Supabase Studio's SQL editor
-- (project: https://ghvggluglhnsfntlivxy.supabase.co).
--
-- Written to be safe to re-run: the `leads` table already exists from an
-- earlier pass (missing a couple of columns this version adds), so this
-- uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS throughout rather than a
-- bare CREATE TABLE.

create table if not exists leads (
    id                 uuid primary key default gen_random_uuid(),
    cal_booking_uid    text not null unique,   -- Cal.com's booking uid; upsert conflict target
    name               text not null,
    email              text not null,
    call_date          timestamptz not null,
    status             text not null default 'pending' check (status in ('pending', 'won', 'lost')),
    notes              text,                   -- optional one-line context, set manually alongside status
    follow_up_sent     boolean not null default false,
    follow_up_sent_at  timestamptz,            -- set when the follow-up actually goes out
    created_at         timestamptz not null default now()
);

-- Bring an already-existing table (from the earlier pass) up to spec.
alter table leads add column if not exists notes text;
alter table leads add column if not exists follow_up_sent_at timestamptz;
-- Drop the earlier pass's optional call_notes column now that `notes` replaces it.
alter table leads drop column if exists call_notes;
alter table leads drop column if exists updated_at;

create index if not exists idx_leads_followup_scan on leads (status, follow_up_sent, call_date);

alter table leads enable row level security;  -- no policies added: locks the table to service_role only

-- ── Upsert function ─────────────────────────────────────────────────
-- Used by the webhook handler instead of a plain .upsert() specifically
-- to get "don't overwrite status on conflict" behavior. A plain upsert
-- would reset status/notes/follow_up_sent back to their defaults every
-- time the row already exists — which breaks the moment Cal.com retries
-- a webhook delivery (it does, on any non-2xx or timeout) after a human
-- has already marked the lead won.
create or replace function upsert_lead_from_cal(
    p_cal_booking_uid text,
    p_name text,
    p_email text,
    p_call_date timestamptz
) returns void as $$
    insert into leads (cal_booking_uid, name, email, call_date)
    values (p_cal_booking_uid, p_name, p_email, p_call_date)
    on conflict (cal_booking_uid) do update
        set name = excluded.name, email = excluded.email, call_date = excluded.call_date;
        -- status, notes, follow_up_sent, follow_up_sent_at intentionally untouched on conflict
$$ language sql;

-- ── Daily scheduler ──────────────────────────────────────────────────
-- Supabase's built-in Cron (Dashboard -> Integrations -> Cron Jobs,
-- backed by pg_cron + pg_net) calling the send-followups Edge Function
-- directly. Requires the Edge Function to be deployed first:
--   npx supabase login
--   npx supabase link --project-ref ghvggluglhnsfntlivxy
--   npx supabase functions deploy send-followups
--
-- Store the service-role key in Vault first (Dashboard -> Project
-- Settings -> Vault, or run the insert below with the real key), so the
-- scheduled call can authenticate to the function without the key
-- sitting in plain text in cron.job.

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Only needed once — skip if 'service_role_key' already exists in Vault.
-- select vault.create_secret('<paste the real SUPABASE_SERVICE_ROLE_KEY value>', 'service_role_key');

select cron.unschedule('kinetiq-daily-followup')
    where exists (select 1 from cron.job where jobname = 'kinetiq-daily-followup');

select cron.schedule(
    'daily-followup-send',
    '0 14 * * *',  -- UTC — adjust so this lands at a sensible morning time for Kinetiq
    $$
    select net.http_post(
        url := 'https://ghvggluglhnsfntlivxy.supabase.co/functions/v1/send-followups',
        headers := jsonb_build_object(
            'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key'),
            'Content-Type', 'application/json'
        )
    );
    $$
);

-- To inspect scheduled jobs:      select * from cron.job;
-- To see recent run results:      select * from cron.job_run_details order by start_time desc limit 20;
-- To remove the schedule:         select cron.unschedule('daily-followup-send');
