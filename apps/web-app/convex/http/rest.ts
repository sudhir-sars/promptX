import {
	createDeploymentSchema,
	createPromptSchema,
	createVersionSchema,
	REST_BASE_PATH,
	updatePromptSchema,
	updateVersionSchema,
} from "@promptx/shared";
import type { HonoWithConvex } from "convex-helpers/server/hono";
import { ConvexError } from "convex/values";
import { type Context, Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { z } from "zod";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import type { ActionCtx } from "../_generated/server";
import { verifyApiKey } from "../lib/apiKeys";
import { pushToCFKV } from "../lib/deployments";
import { type AppError, badRequest } from "../lib/errors";
import type { CreateDeployConfig } from "../types";

/**
 * PromptX platform REST API (`/v0/rest`), built on Hono (via
 * `convex-helpers/server/hono`) so routes are declared with real path params —
 * `/prompts/:promptId/versions/:versionId` — rather than hand-parsed segments.
 *
 * Every request is authenticated with a team API key (`Authorization: Bearer
 * xe_live_...`) and scoped to that key's team; all business logic lives in the
 * team-scoped `internal.rest.*` functions. Prompts are first-class; versions and
 * deployments are sub-resources nested under their prompt (a deployment hangs off
 * the prompt, not a single version — it splits traffic across many versions).
 */

type RestEnv = { teamId: Id<"teams"> };

const STATUS: Record<AppError["code"], ContentfulStatusCode> = {
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	BAD_REQUEST: 400,
	INTERNAL_ERROR: 500,
};

/** Parse + validate a JSON body, throwing a BAD_REQUEST (mapped to HTTP 400). */
async function readBody<T extends z.ZodTypeAny>(c: Context, schema: T): Promise<z.infer<T>> {
	const raw = await c.req.json().catch(() => badRequest("Invalid JSON body"));
	const parsed = schema.safeParse(raw);
	if (!parsed.success) badRequest(parsed.error.issues[0]?.message ?? "Invalid body");
	return parsed.data;
}

export function registerRestRoutes(parent: HonoWithConvex<ActionCtx>) {
	const rest: HonoWithConvex<ActionCtx, RestEnv> = new Hono();

	// Authenticate every request and pin it to the API key's team.
	rest.use("*", async (c, next) => {
		const apiKey = await verifyApiKey(c.env, c.req.header("Authorization") ?? null);
		if (!apiKey) return c.json({ error: "Invalid API key" }, 401);
		c.set("teamId", apiKey.teamId);
		await next();
	});

	rest.onError((err, c) => {
		if (err instanceof ConvexError && typeof err.data?.code === "string") {
			const { code, message } = err.data as AppError;
			return c.json({ error: message }, STATUS[code] ?? 500);
		}
		console.error(err);
		return c.json({ error: "Internal server error" }, 500);
	});

	const promptId = (c: Context) => c.req.param("promptId") as Id<"prompts">;
	const versionId = (c: Context) => c.req.param("versionId") as Id<"versions">;
	const deploymentId = (c: Context) => c.req.param("deploymentId") as Id<"deployments">;

	// --- Prompts ---
	rest.get("/prompts", async (c) =>
		c.json(await c.env.runQuery(internal.rest.listPrompts, { teamId: c.get("teamId") })),
	);
	rest.post("/prompts", async (c) =>
		c.json(
			await c.env.runMutation(internal.rest.createPrompt, {
				teamId: c.get("teamId"),
				...(await readBody(c, createPromptSchema)),
			}),
		),
	);
	rest.get("/prompts/:promptId", async (c) =>
		c.json(await c.env.runQuery(internal.rest.getPrompt, { teamId: c.get("teamId"), promptId: promptId(c) })),
	);
	rest.patch("/prompts/:promptId", async (c) =>
		c.json(
			await c.env.runMutation(internal.rest.updatePrompt, {
				teamId: c.get("teamId"),
				promptId: promptId(c),
				...(await readBody(c, updatePromptSchema)),
			}),
		),
	);
	rest.delete("/prompts/:promptId", async (c) => {
		await c.env.runMutation(internal.rest.deletePrompt, { teamId: c.get("teamId"), promptId: promptId(c) });
		return c.json({ deleted: true });
	});

	// --- Versions (sub-resource of a prompt) ---
	rest.get("/prompts/:promptId/versions", async (c) =>
		c.json(await c.env.runQuery(internal.rest.listVersions, { teamId: c.get("teamId"), promptId: promptId(c) })),
	);
	rest.post("/prompts/:promptId/versions", async (c) =>
		c.json(
			await c.env.runMutation(internal.rest.createVersion, {
				teamId: c.get("teamId"),
				promptId: promptId(c),
				...(await readBody(c, createVersionSchema)),
			}),
		),
	);
	rest.get("/prompts/:promptId/versions/:versionId", async (c) =>
		c.json(
			await c.env.runQuery(internal.rest.getVersion, {
				teamId: c.get("teamId"),
				promptId: promptId(c),
				versionId: versionId(c),
			}),
		),
	);
	rest.patch("/prompts/:promptId/versions/:versionId", async (c) =>
		c.json(
			await c.env.runMutation(internal.rest.updateVersion, {
				teamId: c.get("teamId"),
				promptId: promptId(c),
				versionId: versionId(c),
				...(await readBody(c, updateVersionSchema)),
			}),
		),
	);

	// --- Deployments (prompt-scoped; a deployment splits traffic across versions) ---
	rest.get("/prompts/:promptId/deployments", async (c) =>
		c.json(await c.env.runQuery(internal.rest.listDeployments, { teamId: c.get("teamId"), promptId: promptId(c) })),
	);
	rest.post("/prompts/:promptId/deployments", async (c) => {
		const { config } = await readBody(c, createDeploymentSchema);
		const { deployment, kvPayload } = await c.env.runMutation(internal.rest.deployPromptVersion, {
			teamId: c.get("teamId"),
			promptId: promptId(c),
			config: config as CreateDeployConfig,
		});
		await pushToCFKV(deployment.teamId, kvPayload);
		return c.json(deployment);
	});
	rest.get("/prompts/:promptId/deployments/:deploymentId", async (c) =>
		c.json(
			await c.env.runQuery(internal.rest.getDeployment, {
				teamId: c.get("teamId"),
				promptId: promptId(c),
				deploymentId: deploymentId(c),
			}),
		),
	);
	rest.post("/prompts/:promptId/deployments/:deploymentId/rollback", async (c) => {
		const { newDeployment, kvPayload } = await c.env.runMutation(internal.rest.rollbackDeployment, {
			teamId: c.get("teamId"),
			promptId: promptId(c),
			deploymentId: deploymentId(c),
		});
		await pushToCFKV(newDeployment.teamId, kvPayload);
		return c.json(newDeployment);
	});

	parent.route(REST_BASE_PATH, rest);
}
