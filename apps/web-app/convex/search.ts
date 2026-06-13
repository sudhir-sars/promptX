import { v } from "convex/values";
import { authedQuery } from "./lib/auth";

export const search = authedQuery({
  args: {
    teamId: v.id("teams"),
    search: v.string(),
  },

  handler: async (ctx, args) => {
    const search = args.search.trim();

    if (!search) return [];

    const [prompts, versions] = await Promise.all([
      ctx.db
        .query("prompts")
        .withSearchIndex("search_name", (q) => q.search("name", search).eq("teamId", args.teamId))
        .take(5),

      ctx.db
        .query("versions")
        .withSearchIndex("tags", (q) => q.search("tag", search).eq("teamId", args.teamId))
        .take(5),
    ]);

    const promptMap = new Map(prompts.map((prompt) => [prompt._id, prompt]));

    const missingPromptIds = [...new Set(versions.map((version) => version.promptId))].filter(
      (id) => !promptMap.has(id),
    );

    const missingPrompts = await Promise.all(missingPromptIds.map((id) => ctx.db.get(id)));

    for (const prompt of missingPrompts) {
      if (prompt) {
        promptMap.set(prompt._id, prompt);
      }
    }

    return [...promptMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  },
});
