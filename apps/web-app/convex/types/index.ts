import { Infer, v } from "convex/values";

import { Doc, Id } from "../_generated/dataModel";
import { ActionCtx, MutationCtx } from "../_generated/server";

// ---------------------------------------------------------------------------
// Cross-service contracts now live in @promptx/shared. Re-export the ones used
// across Convex so existing imports from "./types" keep working, but the shape
// is owned by the shared package (single source of truth with the Edge).
// ---------------------------------------------------------------------------
export type {
    DeploymentEnv,
    KVPromptConfig,
    PromptKVKey,
    ApiKeyKVKey,
    ApiKeyRecord,
} from "@promptx/shared";

import type { KVPromptConfig } from "@promptx/shared";

// ---------------------------------------------------------------------------
// Convex PERSISTENCE models (Doc<>-backed). These stay coupled to Convex by
// design — only the small verified prompt/KV payload is shared with the Edge
// (see the re-exports above).
// ---------------------------------------------------------------------------
export type User = Doc<"users">;
export type Prompt = Doc<"prompts">;
export type Version = Doc<"versions">;
export type Deployment = Doc<"deployments">;
export type ApiKey = Doc<"apiKeys">;
export type AuditLog = Doc<"auditLogs">;
export type Invite = Doc<"invites">;
export type Member = Doc<"members">;
export type Team = Doc<"teams">;

export type AuthedCtx = MutationCtx & {
    avatar: string;
    name: string;
    email: string;
    userId: Id<"users">;
};

/** @deprecated Prefer `ApiKeyRecord` from @promptx/shared. */
export type CfKeyRecords = {
    keyId: string;
    hash: string;
};

export type AuthedActionCtx = ActionCtx & {
    userId: Id<"users">;
};

export const createDeployConfig = v.array(
    v.object({
        versionId: v.id("versions"),
        traffic: v.number(),
        sequence: v.number(),
    }),
);

export const deploymentEnv = v.union(
    v.literal("production"),
    v.literal("preview"),
    v.literal("development"),
);

export type CreateDeployConfig = Infer<typeof createDeployConfig>;

export interface RollbackDeploymentResult {
    newDeployment: Doc<"deployments">;
    prevDeployment: Doc<"deployments">;
    kvPayload: KVPromptConfig;
}

export interface DeployPromptVersionResult {
    deployment: Doc<"deployments">;
    kvPayload: KVPromptConfig;
}

export const auditAction = v.union(
    v.literal("create"),
    v.literal("update"),
    v.literal("delete"),

    v.literal("activate"),
    v.literal("deactivate"),

    v.literal("accept"),
    v.literal("decline"),
    v.literal("cancel"),

    v.literal("revoke"),

    v.literal("join"),
    v.literal("leave"),
);

export const auditResource = v.union(
    v.literal("team"),
    v.literal("membership"),
    v.literal("invite"),

    v.literal("prompt"),
    v.literal("version"),
    v.literal("deployment"),

    v.literal("apiKey"),
);
