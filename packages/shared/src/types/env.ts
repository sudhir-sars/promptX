/**
 * Canonical deployment environments.
 *
 * Reconciles the three divergent definitions that existed across the repos:
 *   - SDK (published)  : production | staging | preview   ← `staging` was legacy
 *   - SDK (ztypes)     : production | development | preview
 *   - Edge             : production | development | preview
 *   - Convex           : production | preview | development
 *
 * The runtime (Edge) and persistence (Convex) agreed on these three, so they
 * are the source of truth. `staging` is intentionally dropped.
 */
export const DEPLOYMENT_ENVS = ["production", "preview", "development"] as const;

export type DeploymentEnv = (typeof DEPLOYMENT_ENVS)[number];

export function isDeploymentEnv(value: unknown): value is DeploymentEnv {
  return typeof value === "string" && (DEPLOYMENT_ENVS as readonly string[]).includes(value);
}
