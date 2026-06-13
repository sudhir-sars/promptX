import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { invariant } from "./errors";

const DEFAULT_PROMPT_CONTENT = `You are a helpful AI support assistant.

Answer customer questions clearly and accurately.
If you are unsure, ask follow-up questions before making assumptions.`;

export async function createDefaultTeam(
  ctx: MutationCtx,
  args: {
    userId: Id<"users">;
    name: string;
    email: string;
    avatar: string;
  },
) {
  const teamId = await ctx.db.insert("teams", {
    ownerId: args.userId,
    name: `${args.name}'s Team`,
    meta: {
      memberCount: 1,
      promptCount: 1,
    },
  });

  const team = await ctx.db.get(teamId);

  invariant(team, "Failed to create team");

  const membershipId = await ctx.db.insert("members", {
    teamId,
    userId: args.userId,
    meta: {
      avatar: args.avatar,
      email: args.email,
      name: args.name,
    },
    role: "owner",
  });

  const membership = await ctx.db.get(membershipId);

  invariant(membership, "Failed to create team");

  const { draftVersion, prompt, version } = await createDefaultPrompt(ctx, teamId);

  return { team, membership, draftVersion, prompt, version };
}

export async function createDefaultPrompt(ctx: MutationCtx, teamId: Id<"teams">) {
  const promptId = await ctx.db.insert("prompts", {
    teamId,
    name: "AI Support Copilot",
    slug: "ai-support-copilot",
  });

  const prompt = await ctx.db.get(promptId);

  const { draftVersion, version } = await createDefaultVersion(ctx, teamId, promptId);

  invariant(prompt, "Failed to create prompt");

  return { prompt, draftVersion, version };
}

export async function createDefaultVersion(
  ctx: MutationCtx,
  teamId: Id<"teams">,
  promptId: Id<"prompts">,
) {
  const now = Date.now();

  const versionId = await ctx.db.insert("versions", {
    teamId,
    promptId,
    content: DEFAULT_PROMPT_CONTENT,
    updatedAt: now,
    sequence: 0,
    draft: false,
  });
  const version = await ctx.db.get(versionId);

  invariant(version, "Failed to create version");

  const draftId = await ctx.db.insert("versions", {
    teamId,
    promptId,
    sequence: 1,
    draft: true,
    content: DEFAULT_PROMPT_CONTENT,
    updatedAt: now,
  });

  const draftVersion = await ctx.db.get(draftId);

  invariant(draftVersion, "Failed to create draft");

  return {
    version,
    draftVersion,
  };
}
