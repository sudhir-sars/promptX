import type { DeploymentEnv } from "../types/env";

/**
 * The HTTP wire contract between the client SDK and the Edge Worker.
 *
 * Single source of truth. Both `@xevos/promptx` (SDK) and `apps/edge`
 * import these types so the request the SDK sends and the response the Edge
 * returns can never drift apart without a compile error.
 *
 * Reconciliation note: the previous SDK validated `slug`/`env` while the Edge
 * returned only `{content, sequence, traffic, routing}`. The canonical
 * response below includes `identifier` + `env` so the SDK can validate a
 * meaningful body, and both sides now share this definition.
 */

/** How a variant was chosen when a deployment has multiple variants. */
export type RoutingInfo =
  | { strategy: "user_sticky"; identifier: string }
  | { strategy: "default" };

/** Route params for GET prompt. */
export interface GetPromptParams {
  identifier: string;
}

/** Query string for GET prompt. */
export interface GetPromptQuery {
  env: DeploymentEnv;
}

/** Canonical success body returned by the Edge for a resolved prompt. */
export interface GetPromptResponse {
  identifier: string;
  env: DeploymentEnv;
  content: string;
  sequence: number;
  traffic: number;
  routing?: RoutingInfo;
}

/** Canonical error body for any non-2xx Edge response. */
export interface EdgeErrorResponse {
  error: string;
}
