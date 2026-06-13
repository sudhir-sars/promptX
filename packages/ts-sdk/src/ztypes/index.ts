import type { DeploymentEnv } from "@promptx/shared";

// Re-export the canonical wire types so SDK consumers have one import surface.
export type { DeploymentEnv } from "@promptx/shared";
// The SDK's public `Prompt` is the resolved Edge response.
export type { GetPromptResponse as Prompt } from "@promptx/shared";

/** SDK-specific client configuration (not a cross-service contract). */
export interface PromptXConfig {
    apiKey: string;
    baseUrl?: string;
    env?: DeploymentEnv;
    /** How long a cached prompt is served fresh before entering the stale window. */
    cacheMaxAgeMs?: number;
    /** Additional window after max-age during which a stale prompt is served while it refreshes in the background. */
    cacheStaleWhileRevalidateMs?: number;
    requestTimeoutMs?: number;
}
