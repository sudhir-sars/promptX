// lib/cascade.ts

import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

export async function cascadeDeletePrompt(ctx: MutationCtx, promptId: Id<"prompts">) {
    const versions = await ctx.db
        .query("versions")
        .withIndex("by_prompt", (q) => q.eq("promptId", promptId))
        .collect();

    const deployments = await ctx.db
        .query("deployments")
        .withIndex("by_prompt", (q) => q.eq("promptId", promptId))
        .collect();

    for (const deployment of deployments) {
        await ctx.db.delete(deployment._id);
    }

    for (const version of versions) {
        await ctx.db.delete(version._id);
    }

    await ctx.db.delete(promptId);
}

export async function cascadeDeleteTeam(ctx: MutationCtx, teamId: Id<"teams">) {
    const prompts = await ctx.db
        .query("prompts")
        .withIndex("by_team", (q) => q.eq("teamId", teamId))
        .collect();

    for (const prompt of prompts) {
        await cascadeDeletePrompt(ctx, prompt._id);
    }

    const members = await ctx.db
        .query("members")
        .withIndex("by_team", (q) => q.eq("teamId", teamId))
        .collect();

    for (const membership of members) {
        await ctx.db.delete(membership._id);
    }

    const invites = await ctx.db
        .query("invites")
        .withIndex("by_team", (q) => q.eq("teamId", teamId))
        .collect();

    for (const invite of invites) {
        await ctx.db.delete(invite._id);
    }

    const logs = await ctx.db
        .query("auditLogs")
        .withIndex("by_team", (q) => q.eq("teamId", teamId))
        .collect();

    for (const log of logs) {
        await ctx.db.delete(log._id);
    }

    await ctx.db.delete(teamId);
}

export async function cascadeDeleteUser(ctx: MutationCtx, userId: Id<"users">) {
    const teams = await ctx.db
        .query("teams")
        .withIndex("by_owner", (q) => q.eq("ownerId", userId))
        .collect();

    for (const team of teams) {
        await cascadeDeleteTeam(ctx, team._id);

        const apiKeys = await ctx.db
            .query("apiKeys")
            .withIndex("by_team", (q) => q.eq("teamId", team._id))
            .collect();

        for (const apiKey of apiKeys) {
            await ctx.db.delete(apiKey._id);
        }
    }

    const members = await ctx.db
        .query("members")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

    for (const membership of members) {
        await ctx.db.delete(membership._id);
    }

    await ctx.db.delete(userId);
}
