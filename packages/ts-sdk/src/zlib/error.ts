export class PromptxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PromptxError";
  }
}

export class PromptFetchError extends PromptxError {
  readonly status: number;

  constructor(status: number, statusText: string, slug: string) {
    super(`[promptx] Failed to fetch prompt "${slug}": ${status} ${statusText}`);
    this.name = "PromptFetchError";
    this.status = status;
  }
}
