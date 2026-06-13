import { v } from "convex/values";

import { internalMutation } from "./_generated/server";

import { notFound } from "./lib/errors";
import { cascadeDeleteUser } from "./lib/cascade";
import { authedQuery } from "./lib/auth";
import { createDefaultTeam } from "./lib/defaults";
import { AuthedCtx } from "./types";

export const upsertUser = internalMutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        avatar: v.string(),
    },

    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (existingUser) {
            await ctx.db.patch(existingUser._id, {
                email: args.email,
                name: args.name,
                avatar: args.avatar,
            });

            return existingUser._id;
        }

        const userId = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            name: args.name,
            avatar: args.avatar,
        });

        await createDefaultTeam(ctx, { ...args, userId });

        return userId;
    },
});

export const getUser = authedQuery({
    args: {},

    handler: async (ctx) => {
        const user = await ctx.db.get(ctx.userId);

        if (!user) notFound("User");

        return user;
    },
});

export const deleteUser = internalMutation({
    args: {
        clerkId: v.string(),
    },

    handler: async (ctx, { clerkId }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk", (q) => q.eq("clerkId", clerkId))
            .unique();

        if (!user) return;

        await cascadeDeleteUser(ctx, user._id);
    },
});
