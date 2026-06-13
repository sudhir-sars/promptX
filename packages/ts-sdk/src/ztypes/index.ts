import type { DeploymentEnv } from "@promptx/shared";

// Re-export the canonical wire types so SDK consumers have one import surface.
export type { DeploymentEnv } from "@promptx/shared";
// The SDK's public `Prompt` is the resolved Edge response.
export type { GetPromptResponse as Prompt } from "@promptx/shared";

/** SDK-specific client configuration (not a cross-service contract). */
export interface XevosConfig {
    apiKey: string;
    baseUrl?: string;
    env?: DeploymentEnv;
    cacheTtlMs?: number;
    requestTimeoutMs?: number;
}
