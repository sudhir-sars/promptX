import { parseApiKey } from "@promptx/shared";
import { internal } from "../_generated/api";
import type { Doc } from "../_generated/dataModel";
import type { ActionCtx } from "../_generated/server";

async function hashSecret(secret: string): Promise<string> {
	const bytes = new TextEncoder().encode(secret);
	const digest = await crypto.subtle.digest("SHA-256", bytes);
	return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify a `Bearer <token>` Authorization header against the `apiKeys` table
 * (same scheme as the edge worker). Returns the matching key record, or `null`
 * when the header is missing, malformed, revoked, or the secret doesn't match.
 */
export async function verifyApiKey(ctx: ActionCtx, authorization: string | null): Promise<Doc<"apiKeys"> | null> {
	if (!authorization) {
		return null;
	}

	const parsed = parseApiKey(authorization.replace(/^Bearer\s+/, ""));

	if (!parsed) {
		return null;
	}

	const apiKey = await ctx.runQuery(internal.apiKeys.getApiKeyById, { keyId: parsed.keyId });

	if (!apiKey || apiKey.revokedAt || apiKey.teamId !== parsed.teamId) {
		return null;
	}

	if ((await hashSecret(parsed.secret)) !== apiKey.hash) {
		return null;
	}

	return apiKey;
}
