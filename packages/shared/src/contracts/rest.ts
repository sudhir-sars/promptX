import { z } from "zod";

/**
 * Wire contract for the platform REST API (`/v0/rest`).
 *
 * Single source of truth, mirroring `edge-http.ts`: the Convex HTTP routes
 * `parse` request bodies with these schemas before touching the database, and the
 * SDK's REST client imports the inferred types so a drifting shape is a compile
 * error. Resource ids travel as opaque strings on the wire (the server casts them
 * to Convex ids at the boundary).
 */

/** One variant of a deployment: a version and the share of traffic it receives. */
export const deployVariantSchema = z.object({
	versionId: z.string().min(1),
	traffic: z.number().finite().min(0).max(100),
	sequence: z.number().finite(),
});

/** A full deployment config; traffic across variants must total 100. */
export const deployConfigSchema = z.array(deployVariantSchema).min(1);

export const createPromptSchema = z.object({ name: z.string().min(1) });
export const updatePromptSchema = z.object({ name: z.string().min(1) });

export const createVersionSchema = z.object({
	content: z.string(),
	tag: z.string().optional(),
});

export const updateVersionSchema = z
	.object({ content: z.string().optional(), tag: z.string().optional() })
	.refine((b) => b.content !== undefined || b.tag !== undefined, "Provide content or tag");

export const createDeploymentSchema = z.object({ config: deployConfigSchema });

export type DeployVariant = z.infer<typeof deployVariantSchema>;
export type CreatePromptBody = z.infer<typeof createPromptSchema>;
export type UpdatePromptBody = z.infer<typeof updatePromptSchema>;
export type CreateVersionBody = z.infer<typeof createVersionSchema>;
export type UpdateVersionBody = z.infer<typeof updateVersionSchema>;
export type CreateDeploymentBody = z.infer<typeof createDeploymentSchema>;

/** Resource shapes returned by the management API (the relevant Convex fields). */
export interface ManagedPrompt {
	_id: string;
	teamId: string;
	name: string;
	slug: string;
}

export interface ManagedVersion {
	_id: string;
	promptId: string;
	tag?: string;
	sequence: number;
	draft: boolean;
	content: string;
	updatedAt: number;
}

export interface ManagedDeployment {
	_id: string;
	promptId: string;
	config: DeployVariant[];
	active: boolean;
	rolledBackTo?: string;
}
