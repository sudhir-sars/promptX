"use node";

import crypto from "node:crypto";
import { v } from "convex/values";
import { customAlphabet } from "nanoid";
import type { ApiKeyRecord } from "../../../../packages/shared/src";
import { apiKeysKvKey } from "../../../../packages/shared/src/utils";
import { internal } from "../_generated/api";
import type { Doc } from "../_generated/dataModel";
import { type ActionCtx, internalAction } from "../_generated/server";
import { authedAction } from "../lib/auth";
import { internalError, invariant } from "../lib/errors";

const generatePublicId = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 10);

async function createUniqueApiKeyId(ctx: ActionCtx) {
  for (let i = 0; i < 10; i++) {
    const keyId = generatePublicId();

    const existing = await ctx.runQuery(internal.apiKeys.getApiKeyById, {
      keyId,
    });

    if (!existing) return keyId;
  }

  internalError("Failed to generate unique API key ID");
}

export async function hashSecret(secret: string): Promise<string> {
  const bytes = new TextEncoder().encode(secret);

  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const create = authedAction({
  args: {
    name: v.optional(v.string()),
    teamId: v.id("teams"),
  },

  handler: async (ctx, { name, teamId }) => {
    const prefix = "xe_live";

    const keyId = await createUniqueApiKeyId(ctx);

    const secret = crypto.randomBytes(32).toString("base64url");

    const key = `${prefix}_${keyId}_${teamId}.${secret}`;

    const hash = crypto.createHash("sha256").update(secret).digest("hex");

    const keyDoc: Doc<"apiKeys"> = await ctx.runMutation(internal.apiKeys.insertApiKey, {
      teamId,
      ...(name !== undefined ? { name } : {}),
      keyId,
      hash,
      prefix,
    });
    await ctx.runAction(internal.actions.apiKey.syncUserKeysToKV, { teamId });

    return { keyDoc, key };
  },
});

export const revoke = authedAction({
  args: { id: v.id("apiKeys"), teamId: v.id("teams") },
  handler: async (ctx, { id, teamId }) => {
    await ctx.runMutation(internal.apiKeys.revokeKey, { id, teamId });

    await ctx.runAction(internal.actions.apiKey.syncUserKeysToKV, { teamId });
    return { success: true };
  },
});

export const syncUserKeysToKV = internalAction({
  args: { teamId: v.id("teams") },
  handler: async (ctx, { teamId }) => {
    const hashes = await ctx.runQuery(internal.apiKeys.getActiveHashesByUser, {
      teamId,
    });
    const payload: ApiKeyRecord[] = hashes.map((key) => {
      return {
        keyId: key.keyId,
        hash: key.hash,
      };
    });

    const accountId = process.env["CLOUDFLARE_ACCOUNT_ID"]!;
    const namespaceId = process.env["PROMPTX_API_KEYS_KV"]!;
    const token = process.env["CLOUDFLARE_API_TOKEN"]!;
    const key = apiKeysKvKey(teamId);

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    invariant(res.ok, `KV key sync failed: ${await res.text()}`);
  },
});
