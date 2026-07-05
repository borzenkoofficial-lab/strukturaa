import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_shop_items",
  title: "List shop items",
  description: "List STRUKTURA shop items — tools and equipment listed for sale.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Max items (default 20)."),
    search: z.string().optional().describe("Substring match on title."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, search }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    );
    let q = supabase
      .from("shop_items")
      .select("id, title, description, price, category, city, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (search) q = q.ilike("title", `%${search}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { items: data ?? [] },
    };
  },
});
