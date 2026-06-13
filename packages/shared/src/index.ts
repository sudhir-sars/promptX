/**
 * @promptx/shared — framework-agnostic contracts shared by the SDK, the Edge
 * Worker, and the Web App.
 *
 * Scope is deliberately narrow: only the small, verified prompt/KV payload and
 * the SDK↔Edge wire contract. No raw table/domain entity types live here — the
 * SDK and Edge never need them.
 *
 * Layers (import narrowly via subpaths when you can):
 *   - "@promptx/shared/types"      primitives (DeploymentEnv)
 *   - "@promptx/shared/contracts"  cross-boundary DTOs (HTTP, KV, API-key)
 *   - "@promptx/shared/constants"  routes, defaults
 *   - "@promptx/shared/utils"      pure helpers (kv keys, api-key parsing)
 */
export * from "./types";
export * from "./contracts";
export * from "./constants";
export * from "./utils";
