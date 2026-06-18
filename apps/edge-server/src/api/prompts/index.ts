import { promptResponseSchema, isDeploymentEnv, type KVPromptConfig, promptKvKey } from "@promptx/shared";
import { Hono } from "hono";
import type { AppEnv } from "../../types";
import { selectVariant } from "./utils";

const app = new Hono<AppEnv>();

// Mounted at PROMPTS_BASE_PATH (`/v0/prompts`) by src/index.ts.
app.get("/:identifier", async (c) => {
	const identifier = c.req.param("identifier");
	const envParam = c.req.query("env") ?? "production";
	const env = isDeploymentEnv(envParam) ? envParam : "production";

	const sessionId = c.get("sessionId");
	const teamId = c.get("teamId");

	const prompt = await c.env.PROMPTX_PROMPTS_KV.get<KVPromptConfig>(promptKvKey(teamId, identifier), "json");

	if (!prompt) {
		return c.json({ error: "Prompt not found" }, 404);
	}

	if (prompt.teamId !== teamId) {
		return c.json({ error: "Unauthorized — key does not match prompt owner" }, 401);
	}

	if (prompt.env !== env) {
		return c.json({ error: "No active deployment for this environment" }, 503);
	}

	const variants = prompt.variants;

	if (variants.length === 0) {
		return c.json({ error: "No active deployment for this environment" }, 503);
	}

	const selected = await selectVariant(identifier, variants, sessionId);

	// Validate the response against the shared contract before sending it.
	const response = promptResponseSchema.parse({
		identifier,
		env,
		content: selected.content,
		sequence: selected.sequence,
		traffic: selected.traffic,
		routing:
			variants.length > 1
				? sessionId
					? { strategy: "user_sticky", identifier: sessionId }
					: { strategy: "default" }
				: undefined,
	});

	return c.json(response, 200);
});

export default app;
