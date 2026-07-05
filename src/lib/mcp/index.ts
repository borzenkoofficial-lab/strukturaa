import { defineMcp } from "@lovable.dev/mcp-js";
import listProjects from "./tools/list-projects";
import listArticles from "./tools/list-articles";
import listListings from "./tools/list-listings";
import listShopItems from "./tools/list-shop-items";

export default defineMcp({
  name: "struktura-mcp",
  title: "STRUKTURA MCP",
  version: "0.1.0",
  instructions:
    "Read-only tools for STRUKTURA — a construction company platform. Use these tools to explore portfolio projects, blog articles, marketplace job listings (Birzha), and shop items (tools/equipment for sale).",
  tools: [listProjects, listArticles, listListings, listShopItems],
});
