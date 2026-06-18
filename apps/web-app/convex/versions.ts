import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internalQuery } from "./_generated/server";
import { authedMutation, authedQuery } from "./lib/auth";
import { invariant } from "./lib/errors";
import { requirePromptAccess, requireVersionAccess } from "./lib/permissions";

export const createVersion = authedMutation({
	args: {
		tag: v.optional(v.string()),
		promptId: v.id("prompts"),
		content: v.string(),
	},

	handler: async (ctx, { promptId, content }) => {
		const { prompt } = await requirePromptAccess(ctx, promptId);

		const now = Date.now();

		const draft = await ctx.db
			.query("versions")
			.withIndex("by_prompt_draft", (q) => q.eq("promptId", promptId).eq("draft", true))
			.unique();

		invariant(draft, "No draft found");

		await ctx.db.patch(draft._id, {
			draft: false,
			content,
			updatedAt: now,
		});

		const newDraftId = await ctx.db.insert("versions", {
			teamId: prompt.teamId,
			promptId,

			tag: "draft",
			sequence: draft.sequence + 1,
			draft: true,

			content,
			updatedAt: now,
		});

		const newDraft = await ctx.db.get(newDraftId);

		invariant(newDraft, "Failed to create draft");

		return {
			versionId: draft._id,
			newDraft,
		};
	},
});

export const listVersions = authedQuery({
	args: {
		promptId: v.id("prompts"),
		paginationOpts: paginationOptsValidator,
	},

	handler: async (ctx, { promptId, paginationOpts }) => {
		await requirePromptAccess(ctx, promptId);

		return ctx.db
			.query("versions")
			.withIndex("by_prompt", (q) => q.eq("promptId", promptId))
			.order("desc")
			.paginate(paginationOpts);
	},
});

export const getVersion = authedQuery({
	args: {
		versionId: v.id("versions"),
	},

	handler: async (ctx, { versionId }) => {
		const { version } = await requireVersionAccess(ctx, versionId);

		return version;
	},
});

export const updateVersion = authedMutation({
	args: {
		versionId: v.id("versions"),
		content: v.optional(v.string()),
		tag: v.optional(v.string()),
	},

	handler: async (ctx, { versionId, content, tag }) => {
		const { version } = await requireVersionAccess(ctx, versionId);

		invariant(version.draft, "Only drafts can be edited");

		await ctx.db.patch(versionId, {
			content: content ?? version.content,
			tag: tag ?? version.tag,
			updatedAt: Date.now(),
		});

		return versionId;
	},
});

export const setVersionTag = authedMutation({
	args: {
		versionId: v.id("versions"),
		tag: v.optional(v.string()),
	},

	handler: async (ctx, { versionId, tag }) => {
		const { version } = await requireVersionAccess(ctx, versionId);

		invariant(!version.draft, "Draft versions cannot be tagged");

		const trimmed = tag?.trim();

		if (trimmed) {
			invariant(trimmed.toLowerCase() !== "draft", '"draft" is a reserved tag');

			const exstsingTaggedVersion = await ctx.db
				.query("versions")
				.withIndex("by_prompt_tag", (q) => q.eq("promptId", version.promptId).eq("tag", trimmed))
				.unique();

			invariant(!exstsingTaggedVersion, `Tag "${trimmed}" is already used by v${exstsingTaggedVersion?.sequence}`);
		}

		await ctx.db.patch(versionId, {
			tag: trimmed,
			updatedAt: Date.now(),
		});

		return versionId;
	},
});

export const _getVersionsByIds = internalQuery({
	args: {
		versionIds: v.array(v.id("versions")),
	},
	handler: async (ctx, { versionIds }) => {
		return Promise.all(versionIds.map((id) => ctx.db.get(id)));
	},
});

/**
 * Resolve a prompt for `env=development`, served straight from Convex (instant,
 * read-your-writes). With a `promptVersion` (a version's name), returns that
 * version; without one, returns the live draft (the editable workspace) so
 * developers always see their latest edits. Returns `null` when nothing matches.
 */
export const _resolveDevPrompt = internalQuery({
	args: {
		teamId: v.id("teams"),
		slug: v.string(),
		promptVersion: v.optional(v.string()),
	},
	handler: async (ctx, { teamId, slug, promptVersion }) => {
		const prompt = await ctx.db
			.query("prompts")
			.withIndex("by_team_slug", (q) => q.eq("teamId", teamId).eq("slug", slug))
			.unique();

		if (!prompt) {
			return null;
		}

		const versionName = promptVersion?.trim();

		if (versionName && versionName.toLowerCase() !== "draft") {
			const named = await ctx.db
				.query("versions")
				.withIndex("by_prompt_tag", (q) => q.eq("promptId", prompt._id).eq("tag", versionName))
				.unique();

			if (!named || named.draft) {
				return null;
			}

			return { content: named.content, sequence: named.sequence };
		}

		// No version requested → the live draft (latest editable content).
		const draft = await ctx.db
			.query("versions")
			.withIndex("by_prompt_draft", (q) => q.eq("promptId", prompt._id).eq("draft", true))
			.unique();

		if (!draft) {
			return null;
		}

		return { content: draft.content, sequence: draft.sequence };
	},
});
