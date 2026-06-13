import { customAlphabet } from "nanoid";
import type { MutationCtx } from "../_generated/server";
import { internalError } from "./errors";

export const generatePublicId = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 10);

export async function createUniqueApiKeyId(ctx: MutationCtx) {
  for (let i = 0; i < 10; i++) {
    const keyId = generatePublicId();

    const existing = await ctx.db
      .query("apiKeys")
      .withIndex("by_keyId", (q) => q.eq("keyId", keyId))
      .unique();

    if (!existing) return keyId;
  }

  internalError("Failed to generate unique API key ID");
}

export async function createUniqueInviteCode(ctx: MutationCtx) {
  for (let i = 0; i < 10; i++) {
    const code = generatePublicId();

    const existing = await ctx.db
      .query("invites")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();

    if (!existing) {
      return code;
    }
  }

  internalError("Failed to generate unique invite code");
}
