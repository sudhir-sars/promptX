# @xevos-ai/promptx

Fetch prompts from the Xevos PromptX edge.

## Install

```bash
npm install @xevos-ai/promptx
```

## Usage

Set one environment variable:

```bash
# .env
PROMPTX_API_KEY=xe_live_<keyId>_<teamId>.<secret>
```

Import the ready-made `promptx` client and call `getPrompt`:

```ts
import { promptx } from "@xevos-ai/promptx";

const prompt = await promptx.getPrompt("checkout-assistant");

console.log(prompt.content); // the resolved prompt text
console.log(prompt.sequence); // the version that was served
```

## Environments

The environment is chosen automatically from `NODE_ENV` — `development` selects
development, anything else selects production.

- **production** — served from the deployment you released in the dashboard
  (A/B traffic splitting + rollback), via the cached edge.
- **development** — served straight from a version so your edits are visible
  instantly. Pass a `promptVersion` to resolve a specific version; omit it for
  the live draft.

```ts
// Production — sticky A/B routing for a stable id (optional)
await promptx.getPrompt("checkout-assistant", { sessionId: chat.id });

// Development — a specific version, or omit for the live draft
await promptx.getPrompt("checkout-assistant", { promptVersion: "experiment-a" });
```

## Error handling

All SDK failures throw `PromptxError`. For a non-2xx edge response it also
carries the HTTP `status` (e.g. 401, 404, 503).

```ts
import { PromptxError } from "@xevos-ai/promptx";

try {
	const prompt = await promptx.getPrompt("checkout-assistant");
} catch (error) {
	if (error instanceof PromptxError) {
		console.error(error.status, error.message);
	}
}
```

## License

MIT
