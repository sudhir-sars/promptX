import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { invariant } from "./errors";

/**
 * Shared version operations, called by both the dashboard (`versions.ts`, Clerk
 * auth) and the REST API (`rest.ts`, API-key auth). Authorization happens in the
 * caller.
 */

/** Reject a tag that is reserved or already used by another version of the prompt. */
export async function assertTagAvailable(ctx: MutationCtx, promptId: Id<"prompts">, tag: string) {
	invariant(tag.toLowerCase() !== "draft", '"draft" is a reserved tag');

	const existing = await ctx.db
		.query("versions")
		.withIndex("by_prompt_tag", (q) => q.eq("promptId", promptId).eq("tag", tag))
		.unique();

	invariant(!existing, `Tag "${tag}" is already used by v${existing?.sequence}`);
}

/**
 * Promote the prompt's live draft to a published version (optionally tagged) and
 * open a fresh draft above it — the "save version" lifecycle. Returns the
 * now-published version and the new draft.
 */
export async function cutVersion(ctx: MutationCtx, prompt: Doc<"prompts">, content: string, tag?: string) {
	const now = Date.now();
	const trimmedTag = tag?.trim();

	if (trimmedTag) await assertTagAvailable(ctx, prompt._id, trimmedTag);

	const draft = await ctx.db
		.query("versions")
		.withIndex("by_prompt_draft", (q) => q.eq("promptId", prompt._id).eq("draft", true))
		.unique();

	invariant(draft, "No draft found");

	await ctx.db.patch(draft._id, {
		draft: false,
		content,
		updatedAt: now,
		...(trimmedTag ? { tag: trimmedTag } : {}),
	});

	const newDraftId = await ctx.db.insert("versions", {
		teamId: prompt.teamId,
		promptId: prompt._id,
		tag: "draft",
		sequence: draft.sequence + 1,
		draft: true,
		content,
		updatedAt: now,
	});

	const published = await ctx.db.get(draft._id);
	const newDraft = await ctx.db.get(newDraftId);
	invariant(published && newDraft, "Failed to cut version");

	return { published, newDraft };
}
