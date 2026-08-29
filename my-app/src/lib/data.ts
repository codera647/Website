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
