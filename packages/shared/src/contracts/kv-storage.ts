import type { DeploymentEnv } from "../types/env";

/**
 * The Cloudflare KV storage contract between the Web App (writer) and the
 * Edge Worker (reader).
 *
 * Both sides must agree on these shapes and key formats. The Web App writes
 * `KVPromptConfig` / `ApiKeyRecord[]` blobs; the Edge reads them back. Key
 * builders live in `utils/kv-keys`.
 */

export interface KVPromptVariant {
  content: string;
  sequence: number;
  traffic: number;
}

export interface KVPromptConfig {
  teamId: string;
  slug: string;
  env: DeploymentEnv;
  variants: KVPromptVariant[];
}

/** Per-team API key record as stored in KV. `hash` never leaves the boundary. */
export interface ApiKeyRecord {
  keyId: string;
  hash: string;
}

/** KV key shapes. Build them via `promptKvKey` / `apiKeysKvKey`. */
export type PromptKVKey = `prompt:${string}:${string}`;
export type ApiKeyKVKey = `team:${string}:apikeys`;
