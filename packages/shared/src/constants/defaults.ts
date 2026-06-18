/** Default runtime tunables shared across packages. */

export const DEFAULT_BASE_URL = "https://edge.promptx.xevos.dev";

/**
 * Base URL for `env=development` fetches, which hit the Convex backend directly
 * (read-your-writes consistent, so edits are instant) instead of the cached
 * edge. This is the deployment's Convex *HTTP actions* origin (the `.convex.site`
 * host, not `.convex.cloud`).
 */
export const DEFAULT_DEV_BASE_URL = "https://befitting-cat-123.convex.site";

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
