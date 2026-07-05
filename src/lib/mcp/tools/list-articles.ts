import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_articles",
  title: "List published articles",
  description: "List published STRUKTURA blog articles with title, excerpt, category, and slug.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Max articles (default 20)."),
    search: z.string().optional().describe("Case-insensitive substring match on title."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, search }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    );
    let q = supabase
      .from("articles")
      .select("id, title, excerpt, slug, category, published_at, cover_image")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(limit ?? 20);
    if (search) q = q.ilike("title", `%${search}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { articles: data ?? [] },
    };
  },
});
