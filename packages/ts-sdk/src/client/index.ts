import {
	DEFAULT_BASE_URL,
	DEFAULT_CACHE_MAX_AGE_MS,
	DEFAULT_CACHE_STALE_WHILE_REVALIDATE_MS,
	DEFAULT_DEV_BASE_URL,
	DEFAULT_REQUEST_TIMEOUT_MS,
	DEV_PROMPT_IDENTIFIER_PARAM,
	DEV_PROMPT_PATH,
	DEV_PROMPT_VERSION_PARAM,
	promptResponseSchema,
	promptResourcePath,
	SESSION_HEADER,
} from "@promptx/shared";
import { MemoryCache } from "../cache";
import { PromptFetchError, PromptxError } from "../zlib/error";
import type { GetPromptOptions, Prompt } from "../ztypes";

declare const process: { env: Record<string, string | undefined> };

/**
 * Zero-configuration prompt client. The only thing to set is `PROMPTX_API_KEY`.
 * The environment is taken from `NODE_ENV` (`development` → development,
 * otherwise production). Import the `promptx` singleton and call `getPrompt`.
 */
class PromptXClient {
	private readonly env = process.env.NODE_ENV === "development" ? "development" : "production";
	private readonly cache = new MemoryCache<Prompt>(DEFAULT_CACHE_MAX_AGE_MS, DEFAULT_CACHE_STALE_WHILE_REVALIDATE_MS);
	private readonly inflight = new Map<string, Promise<Prompt>>();
	private cachedApiKey: string | null = null;

	/** Read `PROMPTX_API_KEY` on first use, so importing never throws. */
	private apiKey(): string {
		if (this.cachedApiKey) {
			return this.cachedApiKey;
		}

		const apiKey = process.env.PROMPTX_API_KEY;

		if (!apiKey) {
			throw new PromptxError(
				"Missing PROMPTX_API_KEY. Set the PROMPTX_API_KEY environment variable to your team's API key.",
			);
		}

		this.cachedApiKey = apiKey;
		return apiKey;
	}

	async getPrompt(identifier: string, options?: GetPromptOptions): Promise<Prompt> {
		if (this.env === "development") {
			return this.fetchDevPrompt(identifier, options?.promptVersion);
		}

		const sessionId = options?.sessionId;
		const cacheKey = `${this.env}:${identifier}:${sessionId ?? "default"}`;

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

		return this.revalidate(cacheKey, identifier, sessionId);
	}

	private async fetchDevPrompt(identifier: string, promptVersion?: string): Promise<Prompt> {
		const query = new URLSearchParams({ [DEV_PROMPT_IDENTIFIER_PARAM]: identifier });
		if (promptVersion) {
			query.set(DEV_PROMPT_VERSION_PARAM, promptVersion);
		}

		const url = `${DEFAULT_DEV_BASE_URL}${DEV_PROMPT_PATH}?${query.toString()}`;

		const response = await fetch(url, {
			headers: { Authorization: `Bearer ${this.apiKey()}` },
			signal: AbortSignal.timeout(DEFAULT_REQUEST_TIMEOUT_MS),
		});

		return this.parseResponse(response, identifier);
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
		const url = `${DEFAULT_BASE_URL}${promptResourcePath(identifier)}?env=${this.env}`;

		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${this.apiKey()}`,
				...(sessionId ? { [SESSION_HEADER]: sessionId } : {}),
			},
			signal: AbortSignal.timeout(DEFAULT_REQUEST_TIMEOUT_MS),
		});

		return this.parseResponse(response, identifier);
	}

	private async parseResponse(response: Response, identifier: string): Promise<Prompt> {
		if (!response.ok) {
			throw new PromptFetchError(response.status, response.statusText, identifier);
		}

		let body: unknown;
		try {
			body = await response.json();
		} catch {
			throw new PromptFetchError(response.status, "Invalid JSON body", identifier);
		}

		// Verify the response against the shared contract by parsing it back.
		const parsed = promptResponseSchema.safeParse(body);

		if (!parsed.success) {
			throw new PromptFetchError(response.status, "Invalid Response body", identifier);
		}

		return parsed.data;
	}
}

/** The ready-to-use, zero-configuration PromptX client. */
export const promptx = new PromptXClient();
