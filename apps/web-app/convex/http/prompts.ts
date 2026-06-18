import {
	DEV_PROMPT_IDENTIFIER_PARAM,
	DEV_PROMPT_PATH,
	DEV_PROMPT_VERSION_PARAM,
	promptResponseSchema,
} from "@promptx/shared";
import { internal } from "../_generated/api";
import { httpAction } from "../_generated/server";
import { verifyApiKey } from "../lib/apiKeys";
import { type HttpRouter, jsonResponse } from "./lib";

/**
 * Public development prompt endpoint. The SDK calls this directly for
 * `env=development`, bypassing the cached edge so a developer's edits are visible
 * immediately. Authenticates the caller's API key and resolves the prompt
 * straight from Convex (read-your-writes consistent).
 */
export function registerPromptRoutes(http: HttpRouter) {
	http.route({
		path: DEV_PROMPT_PATH,
		method: "GET",

		handler: httpAction(async (ctx, request) => {
			const apiKey = await verifyApiKey(ctx, request.headers.get("Authorization"));

			if (!apiKey) {
				return jsonResponse({ error: "Invalid API key" }, 401);
			}

			const url = new URL(request.url);
			const identifier = url.searchParams.get(DEV_PROMPT_IDENTIFIER_PARAM);
			const promptVersion = url.searchParams.get(DEV_PROMPT_VERSION_PARAM) ?? undefined;

			if (!identifier) {
				return jsonResponse({ error: "Missing identifier" }, 400);
			}

			const resolved = await ctx.runQuery(internal.versions._resolveDevPrompt, {
				teamId: apiKey.teamId,
				slug: identifier,
				promptVersion,
			});

			if (!resolved) {
				return jsonResponse(
					{
						error: promptVersion
							? `No prompt version named "${promptVersion}" found`
							: "No versions found for this prompt",
					},
					404,
				);
			}

			// Validate the response against the shared contract before sending it.
			const response = promptResponseSchema.parse({
				identifier,
				env: "development",
				content: resolved.content,
				sequence: resolved.sequence,
				traffic: 100,
			});

			return jsonResponse(response, 200);
		}),
	});
}
