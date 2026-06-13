/** Default runtime tunables shared across packages. */

export const DEFAULT_BASE_URL = "https://edge.promptx.xevos.dev";
export const DEFAULT_CACHE_TTL_MS = 30_000;
export const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;

/** Traffic weights are expressed as percentages (0–100). */
export const TRAFFIC_SCALE = 100;

/** Hash bucket range used for deterministic sticky variant selection. */
export const TRAFFIC_BUCKET_RANGE = 10_000;
