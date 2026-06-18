export class PromptxError extends Error {
	/** HTTP status code, present when the error came from a non-2xx edge response. */
	readonly status?: number;

	constructor(message: string, status?: number) {
		super(message);
		this.name = "PromptxError";
		this.status = status;
	}
}
