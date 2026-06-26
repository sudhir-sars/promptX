import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { createDefaultVersion } from "./defaults";
import { invariant } from "./errors";

/**
 * Shared prompt operations, called by both the dashboard (`prompts.ts`, Clerk
 * auth) and the REST API (`rest.ts`, API-key auth) so the two surfaces share one
 * implementation. Authorization happens in the caller; these assume the actor may
 * already act on `teamId`.
 */

/** Create a prompt together with its initial published version and live draft. */
export async function createPromptWithDefault(ctx: MutationCtx, teamId: Id<"teams">, name: string) {
	const promptId = await ctx.db.insert("prompts", {
		teamId,
		name,
		slug: name.toLowerCase().replace(/ /g, "-"),
	});

	await createDefaultVersion(ctx, teamId, promptId);

	const prompt = await ctx.db.get(promptId);
	invariant(prompt, "Prompt creation failed");

	return prompt;
}
