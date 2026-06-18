import { z } from "zod";
import { DEPLOYMENT_ENVS, type DeploymentEnv } from "../types/env";

/**
 * The HTTP wire contract between the client SDK and the backends.
 *
 * Single source of truth. The SDK, the Edge Worker, and the Convex dev endpoint
 * all import these Zod schemas: the servers `parse` the response before sending
 * it, and the SDK `safeParse`s it on the way back, so the wire shape can never
 * drift apart without a runtime (and compile-time) failure.
 */

/** Route params for GET prompt. */
export interface GetPromptParams {
	identifier: string;
}

/** Query string for GET prompt. */
export interface GetPromptQuery {
	env: DeploymentEnv;
}

/** How a variant was chosen when a deployment has multiple variants. */
export const routingInfoSchema = z.union([
	z.object({ strategy: z.literal("user_sticky"), identifier: z.string() }),
	z.object({ strategy: z.literal("default") }),
]);

export type RoutingInfo = z.infer<typeof routingInfoSchema>;

/** Canonical success body returned for a resolved prompt (production + development). */
export const promptResponseSchema = z.object({
	identifier: z.string(),
	env: z.enum(DEPLOYMENT_ENVS),
	content: z.string(),
	sequence: z.number().finite(),
	traffic: z.number().finite(),
	routing: routingInfoSchema.optional(),
});

export type PromptResponse = z.infer<typeof promptResponseSchema>;

/** Canonical error body for any non-2xx response. */
export interface EdgeErrorResponse {
	error: string;
}
