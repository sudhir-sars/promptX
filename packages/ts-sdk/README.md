# @xevos-ai/promptx

Fetch prompts from the Xevos PromptX edge. A tiny, dependency-free TypeScript
client with an in-memory, stale-while-revalidate cache and request coalescing.

## Install

```bash
npm install @xevos-ai/promptx
# or: pnpm add @xevos-ai/promptx
# or: yarn add @xevos-ai/promptx
```

## Quick start

```ts
import { PromptXClient } from "@xevos-ai/promptx";

const promptx = new PromptXClient({
	apiKey: process.env.PROMPTX_API_KEY!, // xe_live_<keyId>_<teamId>.<secret>
});

const prompt = await promptx.getPrompt("checkout-assistant");

console.log(prompt.content); // the resolved prompt text
console.log(prompt.sequence); // the version number that was served
```

## Configuration

`new PromptXClient(config)` accepts:

| Option                        | Type            | Default                          | Description                                                                                            |
| ----------------------------- | --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `apiKey`                      | `string`        | — (required)                     | Your team's API key.                                                                                   |
| `env`                         | `DeploymentEnv` | `"production"`                   | Target environment: `production`, `preview`, or `development`.                                         |
| `baseUrl`                     | `string`        | `https://edge.promptx.xevos.dev` | Edge base URL (trailing slashes are trimmed).                                                          |
| `cacheMaxAgeMs`               | `number`        | `60000`                          | How long a cached prompt is served fresh before entering the stale window.                             |
| `cacheStaleWhileRevalidateMs` | `number`        | `60000`                          | Extra window after max-age during which a stale prompt is served while it refreshes in the background. |
| `requestTimeoutMs`            | `number`        | `10000`                          | Aborts the fetch after this many milliseconds.                                                         |

## `getPrompt(identifier, options?)`

Resolves the active deployment of a prompt for the client's environment.

```ts
const prompt = await promptx.getPrompt("checkout-assistant", {
	sessionId: chat.id, // stable id for sticky A/B routing (optional)
	forceRefresh: false, // bypass the cache and fetch fresh (optional)
});
```

- **`sessionId`** — a stable identifier (user ID, chat ID, session ID, …). When a
  deployment splits traffic across variants, the same `sessionId` is always
  routed to the same variant. Without it, the highest-traffic variant is served.
- **`forceRefresh`** — when `true`, ignores any cached value and fetches the
  latest deployment from the edge.

### Returned `Prompt`

```ts
interface Prompt {
	identifier: string;
	env: "production" | "preview" | "development";
	content: string;
	sequence: number; // version number of the served variant
	traffic: number; // traffic weight (0–100) of the served variant
	routing?: { strategy: "user_sticky"; identifier: string } | { strategy: "default" }; // present only when the deployment has >1 variant
}
```

## Caching

Each client instance keeps an in-memory LRU cache keyed by
`env:identifier:sessionId`. Within `cacheMaxAgeMs` a prompt is served fresh from
memory. After that, it is served stale for up to `cacheStaleWhileRevalidateMs`
while a single background refresh runs (concurrent calls for the same key are
coalesced). Past that window the entry expires and the next call fetches fresh.

## Error handling

```ts
import { PromptFetchError, PromptxError } from "@xevos-ai/promptx";

try {
	const prompt = await promptx.getPrompt("checkout-assistant");
} catch (error) {
	if (error instanceof PromptFetchError) {
		// Non-2xx response from the edge (e.g. 401, 404, 503).
		console.error(error.status, error.message);
	} else if (error instanceof PromptxError) {
		console.error(error.message);
	}
}
```

- **`PromptxError`** — base error class for the SDK.
- **`PromptFetchError`** — extends `PromptxError`; thrown when the edge returns a
  non-2xx response or an invalid body. Exposes `status` (the HTTP status code).

## Exports

```ts
import {
	PromptXClient,
	PromptFetchError,
	PromptxError,
	isPrompt, // runtime type guard for a Prompt/GetPromptResponse
} from "@xevos-ai/promptx";

import type {
	Prompt,
	PromptXConfig,
	DeploymentEnv,
	GetPromptResponse, // canonical edge response (alias of Prompt)
	RoutingInfo,
} from "@xevos-ai/promptx";
```

## License

UNLICENSED
