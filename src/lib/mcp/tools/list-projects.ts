import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_portfolio_projects",
  title: "List portfolio projects",
  description:
    "List published STRUKTURA portfolio projects (title, category, area, duration, description, featured image).",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Max projects to return (default 20)."),
    category: z.string().optional().describe("Filter by category slug."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, category }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    );
    let q = supabase
      .from("portfolio_projects")
      .select("id, title, description, category, area, duration, featured_image")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .limit(limit ?? 20);
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { projects: data ?? [] },
    };
  },
});
