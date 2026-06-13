"use node";

import { v } from "convex/values";

import { authedAction } from "../lib/auth";
import { internal } from "../_generated/api";
import { pushToCFKV } from "../lib/deployments";
import {
    createDeployConfig,
    deploymentEnv,
    DeployPromptVersionResult,
    RollbackDeploymentResult,
} from "../types";

export const rollbackDeployment = authedAction({
    args: {
        rollbackTo: v.id("deployments"),
        currentDeploymentId: v.id("deployments"),
    },
    handler: async (ctx, { rollbackTo, currentDeploymentId }) => {
        const x: RollbackDeploymentResult = await ctx.runMutation(
            internal.deployments._rollbackDeploymentDb,
            {
                rollbackTo,
                userId: ctx.userId,
                currentDeploymentId,
            },
        );
        const { newDeployment, prevDeployment, kvPayload } = x;

        await pushToCFKV(newDeployment.teamId, kvPayload);

        return { newDeployment, prevDeployment };
    },
});

export const deployPromptVersion = authedAction({
    args: {
        promptId: v.id("prompts"),
        config: createDeployConfig,
        env: deploymentEnv,
    },
    handler: async (ctx, { promptId, config, env }) => {
        const result: DeployPromptVersionResult = await ctx.runMutation(
            internal.deployments._deployPromptVersionDb,
            {
                promptId,
                config,
                userId: ctx.userId,
                env,
            },
        );
        const { deployment, kvPayload } = result;

        await pushToCFKV(promptId, kvPayload);

        return { deployment };
    },
});
