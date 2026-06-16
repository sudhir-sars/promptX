import type { ApiKeyKVKey, PromptKVKey } from "../contracts/kv-storage";

/**
 * KV key builders — the single place that knows the key layout. Used by the
 * Web App when writing and by the Edge when reading, so the handshake can
 * never drift.
 */

export function promptKvKey(teamId: string, identifier: string): PromptKVKey {
	return `prompt:${teamId}:${identifier}`;
}

export function apiKeysKvKey(teamId: string): ApiKeyKVKey {
	return `team:${teamId}:apikeys`;
}
