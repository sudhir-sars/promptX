/** Default runtime tunables shared across packages. */

export const DEFAULT_BASE_URL = "https://edge.promptx.xevos.dev";
export const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;

/** How long a cached prompt is served fresh (no background refresh). */
export const DEFAULT_CACHE_MAX_AGE_MS = 60_000;

/**
 * Stale-while-revalidate window: after `DEFAULT_CACHE_MAX_AGE_MS`, a cached
 * prompt is still served for this additional period while a background refresh
 * runs. Past max-age + this window the entry is expired (a true cache miss).
 */
export const DEFAULT_CACHE_STALE_WHILE_REVALIDATE_MS = 60_000;

/** Traffic weights are expressed as percentages (0–100). */
export const TRAFFIC_SCALE = 100;

/** Hash bucket range used for deterministic sticky variant selection. */
export const TRAFFIC_BUCKET_RANGE = 10_000;
