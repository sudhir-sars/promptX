import {
	type CreateDeploymentBody,
	type CreatePromptBody,
	type CreateVersionBody,
	DEFAULT_MANAGEMENT_BASE_URL,
	DEFAULT_REQUEST_TIMEOUT_MS,
	type ManagedDeployment,
	type ManagedPrompt,
	type ManagedVersion,
	MANAGEMENT_BASE_PATH,
	type UpdatePromptBody,
	type UpdateVersionBody,
} from "@promptx/shared";
import { PromptxError } from "../zlib/error";

declare const process: { env: Record<string, string | undefined> };

export interface ManagementClientOptions {
	/** Team API key (`xe_live_...`). Falls back to `PROMPTX_API_KEY`. */
	apiKey?: string;
	/** Override the management API origin (defaults to the PromptX backend). */
	baseUrl?: string;
}

/**
 * Programmatic control plane: everything the PromptX dashboard can do — author
 * prompts, cut versions, deploy with traffic splits, roll back — exposed as plain
 * methods so agents and scripts can manage prompts headlessly. Backed by the
 * `/v0/manage` REST API and authenticated with a team API key.
 *
 * ```ts
 * import { PromptManagement } from "@xevos-ai/promptx";
 *
 * const px = new PromptManagement(); // reads PROMPTX_API_KEY
 * const prompt = await px.createPrompt({ name: "Checkout Assistant" });
 * const version = await px.createVersion(prompt._id, { content: "You are…" });
 * await px.deploy(prompt._id, { config: [{ versionId: version._id, traffic: 100, sequence: version.sequence }] });
 * ```
 */
export class PromptManagement {
	private readonly baseUrl: string;
	private cachedApiKey: string | null;

	constructor(options: ManagementClientOptions = {}) {
		this.baseUrl = options.baseUrl ?? DEFAULT_MANAGEMENT_BASE_URL;
		this.cachedApiKey = options.apiKey ?? null;
	}

	private apiKey(): string {
		if (this.cachedApiKey) return this.cachedApiKey;

		const apiKey = process.env.PROMPTX_API_KEY;
		if (!apiKey) {
			throw new PromptxError(
				"Missing PROMPTX_API_KEY. Pass { apiKey } or set the PROMPTX_API_KEY environment variable.",
			);
		}

		this.cachedApiKey = apiKey;
		return apiKey;
	}

	private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
		const response = await fetch(`${this.baseUrl}${MANAGEMENT_BASE_PATH}${path}`, {
			method,
			headers: {
				Authorization: `Bearer ${this.apiKey()}`,
				...(body !== undefined ? { "Content-Type": "application/json" } : {}),
			},
			body: body !== undefined ? JSON.stringify(body) : undefined,
			signal: AbortSignal.timeout(DEFAULT_REQUEST_TIMEOUT_MS),
		});

		const data = await response.json().catch(() => null);

		if (!response.ok) {
			const message = (data as { error?: string } | null)?.error ?? response.statusText;
			throw new PromptxError(`[promptx] ${method} ${path} failed: ${response.status} ${message}`, response.status);
		}

		return data as T;
	}

	// Prompts
	createPrompt(body: CreatePromptBody) {
		return this.request<ManagedPrompt>("POST", "/prompts", body);
	}
	listPrompts() {
		return this.request<ManagedPrompt[]>("GET", "/prompts");
	}
	getPrompt(promptId: string) {
		return this.request<ManagedPrompt>("GET", `/prompts/${promptId}`);
	}
	updatePrompt(promptId: string, body: UpdatePromptBody) {
		return this.request<ManagedPrompt>("PATCH", `/prompts/${promptId}`, body);
	}
	deletePrompt(promptId: string) {
		return this.request<{ deleted: true }>("DELETE", `/prompts/${promptId}`);
	}

	// Versions
	createVersion(promptId: string, body: CreateVersionBody) {
		return this.request<ManagedVersion>("POST", `/prompts/${promptId}/versions`, body);
	}
	listVersions(promptId: string) {
		return this.request<ManagedVersion[]>("GET", `/prompts/${promptId}/versions`);
	}
	updateVersion(versionId: string, body: UpdateVersionBody) {
		return this.request<ManagedVersion>("PATCH", `/versions/${versionId}`, body);
	}

	// Deployments
	deploy(promptId: string, body: CreateDeploymentBody) {
		return this.request<ManagedDeployment>("POST", `/prompts/${promptId}/deployments`, body);
	}
	listDeployments(promptId: string) {
		return this.request<ManagedDeployment[]>("GET", `/prompts/${promptId}/deployments`);
	}
	/** Re-release `deploymentId`'s config as the new active deployment. */
	rollback(deploymentId: string) {
		return this.request<ManagedDeployment>("POST", `/deployments/${deploymentId}/rollback`);
	}
}
