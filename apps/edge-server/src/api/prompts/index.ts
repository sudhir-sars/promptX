import { type GetPromptResponse, isDeploymentEnv, type KVPromptConfig, promptKvKey } from "@promptx/shared";
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

	const response: GetPromptResponse = {
		identifier,
		env,
		content: selected.content,
		sequence: selected.sequence,
		traffic: selected.traffic,
	};

	if (variants.length > 1) {
		response.routing = sessionId ? { strategy: "user_sticky", identifier: sessionId } : { strategy: "default" };
	}

	return c.json(response, 200);
});

export default app;
