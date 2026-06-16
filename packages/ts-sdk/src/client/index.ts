import {
	DEFAULT_BASE_URL,
	DEFAULT_CACHE_MAX_AGE_MS,
	DEFAULT_CACHE_STALE_WHILE_REVALIDATE_MS,
	DEFAULT_REQUEST_TIMEOUT_MS,
	promptResourcePath,
	SESSION_HEADER,
} from "@promptx/shared";
import { MemoryCache } from "../cache";
import { PromptFetchError } from "../zlib/error";
import { isPrompt } from "../zlib/prompt";
import type { DeploymentEnv, Prompt, PromptXConfig } from "../ztypes";

export class PromptXClient {
	private readonly baseUrl: string;
	private readonly env: DeploymentEnv;
	private readonly apiKey: string;
	private readonly requestTimeoutMs: number;

	private readonly cache: MemoryCache<Prompt>;
	private readonly inflight = new Map<string, Promise<Prompt>>();

	constructor(config: PromptXConfig) {
		this.apiKey = config.apiKey;
		this.env = config.env ?? "production";
		this.requestTimeoutMs = config.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;

		const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
		this.baseUrl = baseUrl.replace(/\/+$/, "");

		this.cache = new MemoryCache<Prompt>(
			config.cacheMaxAgeMs ?? DEFAULT_CACHE_MAX_AGE_MS,
			config.cacheStaleWhileRevalidateMs ?? DEFAULT_CACHE_STALE_WHILE_REVALIDATE_MS,
		);
	}

	async getPrompt(
		identifier: string,
		options?: {
			sessionId?: string;
			forceRefresh?: boolean;
		},
	): Promise<Prompt> {
		const forceRefresh = options?.forceRefresh ?? false;
		const sessionId = options?.sessionId;
		const cacheKey = `${this.env}:${identifier}:${sessionId ?? "default"}`;

		if (!forceRefresh) {
			const cached = this.cache.get(cacheKey);

			if (cached !== undefined) {
				if (cached.isStale) {
					void this.revalidate(cacheKey, identifier, sessionId).catch(() => {});
				}
				return cached.value;
			}

			const existingRequest = this.inflight.get(cacheKey);
			if (existingRequest) {
				return existingRequest;
			}
		}

		return this.revalidate(cacheKey, identifier, sessionId);
	}

	private revalidate(cacheKey: string, identifier: string, sessionId?: string): Promise<Prompt> {
		const existingRequest = this.inflight.get(cacheKey);
		if (existingRequest) {
			return existingRequest;
		}

		const request = this.fetchPrompt(identifier, sessionId)
			.then((prompt) => {
				this.cache.set(cacheKey, prompt);
				return prompt;
			})
			.finally(() => {
				if (this.inflight.get(cacheKey) === request) {
					this.inflight.delete(cacheKey);
				}
			});

		this.inflight.set(cacheKey, request);

		return request;
	}

	private async fetchPrompt(identifier: string, sessionId?: string): Promise<Prompt> {
		const url = `${this.baseUrl}${promptResourcePath(identifier)}?env=${this.env}`;

		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				...(sessionId ? { [SESSION_HEADER]: sessionId } : {}),
			},
			signal: AbortSignal.timeout(this.requestTimeoutMs),
		});

		if (!response.ok) {
			throw new PromptFetchError(response.status, response.statusText, identifier);
		}

		let body: unknown;
		try {
			body = await response.json();
		} catch {
			throw new PromptFetchError(response.status, "Invalid JSON body", identifier);
		}

		if (!isPrompt(body)) {
			throw new PromptFetchError(response.status, "Invalid Response body", identifier);
		}

		return body;
	}
}
