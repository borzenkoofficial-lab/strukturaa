import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_marketplace_listings",
  title: "List marketplace listings",
  description:
    "List active STRUKTURA construction marketplace (Birzha) listings — customer job requests across categories like demolition, electrical, landscaping.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Max listings (default 20)."),
    category: z.string().optional().describe("Filter by category slug (e.g. 'demolition')."),
    search: z.string().optional().describe("Substring match on title."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, category, search }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    );
    let q = supabase
      .from("listings")
      .select("id, title, description, category, budget, city, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (category) q = q.eq("category", category);
    if (search) q = q.ilike("title", `%${search}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { listings: data ?? [] },
    };
  },
});
