import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { auditAction, auditResource, deploymentEnv } from "./types";

export default defineSchema({
	users: defineTable({
		clerkId: v.string(),
		email: v.string(),
		name: v.string(),
		avatar: v.string(),
	})
		.index("by_clerk", ["clerkId"])
		.index("by_email", ["email"]),

	teams: defineTable({
		ownerId: v.id("users"),
		name: v.string(),
		avatar: v.optional(v.string()),

		meta: v.object({
			memberCount: v.number(),
			promptCount: v.number(),
		}),
	}).index("by_owner", ["ownerId"]),

	members: defineTable({
		teamId: v.id("teams"),
		userId: v.id("users"),

		role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),

		meta: v.object({
			name: v.string(),
			email: v.string(),
			avatar: v.string(),
		}),
	})
		.index("by_team", ["teamId"])
		.index("by_user", ["userId"])
		.index("by_team_user", ["teamId", "userId"]),

	invites: defineTable({
		teamId: v.id("teams"),
		email: v.string(),
		invitedBy: v.id("users"),

		code: v.string(),

		role: v.union(v.literal("admin"), v.literal("member")),
	})
		.index("by_team", ["teamId"])
		.index("by_code", ["code"]),

	prompts: defineTable({
		teamId: v.id("teams"),
		name: v.string(),
		slug: v.string(),
	})
		.index("by_team", ["teamId"])
		.index("by_team_name", ["teamId", "name"])
		.searchIndex("search_name", {
			searchField: "name",
			filterFields: ["teamId"],
		}),

	versions: defineTable({
		teamId: v.id("teams"),
		promptId: v.id("prompts"),
		tag: v.optional(v.string()),
		sequence: v.number(),
		draft: v.boolean(),
		content: v.string(),
		updatedAt: v.number(),
	})
		.index("by_team", ["teamId"])
		.index("by_prompt", ["promptId"])
		.index("by_prompt_draft", ["promptId", "draft"])
		.index("by_prompt_tag", ["promptId", "tag"])
		.index("by_prompt_sequence", ["promptId", "sequence"])
		.searchIndex("tags", {
			searchField: "tag",
			filterFields: ["teamId", "promptId"],
		}),

	deployments: defineTable({
		teamId: v.id("teams"),
		promptId: v.id("prompts"),
		env: deploymentEnv,
		config: v.array(
			v.object({
				versionId: v.id("versions"),
				traffic: v.number(),
				sequence: v.number(),
			}),
		),

		active: v.boolean(),
		rolledBackTo: v.optional(v.id("deployments")),
	})
		.index("by_team", ["teamId"])
		.index("by_team_active", ["teamId", "active"])
		.index("by_prompt", ["promptId"])
		.index("by_prompt_env", ["promptId", "env"])
		.index("by_prompt_env_active", ["promptId", "env", "active"]),

	apiKeys: defineTable({
		teamId: v.id("teams"),
		name: v.optional(v.string()),

		prefix: v.string(),
		hash: v.string(),
		keyId: v.string(),

		revokedAt: v.optional(v.number()),
	})
		.index("by_team", ["teamId"])
		.index("by_team_revoked", ["teamId", "revokedAt"])
		.index("by_keyId", ["keyId"]),

	auditLogs: defineTable({
		ownerId: v.id("users"),
		teamId: v.optional(v.id("teams")),

		actorId: v.id("users"),

		action: auditAction,
		resource: auditResource,
		resourceId: v.string(),

		metadata: v.optional(v.any()),
	})
		.index("by_owner", ["ownerId"])
		.index("by_team", ["teamId"]),
});
