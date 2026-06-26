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

/**
 * Resolve the request to a handler result (a JSON-serializable value). Prompts
 * are first-class; versions and deployments are sub-resources nested under their
 * prompt, so every path begins `/prompts/:promptId/...`. (Deployments hang off the
 * prompt, not a single version — a deployment splits traffic across many versions.)
 */
async function dispatch(ctx: ActionCtx, request: Request, teamId: Id<"teams">) {
	const url = new URL(request.url);
	const segments = url.pathname.slice(PREFIX.length).split("/").filter(Boolean);
	const method = request.method;

	const [root, promptIdRaw, child, childIdRaw, action] = segments;
	const promptId = promptIdRaw as Id<"prompts">;

	if (root !== "prompts") {
		throw new ConvexError<AppError>({ code: "NOT_FOUND", message: `No route for ${method} ${url.pathname}` });
	}

	// /prompts
	if (!promptIdRaw) {
		if (method === "GET") return ctx.runQuery(internal.management.listPrompts, { teamId });
		if (method === "POST") {
			const { name } = await readBody(request, createPromptSchema);
			return ctx.runMutation(internal.management.createPrompt, { teamId, name });
		}
	}

	// /prompts/:promptId
	else if (!child) {
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

	// /prompts/:promptId/versions[/:versionId]
	else if (child === "versions") {
		const versionId = childIdRaw as Id<"versions">;
		if (!childIdRaw && method === "GET") return ctx.runQuery(internal.management.listVersions, { teamId, promptId });
		if (!childIdRaw && method === "POST") {
			const body = await readBody(request, createVersionSchema);
			return ctx.runMutation(internal.management.createVersion, { teamId, promptId, ...body });
		}
		if (childIdRaw && method === "GET") {
			return ctx.runQuery(internal.management.getVersion, { teamId, promptId, versionId });
		}
		if (childIdRaw && method === "PATCH") {
			const body = await readBody(request, updateVersionSchema);
			return ctx.runMutation(internal.management.updateVersion, { teamId, promptId, versionId, ...body });
		}
	}

	// /prompts/:promptId/deployments[/:deploymentId[/rollback]]
	else if (child === "deployments") {
		const deploymentId = childIdRaw as Id<"deployments">;
		if (!childIdRaw && method === "GET") return ctx.runQuery(internal.management.listDeployments, { teamId, promptId });
		if (!childIdRaw && method === "POST") {
			const { config } = await readBody(request, createDeploymentSchema);
			const { deployment, kvPayload } = await ctx.runMutation(internal.management.deployPromptVersion, {
				teamId,
				promptId,
				config: config as CreateDeployConfig,
			});
			await pushToCFKV(deployment.teamId, kvPayload);
			return deployment;
		}
		if (childIdRaw && !action && method === "GET") {
			return ctx.runQuery(internal.management.getDeployment, { teamId, promptId, deploymentId });
		}
		if (childIdRaw && action === "rollback" && method === "POST") {
			const { newDeployment, kvPayload } = await ctx.runMutation(internal.management.rollbackDeployment, {
				teamId,
				promptId,
				deploymentId,
			});
			await pushToCFKV(newDeployment.teamId, kvPayload);
			return newDeployment;
		}
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
