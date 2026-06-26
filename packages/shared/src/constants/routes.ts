/** API surface constants shared by the SDK and Edge. */

export const API_VERSION = "v0";

/** Base path for the prompts resource, e.g. `/v0/prompts`. */
export const PROMPTS_BASE_PATH = `/${API_VERSION}/prompts` as const;

/**
 * Path of the Convex-hosted development prompt endpoint, e.g. `/v0/dev/prompt`.
 * Served by the Convex HTTP router (not the edge). The SDK calls it directly for
 * `env=development` so edits are instant. The prompt identifier and an optional
 * prompt version travel as query params; the API key travels in the
 * `Authorization` header.
 */
export const DEV_PROMPT_PATH = `/${API_VERSION}/dev/prompt` as const;

/** Query-param name carrying the prompt identifier on the development endpoint. */
export const DEV_PROMPT_IDENTIFIER_PARAM = "identifier";

/**
 * Query-param name carrying the requested prompt version on the development
 * endpoint. When present, the version with this name is resolved; when absent,
 * the live draft is served.
 */
export const DEV_PROMPT_VERSION_PARAM = "promptVersion";

/**
 * Base path of the Convex-hosted platform REST API, e.g. `/v0/rest`. Served by
 * the Convex HTTP router (same `.convex.site` host as the dev endpoint). Every
 * route is authenticated with a team API key in the `Authorization` header and
 * scoped to that key's team — it lets agents and the SDK do everything the
 * dashboard does (author prompts, cut versions, deploy, roll back) without a
 * browser session.
 */
export const REST_BASE_PATH = `/${API_VERSION}/rest` as const;

/** Header carrying the sticky-routing session id. */
export const SESSION_HEADER = "x-promptx-session-id";

/** Build the path for a single prompt resource. */
export function promptResourcePath(identifier: string): string {
	return `${PROMPTS_BASE_PATH}/${encodeURIComponent(identifier)}`;
}
