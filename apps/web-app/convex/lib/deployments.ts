import type { KVPromptConfig } from "../../../../packages/shared/src";
import { promptKvKey } from "../../../../packages/shared/src/utils";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { type CreateDeployConfig, type DeployPromptVersionResult, type RollbackDeploymentResult } from "../types";
import { invariant } from "./errors";
import type { OwnershipCtx } from "./permissions";

export async function validateAndPrepareDeploymentConfig(
	ctx: Pick<OwnershipCtx, "db">,
	prompt: Doc<"prompts">,
	config: CreateDeployConfig,
) {
	invariant(config.length > 0, "At least one version is required");

	const totalTraffic = config.reduce((sum, deployment) => sum + deployment.traffic, 0);

	invariant(totalTraffic === 100, "Traffic allocation must equal 100%");

	const versionIds = new Set<string>();

	for (const deployment of config) {
		invariant(deployment.traffic >= 0, "Traffic cannot be negative");
		invariant(deployment.traffic <= 100, "Traffic cannot exceed 100%");

		const key = deployment.versionId.toString();

		invariant(!versionIds.has(key), "Duplicate version allocation");

		versionIds.add(key);
	}

	const versions = await Promise.all(
		config.map(async ({ versionId }) => {
			const version = await ctx.db.get(versionId);

			invariant(version, "Version not found");

			invariant(version.promptId === prompt._id, "Version does not belong to prompt");

			invariant(!version.draft, "Draft versions cannot be deployed");

			return version;
		}),
	);

	const deploymentConfig: Doc<"deployments">["config"] = versions.map((version, index) => {
		const entry = config[index];

		invariant(entry, "Deployment config entry not found");

		return {
			versionId: version._id,
			traffic: entry.traffic,
			sequence: version.sequence,
		};
	});

	const kvPayload: KVPromptConfig = {
		teamId: prompt.teamId,
		slug: prompt.slug,
		// Deployments are production-only now; development is served per-version
		// from the version catalog, not from a deployment.
		env: "production",
		variants: versions.map((version, index) => {
			const entry = deploymentConfig[index];

			invariant(entry, "Deployment config entry not found");

			return {
				content: version.content,
				traffic: entry.traffic,
				sequence: entry.sequence,
			};
		}),
	};

	return {
		deploymentConfig,
		kvPayload,
	};
}

/**
 * Shared deployment operations, called by both the dashboard (`deployments.ts`,
 * Clerk auth) and the REST API (`rest.ts`, API-key auth). Authorization happens
 * in the caller; the returned `kvPayload` must be pushed to the edge by the
 * caller (`pushToCFKV`), which only an action/HTTP handler can do.
 */

/** Release a new active deployment for a prompt, retiring the current active one. */
export async function releaseDeployment(
	ctx: MutationCtx,
	prompt: Doc<"prompts">,
	config: CreateDeployConfig,
): Promise<DeployPromptVersionResult> {
	const { deploymentConfig, kvPayload } = await validateAndPrepareDeploymentConfig(ctx, prompt, config);

	const active = await ctx.db
		.query("deployments")
		.withIndex("by_prompt_active", (q) => q.eq("promptId", prompt._id).eq("active", true))
		.unique();

	if (active) await ctx.db.patch(active._id, { active: false });

	const deploymentId = await ctx.db.insert("deployments", {
		teamId: prompt.teamId,
		promptId: prompt._id,
		config: deploymentConfig,
		active: true,
	});

	const deployment = await ctx.db.get(deploymentId);
	invariant(deployment, "Deployment not found");

	return { deployment, kvPayload };
}

/** Re-release a previous deployment's config as the new active deployment. */
export async function rollbackToDeployment(
	ctx: MutationCtx,
	prompt: Doc<"prompts">,
	target: Doc<"deployments">,
): Promise<RollbackDeploymentResult> {
	const current = await ctx.db
		.query("deployments")
		.withIndex("by_prompt_active", (q) => q.eq("promptId", prompt._id).eq("active", true))
		.unique();

	invariant(current, "No active deployment to roll back from");

	const { kvPayload } = await validateAndPrepareDeploymentConfig(ctx, prompt, target.config);

	await ctx.db.patch(current._id, { active: false });

	const rollbackId = await ctx.db.insert("deployments", {
		teamId: prompt.teamId,
		promptId: prompt._id,
		config: target.config,
		active: true,
		rolledBackTo: target._id,
	});

	const newDeployment = await ctx.db.get(rollbackId);
	invariant(newDeployment, "Rollback deployment not found");

	return { newDeployment, prevDeployment: current, kvPayload };
}

function cfKvNamespaceUrl(key: string) {
	const accountId = process.env["CLOUDFLARE_ACCOUNT_ID"]!;
	const namespaceId = process.env["PROMPTX_PROMPTS_KV"]!;

	return `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`;
}

async function cfKvPut(key: string, payload: unknown) {
	const token = process.env["CLOUDFLARE_API_TOKEN"]!;

	const response = await fetch(cfKvNamespaceUrl(key), {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	invariant(response.ok, `Cloudflare KV write failed: ${await response.text()}`);
}

async function cfKvDelete(key: string) {
	const token = process.env["CLOUDFLARE_API_TOKEN"]!;

	const response = await fetch(cfKvNamespaceUrl(key), {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	});

	invariant(response.ok, `Cloudflare KV delete failed: ${await response.text()}`);
}

export async function pushToCFKV(teamId: Id<"teams">, payload: KVPromptConfig) {
	await cfKvPut(promptKvKey(teamId, payload.slug), payload);
	return payload;
}

export async function deleteFromCFKV(slug: string, teamId: string) {
	await cfKvDelete(promptKvKey(teamId, slug));
	return { success: true };
}
