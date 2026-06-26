import {
	createDeploymentSchema,
	createPromptSchema,
	createVersionSchema,
	MANAGEMENT_BASE_PATH,
	updatePromptSchema,
	updateVersionSchema,
} from "@promptx/shared";
import { ConvexError } from "convex/values";
import type { z } from "zod";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { type ActionCtx, httpAction } from "../_generated/server";
import { verifyApiKey } from "../lib/apiKeys";
import { pushToCFKV } from "../lib/deployments";
import type { AppError } from "../lib/errors";
import type { CreateDeployConfig } from "../types";
import { type HttpRouter, jsonResponse } from "./lib";

/**
 * Platform-management REST API. Mirrors every write the dashboard can make
 * (author prompts, cut versions, deploy, roll back) so agents and the SDK can
 * drive PromptX headlessly. Authenticated per request with a team API key
 * (`Authorization: Bearer xe_live_...`) and scoped to that key's team; all
 * business logic lives in the team-scoped `internal.management.*` functions.
 *
 * Routing: Convex's HTTP router has no path params, so each method is registered
 * once on the `/v0/manage/` prefix and dispatched here by path segment.
 */

const PREFIX = `${MANAGEMENT_BASE_PATH}/`;

const STATUS: Record<AppError["code"], number> = {
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	BAD_REQUEST: 400,
	INTERNAL_ERROR: 500,
};

/** Parse + validate a JSON body, throwing a BAD_REQUEST that maps to HTTP 400. */
async function readBody<T extends z.ZodTypeAny>(request: Request, schema: T): Promise<z.infer<T>> {
	let raw: unknown;
	try {
		raw = await request.json();
	} catch {
		throw new ConvexError<AppError>({ code: "BAD_REQUEST", message: "Invalid JSON body" });
	}

	const parsed = schema.safeParse(raw);
	if (!parsed.success) {
		throw new ConvexError<AppError>({
			code: "BAD_REQUEST",
			message: parsed.error.issues[0]?.message ?? "Invalid body",
		});
	}

	return parsed.data;
}

/** Resolve the request to a handler result (a JSON-serializable value). */
async function dispatch(ctx: ActionCtx, request: Request, teamId: Id<"teams">) {
	const url = new URL(request.url);
	const [resource, id, sub] = url.pathname.slice(PREFIX.length).split("/").filter(Boolean);
	const method = request.method;

	// /prompts
	if (resource === "prompts" && !id) {
		if (method === "GET") return ctx.runQuery(internal.management.listPrompts, { teamId });
		if (method === "POST") {
			const { name } = await readBody(request, createPromptSchema);
			return ctx.runMutation(internal.management.createPrompt, { teamId, name });
		}
	}

	// /prompts/:promptId
	if (resource === "prompts" && id && !sub) {
		const promptId = id as Id<"prompts">;
		if (method === "GET") return ctx.runQuery(internal.management.getPrompt, { teamId, promptId });
		if (method === "PATCH") {
			const { name } = await readBody(request, updatePromptSchema);
			return ctx.runMutation(internal.management.updatePrompt, { teamId, promptId, name });
		}
		if (method === "DELETE") {
			await ctx.runMutation(internal.management.deletePrompt, { teamId, promptId });
			return { deleted: true };
		}
	}

	// /prompts/:promptId/versions
	if (resource === "prompts" && id && sub === "versions") {
		const promptId = id as Id<"prompts">;
		if (method === "GET") return ctx.runQuery(internal.management.listVersions, { teamId, promptId });
		if (method === "POST") {
			const body = await readBody(request, createVersionSchema);
			return ctx.runMutation(internal.management.createVersion, { teamId, promptId, ...body });
		}
	}

	// /prompts/:promptId/deployments
	if (resource === "prompts" && id && sub === "deployments") {
		const promptId = id as Id<"prompts">;
		if (method === "GET") return ctx.runQuery(internal.management.listDeployments, { teamId, promptId });
		if (method === "POST") {
			const { config } = await readBody(request, createDeploymentSchema);
			const { deployment, kvPayload } = await ctx.runMutation(internal.management.deployPromptVersion, {
				teamId,
				promptId,
				config: config as CreateDeployConfig,
			});
			await pushToCFKV(deployment.teamId, kvPayload);
			return deployment;
		}
	}

	// /versions/:versionId
	if (resource === "versions" && id && !sub && method === "PATCH") {
		const body = await readBody(request, updateVersionSchema);
		return ctx.runMutation(internal.management.updateVersion, { teamId, versionId: id as Id<"versions">, ...body });
	}

	// /deployments/:deploymentId/rollback
	if (resource === "deployments" && id && sub === "rollback" && method === "POST") {
		const { newDeployment, kvPayload } = await ctx.runMutation(internal.management.rollbackDeployment, {
			teamId,
			rollbackTo: id as Id<"deployments">,
		});
		await pushToCFKV(newDeployment.teamId, kvPayload);
		return newDeployment;
	}

	throw new ConvexError<AppError>({ code: "NOT_FOUND", message: `No route for ${method} ${url.pathname}` });
}

export function registerManagementRoutes(http: HttpRouter) {
	const handler = httpAction(async (ctx, request) => {
		const apiKey = await verifyApiKey(ctx, request.headers.get("Authorization"));
		if (!apiKey) return jsonResponse({ error: "Invalid API key" }, 401);

		try {
			return jsonResponse(await dispatch(ctx, request, apiKey.teamId), 200);
		} catch (error) {
			if (error instanceof ConvexError && typeof error.data?.code === "string") {
				const { code, message } = error.data as AppError;
				return jsonResponse({ error: message }, STATUS[code] ?? 500);
			}
			console.error(error);
			return jsonResponse({ error: "Internal server error" }, 500);
		}
	});

	for (const method of ["GET", "POST", "PATCH", "DELETE"] as const) {
		http.route({ pathPrefix: PREFIX, method, handler });
	}
}
