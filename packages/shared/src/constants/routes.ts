/** API surface constants shared by the SDK and Edge. */

export const API_VERSION = "v0";

/** Base path for the prompts resource, e.g. `/v0/prompts`. */
export const PROMPTS_BASE_PATH = `/${API_VERSION}/prompts` as const;

/** Header carrying the sticky-routing session id. */
export const SESSION_HEADER = "x-promptx-session-id";

/** Build the path for a single prompt resource. */
export function promptResourcePath(identifier: string): string {
	return `${PROMPTS_BASE_PATH}/${encodeURIComponent(identifier)}`;
}
