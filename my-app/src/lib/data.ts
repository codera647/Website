import { getDB } from "@/lib/db";

/**
 * Server-side data-fetching helpers — read projects and blogs from D1.
 * Used by public pages (/work, /blog, homepage) and admin API routes.
 *
 * Import ONLY from server components / API routes (uses D1 binding).
 */

// ── Types ────────────────────────────────────────────────────────────

export interface Project {
    id: number;
    slug: string;
    title: string;
    category: "AI Automation" | "Web Development" | "Generative AI";
    tags: string[];
    summary: string;
    thumbnail: string;
    images: string[];
    year: string;
    featured: boolean;
    challenge: string;
    solution: string;
    result: string;
    metrics: { value: string; label: string }[];
    quote?: { text: string; name: string; role: string } | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: "Company" | "Robotics" | "Computer Vision" | "Drones";
    date: string;
    read_time: number;
    content: string;
    published: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProjectDocument {
    id: number;
    project_id: number;
    filename: string;
    r2_key: string;
    size_bytes: number;
    uploaded_at: string;
}

export interface Job {
    id: number;
    slug: string;
    title: string;
    department: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract" | "Internship";
    summary: string;
    jd_content: string;
    responsibilities: string[];
    requirements: string[];
    nice_to_have: string[];
    active: boolean;
    posted_date: string;
    created_at: string;
    updated_at: string;
}

export interface JobDocument {
    id: number;
    job_id: number;
    filename: string;
    r2_key: string;
    size_bytes: number;
    uploaded_at: string;
}

// ── Row → typed object ──────────────────────────────────────────────

function parseProject(row: Record<string, unknown>): Project {
    return {
        id: row.id as number,
        slug: row.slug as string,
        title: row.title as string,
        category: row.category as Project["category"],
        tags: JSON.parse((row.tags as string) || "[]"),
        summary: row.summary as string,
        thumbnail: row.thumbnail as string,
        images: JSON.parse((row.images as string) || "[]"),
        year: row.year as string,
        featured: (row.featured as number) === 1,
        challenge: row.challenge as string,
        solution: row.solution as string,
        result: row.result as string,
        metrics: JSON.parse((row.metrics as string) || "[]"),
        quote: row.quote ? JSON.parse(row.quote as string) : null,
        sort_order: row.sort_order as number,
        created_at: row.created_at as string,
        updated_at: row.updated_at as string,
    };
}

function parseBlog(row: Record<string, unknown>): BlogPost {
    return {
        id: row.id as number,
        slug: row.slug as string,
        title: row.title as string,
        excerpt: row.excerpt as string,
        category: row.category as BlogPost["category"],
        date: row.date as string,
        read_time: row.read_time as number,
        content: row.content as string,
        published: (row.published as number) === 1,
        created_at: row.created_at as string,
        updated_at: row.updated_at as string,
    };
}

function parseJob(row: Record<string, unknown>): Job {
    return {
        id: row.id as number,
        slug: row.slug as string,
        title: row.title as string,
        department: (row.department as string) || "Engineering",
        location: (row.location as string) || "Remote",
        type: (row.type as Job["type"]) || "Full-time",
        summary: (row.summary as string) || "",
        jd_content: (row.jd_content as string) || "",
        responsibilities: JSON.parse((row.responsibilities as string) || "[]"),
        requirements: JSON.parse((row.requirements as string) || "[]"),
        nice_to_have: JSON.parse((row.nice_to_have as string) || "[]"),
        active: (row.active as number) === 1,
        posted_date: (row.posted_date as string) || "",
        created_at: row.created_at as string,
        updated_at: row.updated_at as string,
    };
}

// ── Project queries ─────────────────────────────────────────────────

export async function getAllProjects(): Promise<Project[]> {
    const db = getDB();
    const { results } = await db
        .prepare("SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC")
        .all();
    return (results ?? []).map((r) => parseProject(r as Record<string, unknown>));
}

export async function getFeaturedProjects(): Promise<Project[]> {
    const db = getDB();
    const { results } = await db
        .prepare("SELECT * FROM projects WHERE featured = 1 ORDER BY sort_order ASC")
        .all();
    return (results ?? []).map((r) => parseProject(r as Record<string, unknown>));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const db = getDB();
    const row = await db
        .prepare("SELECT * FROM projects WHERE slug = ?")
        .bind(slug)
        .first();
    return row ? parseProject(row as Record<string, unknown>) : null;
}

export async function getProjectById(id: number): Promise<Project | null> {
    const db = getDB();
    const row = await db
        .prepare("SELECT * FROM projects WHERE id = ?")
        .bind(id)
        .first();
    return row ? parseProject(row as Record<string, unknown>) : null;
}

// ── Blog queries ────────────────────────────────────────────────────

export async function getAllBlogPosts(includeUnpublished = false): Promise<BlogPost[]> {
    const db = getDB();
    const query = includeUnpublished
        ? "SELECT * FROM blogs ORDER BY date DESC"
        : "SELECT * FROM blogs WHERE published = 1 ORDER BY date DESC";
    const { results } = await db.prepare(query).all();
    return (results ?? []).map((r) => parseBlog(r as Record<string, unknown>));
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
    const db = getDB();
    const row = await db
        .prepare("SELECT * FROM blogs WHERE slug = ?")
        .bind(slug)
        .first();
    return row ? parseBlog(row as Record<string, unknown>) : null;
}

export async function getBlogById(id: number): Promise<BlogPost | null> {
    const db = getDB();
    const row = await db
        .prepare("SELECT * FROM blogs WHERE id = ?")
        .bind(id)
        .first();
    return row ? parseBlog(row as Record<string, unknown>) : null;
}

export async function getRelatedBlogPosts(slug: string, count = 3): Promise<BlogPost[]> {
    const db = getDB();
    const current = await getBlogBySlug(slug);
    if (!current) {
        const { results } = await db
            .prepare("SELECT * FROM blogs WHERE published = 1 ORDER BY date DESC LIMIT ?")
            .bind(count)
            .all();
        return (results ?? []).map((r) => parseBlog(r as Record<string, unknown>));
    }

    // Same category first, then fill with others
    const { results } = await db
        .prepare(
            `SELECT * FROM blogs WHERE published = 1 AND slug != ?
             ORDER BY (CASE WHEN category = ? THEN 0 ELSE 1 END), date DESC
             LIMIT ?`
        )
        .bind(slug, current.category, count)
        .all();
    return (results ?? []).map((r) => parseBlog(r as Record<string, unknown>));
}

// ── Project mutations ───────────────────────────────────────────────

export type ProjectInput = Omit<
    Project,
    "id" | "created_at" | "updated_at"
>;

export async function createProject(input: ProjectInput): Promise<Project> {
    const db = getDB();
    const now = new Date().toISOString();
    const result = await db
        .prepare(
            `INSERT INTO projects
                (slug, title, category, tags, summary, thumbnail, images, year,
                 featured, challenge, solution, result, metrics, quote, sort_order,
                 created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
            input.slug,
            input.title,
            input.category,
            JSON.stringify(input.tags ?? []),
            input.summary,
            input.thumbnail,
            JSON.stringify(input.images ?? []),
            input.year,
            input.featured ? 1 : 0,
            input.challenge,
            input.solution,
            input.result,
            JSON.stringify(input.metrics ?? []),
            input.quote ? JSON.stringify(input.quote) : null,
            input.sort_order ?? 0,
            now,
            now
        )
        .run();

    const id = result.meta.last_row_id as number;
    const created = await getProjectById(id);
    if (!created) throw new Error("Failed to read back created project.");
    return created;
}

export async function updateProject(
    id: number,
    input: ProjectInput
): Promise<Project | null> {
    const db = getDB();
    const now = new Date().toISOString();
    await db
        .prepare(
            `UPDATE projects SET
                slug = ?, title = ?, category = ?, tags = ?, summary = ?,
                thumbnail = ?, images = ?, year = ?, featured = ?, challenge = ?,
                solution = ?, result = ?, metrics = ?, quote = ?, sort_order = ?,
                updated_at = ?
             WHERE id = ?`
        )
        .bind(
            input.slug,
            input.title,
            input.category,
            JSON.stringify(input.tags ?? []),
            input.summary,
            input.thumbnail,
            JSON.stringify(input.images ?? []),
            input.year,
            input.featured ? 1 : 0,
            input.challenge,
            input.solution,
            input.result,
            JSON.stringify(input.metrics ?? []),
            input.quote ? JSON.stringify(input.quote) : null,
            input.sort_order ?? 0,
            now,
            id
        )
        .run();

    return getProjectById(id);
}

export async function deleteProject(id: number): Promise<void> {
    const db = getDB();
    // project_documents rows cascade via FK, but their R2 objects don't —
    // callers that need R2 cleanup should fetch getProjectDocuments(id) first.
    await db.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
}

// ── Blog mutations ──────────────────────────────────────────────────

export type BlogInput = Omit<BlogPost, "id" | "created_at" | "updated_at">;

export async function createBlog(input: BlogInput): Promise<BlogPost> {
    const db = getDB();
    const now = new Date().toISOString();
    const result = await db
        .prepare(
            `INSERT INTO blogs
                (slug, title, excerpt, category, date, read_time, content,
                 published, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
            input.slug,
            input.title,
            input.excerpt,
            input.category,
            input.date,
            input.read_time ?? 3,
            input.content,
            input.published ? 1 : 0,
            now,
            now
        )
        .run();

    const id = result.meta.last_row_id as number;
    const created = await getBlogById(id);
    if (!created) throw new Error("Failed to read back created blog.");
    return created;
}

export async function updateBlog(
    id: number,
    input: BlogInput
): Promise<BlogPost | null> {
    const db = getDB();
    const now = new Date().toISOString();
    await db
        .prepare(
            `UPDATE blogs SET
                slug = ?, title = ?, excerpt = ?, category = ?, date = ?,
                read_time = ?, content = ?, published = ?, updated_at = ?
             WHERE id = ?`
        )
        .bind(
            input.slug,
            input.title,
            input.excerpt,
            input.category,
            input.date,
            input.read_time ?? 3,
            input.content,
            input.published ? 1 : 0,
            now,
            id
        )
        .run();

    return getBlogById(id);
}

export async function deleteBlog(id: number): Promise<void> {
    const db = getDB();
    await db.prepare("DELETE FROM blogs WHERE id = ?").bind(id).run();
}

// ── Document mutations ──────────────────────────────────────────────

export async function addProjectDocument(
    projectId: number,
    filename: string,
    r2Key: string,
    sizeBytes: number
): Promise<ProjectDocument> {
    const db = getDB();
    const now = new Date().toISOString();
    const result = await db
        .prepare(
            `INSERT INTO project_documents (project_id, filename, r2_key, size_bytes, uploaded_at)
             VALUES (?, ?, ?, ?, ?)`
        )
        .bind(projectId, filename, r2Key, sizeBytes, now)
        .run();

    const id = result.meta.last_row_id as number;
    const row = await db
        .prepare("SELECT * FROM project_documents WHERE id = ?")
        .bind(id)
        .first();
    return row as unknown as ProjectDocument;
}

export async function getProjectDocumentById(
    id: number
): Promise<ProjectDocument | null> {
    const db = getDB();
    const row = await db
        .prepare("SELECT * FROM project_documents WHERE id = ?")
        .bind(id)
        .first();
    return row ? (row as unknown as ProjectDocument) : null;
}

export async function deleteProjectDocument(id: number): Promise<void> {
    const db = getDB();
    await db.prepare("DELETE FROM project_documents WHERE id = ?").bind(id).run();
}

// ── Document queries ────────────────────────────────────────────────

export async function getProjectDocuments(projectId: number): Promise<ProjectDocument[]> {
    const db = getDB();
    const { results } = await db
        .prepare("SELECT * FROM project_documents WHERE project_id = ? ORDER BY uploaded_at DESC")
        .bind(projectId)
        .all();
    return (results ?? []) as unknown as ProjectDocument[];
}

// ── Job queries & mutations ─────────────────────────────────────────

export async function getAllJobs(onlyActive = false): Promise<Job[]> {
    const db = getDB();
    const query = onlyActive
        ? "SELECT * FROM jobs WHERE active = 1 ORDER BY posted_date DESC, created_at DESC"
        : "SELECT * FROM jobs ORDER BY posted_date DESC, created_at DESC";
    const { results } = await db.prepare(query).all();
    return (results ?? []).map(parseJob);
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
    const db = getDB();
    const row = await db.prepare("SELECT * FROM jobs WHERE slug = ?").bind(slug).first();
    return row ? parseJob(row) : null;
}

export async function getJobById(id: number): Promise<Job | null> {
    const db = getDB();
    const row = await db.prepare("SELECT * FROM jobs WHERE id = ?").bind(id).first();
    return row ? parseJob(row) : null;
}

export interface CreateJobInput {
    slug: string;
    title: string;
    department?: string;
    location?: string;
    type?: Job["type"];
    summary: string;
    jd_content?: string;
    responsibilities?: string[];
    requirements?: string[];
    nice_to_have?: string[];
    active?: boolean;
    posted_date?: string;
}

export async function createJob(input: CreateJobInput): Promise<Job> {
    const db = getDB();
    const now = new Date().toISOString();
    const postedDate = input.posted_date || now.slice(0, 7);

    const result = await db
        .prepare(
            `INSERT INTO jobs (
                slug, title, department, location, type, summary, jd_content,
                responsibilities, requirements, nice_to_have, active, posted_date,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
            input.slug,
            input.title,
            input.department || "Engineering",
            input.location || "Remote",
            input.type || "Full-time",
            input.summary,
            input.jd_content || "",
            JSON.stringify(input.responsibilities || []),
            JSON.stringify(input.requirements || []),
            JSON.stringify(input.nice_to_have || []),
            input.active !== false ? 1 : 0,
            postedDate,
            now,
            now
        )
        .run();

    const id = result.meta.last_row_id as number;
    const job = await getJobById(id);
    if (!job) throw new Error("Failed to create job opening");
    return job;
}

export interface UpdateJobInput {
    slug?: string;
    title?: string;
    department?: string;
    location?: string;
    type?: Job["type"];
    summary?: string;
    jd_content?: string;
    responsibilities?: string[];
    requirements?: string[];
    nice_to_have?: string[];
    active?: boolean;
    posted_date?: string;
}

export async function updateJob(id: number, input: UpdateJobInput): Promise<Job | null> {
    const db = getDB();
    const existing = await getJobById(id);
    if (!existing) return null;

    const now = new Date().toISOString();

    await db
        .prepare(
            `UPDATE jobs SET
                slug = ?,
                title = ?,
                department = ?,
                location = ?,
                type = ?,
                summary = ?,
                jd_content = ?,
                responsibilities = ?,
                requirements = ?,
                nice_to_have = ?,
                active = ?,
                posted_date = ?,
                updated_at = ?
            WHERE id = ?`
        )
        .bind(
            input.slug ?? existing.slug,
            input.title ?? existing.title,
            input.department ?? existing.department,
            input.location ?? existing.location,
            input.type ?? existing.type,
            input.summary ?? existing.summary,
            input.jd_content ?? existing.jd_content,
            JSON.stringify(input.responsibilities ?? existing.responsibilities),
            JSON.stringify(input.requirements ?? existing.requirements),
            JSON.stringify(input.nice_to_have ?? existing.nice_to_have),
            (input.active !== undefined ? input.active : existing.active) ? 1 : 0,
            input.posted_date ?? existing.posted_date,
            now,
            id
        )
        .run();

    return getJobById(id);
}

export async function deleteJob(id: number): Promise<void> {
    const db = getDB();
    await db.prepare("DELETE FROM jobs WHERE id = ?").bind(id).run();
}

// ── Job Document queries & mutations ────────────────────────────────

export async function getJobDocuments(jobId: number): Promise<JobDocument[]> {
    const db = getDB();
    const { results } = await db
        .prepare("SELECT * FROM job_documents WHERE job_id = ? ORDER BY uploaded_at DESC")
        .bind(jobId)
        .all();
    return (results ?? []) as unknown as JobDocument[];
}

export async function addJobDocument(
    jobId: number,
    filename: string,
    r2Key: string,
    sizeBytes: number
): Promise<JobDocument> {
    const db = getDB();
    const now = new Date().toISOString();
    const result = await db
        .prepare(
            `INSERT INTO job_documents (job_id, filename, r2_key, size_bytes, uploaded_at)
             VALUES (?, ?, ?, ?, ?)`
        )
        .bind(jobId, filename, r2Key, sizeBytes, now)
        .run();

    const id = result.meta.last_row_id as number;
    const row = await db.prepare("SELECT * FROM job_documents WHERE id = ?").bind(id).first();
    return row as unknown as JobDocument;
}

export async function getJobDocumentById(id: number): Promise<JobDocument | null> {
    const db = getDB();
    const row = await db.prepare("SELECT * FROM job_documents WHERE id = ?").bind(id).first();
    return row ? (row as unknown as JobDocument) : null;
}

export async function deleteJobDocument(id: number): Promise<void> {
    const db = getDB();
    await db.prepare("DELETE FROM job_documents WHERE id = ?").bind(id).run();
}
