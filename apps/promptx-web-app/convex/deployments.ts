import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { authedQuery } from "./lib/auth";
import { internalMutation } from "./_generated/server";
import { validateAndPrepareDeploymentConfig } from "./lib/deployments";
import { invariant } from "./lib/errors";
import { requireDeploymentAccess, requirePromptAccess } from "./lib/permissions";
import {
    createDeployConfig,
    deploymentEnv,
    DeployPromptVersionResult,
    RollbackDeploymentResult,
} from "./types";

export const listDeployments = authedQuery({
    args: {
        promptId: v.id("prompts"),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, { promptId, paginationOpts }) => {
        await requirePromptAccess(ctx, promptId);
        return ctx.db
            .query("deployments")
            .withIndex("by_prompt_env", (q) => q.eq("promptId", promptId))
            .order("desc")
            .paginate(paginationOpts);
    },
});

export const _deployPromptVersionDb = internalMutation({
    args: {
        promptId: v.id("prompts"),
        config: createDeployConfig,
        env: deploymentEnv,
        userId: v.id("users"),
    },
    handler: async (ctx, { promptId, config, env, userId }) => {
        const authedCtx = { ...ctx, userId };

        const { prompt } = await requirePromptAccess(authedCtx, promptId);

        const { deploymentConfig, kvPayload } = await validateAndPrepareDeploymentConfig(
            authedCtx,
            prompt,
            env,
            config,
        );

        const activeDeployment = await ctx.db
            .query("deployments")
            .withIndex("by_prompt_env_active", (q) =>
                q.eq("promptId", promptId).eq("env", env).eq("active", true),
            )
            .unique();

        if (activeDeployment) {
            await ctx.db.patch(activeDeployment._id, {
                active: false,
            });
        }

        const deploymentId = await ctx.db.insert("deployments", {
            teamId: prompt.teamId,
            promptId,
            env,
            config: deploymentConfig,
            active: true,
        });

        const deployment = await ctx.db.get(deploymentId);

        invariant(deployment, "Deployment not found");
        const result: DeployPromptVersionResult = {
            deployment,
            kvPayload,
        };

        return result;
    },
});

export const _rollbackDeploymentDb = internalMutation({
    args: {
        rollbackTo: v.id("deployments"),
        currentDeploymentId: v.id("deployments"),
        userId: v.id("users"),
    },
    handler: async (ctx, { rollbackTo, userId, currentDeploymentId }) => {
        const authedCtx = { ...ctx, userId };

        const { deployment: targetDeployment } = await requireDeploymentAccess(
            authedCtx,
            rollbackTo,
        );
        const { deployment: currentDeployment } = await requireDeploymentAccess(
            authedCtx,
            currentDeploymentId,
        );

        invariant(currentDeployment.active, "Current deployment must be active");

        invariant(
            currentDeployment.promptId === targetDeployment.promptId,
            "Deployments must belong to same prompt",
        );

        invariant(
            currentDeployment.env === targetDeployment.env,
            "Deployments must belong to same environment",
        );

        await ctx.db.patch(currentDeployment._id, {
            active: false,
        });

        const prompt = await ctx.db.get(targetDeployment.promptId);

        invariant(prompt, "Prompt not found");

        const { kvPayload } = await validateAndPrepareDeploymentConfig(
            authedCtx,
            prompt,
            currentDeployment.env,
            targetDeployment.config,
        );

        const rollbackDeploymentId = await ctx.db.insert("deployments", {
            teamId: currentDeployment.teamId,
            promptId: currentDeployment.promptId,
            env: currentDeployment.env,
            config: targetDeployment.config,
            active: true,
            rolledBackTo: targetDeployment._id,
        });

        const newDeployment = await ctx.db.get(rollbackDeploymentId);

        invariant(newDeployment, "Rollback deployment not found");

        const result: RollbackDeploymentResult = {
            newDeployment,
            prevDeployment: currentDeployment,
            kvPayload,
        };

        return result;
    },
});
