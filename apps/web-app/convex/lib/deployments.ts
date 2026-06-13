import type { DeploymentEnv, KVPromptConfig } from "../../../../packages/shared/src";
import { promptKvKey } from "../../../../packages/shared/src/utils";
import type { Doc } from "../_generated/dataModel";
import type { CreateDeployConfig } from "../types";
import { invariant } from "./errors";
import type { OwnershipCtx } from "./permissions";

export async function validateAndPrepareDeploymentConfig(
  ctx: OwnershipCtx,
  prompt: Doc<"prompts">,
  env: DeploymentEnv,
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
    env,
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
export async function pushToCFKV(teamId: string, payload: KVPromptConfig) {
  const accountId = process.env["CLOUDFLARE_ACCOUNT_ID"]!;
  const namespaceId = process.env["PROMPTX_PROMPTS_KV"]!;
  const token = process.env["CLOUDFLARE_API_TOKEN"]!;

  const slug = payload.slug;

  const key = promptKvKey(teamId, slug);

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  invariant(response.ok, `Cloudflare KV deployment failed: ${await response.text()}`);
  return payload;
}

export async function deleteFromCFKV(slug: string, teamId: string) {
  const accountId = process.env["CLOUDFLARE_ACCOUNT_ID"]!;
  const namespaceId = process.env["PROMPTX_PROMPTS_KV"]!;
  const token = process.env["CLOUDFLARE_API_TOKEN"]!;

  const key = promptKvKey(teamId, slug);

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  invariant(response.ok, `Cloudflare KV delete failed: ${await response.text()}`);
  return { success: true };
}
