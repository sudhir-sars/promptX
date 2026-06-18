// Re-export the canonical wire types so SDK consumers have one import surface.
// The SDK's public `Prompt` is the resolved Edge response.
export type { DeploymentEnv, PromptResponse as Prompt } from "@promptx/shared";

/** Options for a single `getPrompt` call. All optional. */
export interface GetPromptOptions {
	/**
	 * Production only: a stable id (user id, chat id, …) used for sticky A/B
	 * routing across a deployment's variants.
	 */
	sessionId?: string;
	/**
	 * Development only: the prompt version to resolve (the version's name). When
	 * omitted, the live draft (your latest edits) is served. Ignored in production.
	 */
	promptVersion?: string;
}
