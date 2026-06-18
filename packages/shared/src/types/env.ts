/**
 * Canonical fetch environments.
 *
 * Only two environments are meaningful at runtime:
 *   - `production`  — served from the managed deployment (traffic split + rollback).
 *                     A requested prompt version, if passed, is ignored.
 *   - `development` — served straight from a version: the one named by the caller
 *                     (`promptVersion`), or the live draft when none is given.
 *                     This lets many developers test their own versions in
 *                     parallel without a shared "dev deployment" slot.
 */
export const DEPLOYMENT_ENVS = ["production", "development"] as const;

export type DeploymentEnv = (typeof DEPLOYMENT_ENVS)[number];

export function isDeploymentEnv(value: unknown): value is DeploymentEnv {
	return typeof value === "string" && (DEPLOYMENT_ENVS as readonly string[]).includes(value);
}
