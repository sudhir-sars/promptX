import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { authedQuery } from "./lib/auth";
import { badRequest, invariant, notFound } from "./lib/errors";

export const insertApiKey = internalMutation({
  args: {
    name: v.optional(v.string()),
    keyId: v.string(),
    hash: v.string(),
    prefix: v.string(),
    teamId: v.id("teams"),
  },
  handler: async (ctx, { name, keyId, hash, prefix, teamId }) => {
    const apiKeyId = await ctx.db.insert("apiKeys", {
      teamId,
      ...(name !== undefined ? { name } : {}),
      prefix,
      hash,
      keyId,
    });
    const key = await ctx.db.get(apiKeyId);
    if (!key) notFound("API key");
    return key;
  },
});

export const getActiveHashesByUser = internalQuery({
  args: { teamId: v.id("teams") },
  handler: async (ctx, { teamId }) => {
    return await ctx.db
      .query("apiKeys")
      .withIndex("by_team", (q) => q.eq("teamId", teamId))
      .filter((q) => q.eq(q.field("revokedAt"), undefined))
      .collect();
  },
});

export const getAllKeys = authedQuery({
  args: { teamId: v.id("teams") },
  handler: async (ctx, { teamId }) => {
    return ctx.db
      .query("apiKeys")
      .withIndex("by_team_revoked", (q) => q.eq("teamId", teamId))
      .collect();
  },
});

export const list = authedQuery({
  args: { paginationOpts: paginationOptsValidator, teamId: v.id("teams") },
  handler: async (ctx, { paginationOpts, teamId }) => {
    return ctx.db
      .query("apiKeys")
      .withIndex("by_team", (q) => q.eq("teamId", teamId))
      .order("desc")
      .paginate(paginationOpts);
  },
});

export const revokeKey = internalMutation({
  args: { id: v.id("apiKeys"), teamId: v.id("teams") },
  handler: async (ctx, { id, teamId }) => {
    const key = await ctx.db.get(id);
    invariant(key, "Key not found");
    invariant(key.teamId === teamId, "Unauthorized");

    if (key.revokedAt) badRequest("Already revoked");

    await ctx.db.patch(id, { revokedAt: Date.now() });
  },
});

// We haven't used invariant here because this function is intended for internal use and is allowed to return null.
export const getApiKeyById = internalQuery({
  args: { keyId: v.string() },
  handler: async (ctx, { keyId }) => {
    return await ctx.db
      .query("apiKeys")
      .withIndex("by_keyId", (q) => q.eq("keyId", keyId))
      .unique();
  },
});
