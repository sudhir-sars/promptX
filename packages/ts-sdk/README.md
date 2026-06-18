# @xevos-ai/promptx

Fetch prompts from the Xevos PromptX edge. A small TypeScript client with an
in-memory, stale-while-revalidate cache, request coalescing, and Zod-validated
responses.

## Install

```bash
npm install @xevos-ai/promptx
# or: pnpm add @xevos-ai/promptx
# or: yarn add @xevos-ai/promptx
```

## Quick start

The client is **zero-configuration**. Set one environment variable, import the
ready-made `promptx` singleton, and call `getPrompt` — there is nothing to
construct or initialize.

```bash
# .env
PROMPTX_API_KEY=xe_live_<keyId>_<teamId>.<secret>
```

```ts
import { promptx } from "@xevos-ai/promptx";

const prompt = await promptx.getPrompt("checkout-assistant");

console.log(prompt.content); // the resolved prompt text
console.log(prompt.sequence); // the version number that was served
```

## Configuration (environment variables)

The only thing to set is your API key:

| Variable          | Default      | Description          |
| ----------------- | ------------ | -------------------- |
| `PROMPTX_API_KEY` | — (required) | Your team's API key. |

## Environments

PromptX has two fetch environments, chosen automatically from the standard
`NODE_ENV`: `NODE_ENV=development` selects `development`, everything else selects
`production`. Production hosts (which set `NODE_ENV=production`) get production
automatically, and local dev tooling (which sets `NODE_ENV=development`) gets
instant drafts. There is nothing to configure.

- **`production`** — served from the **deployment** you released in the
  dashboard (with A/B traffic splitting and rollback), via the cached edge. Fast,
  globally distributed, cached. A requested `promptVersion` is ignored here.
- **`development`** — served **straight from a version**, read from the backend
  directly so your edits are visible **instantly** (no edge cache, no propagation
  delay). Pass a `promptVersion` to resolve that specific version; **omit it** to
  get the **live draft** — the prompt exactly as it's being edited in the studio.
  This lets many developers each test their own version in parallel.

## `getPrompt(identifier, options?)`

```ts
import { promptx } from "@xevos-ai/promptx";

// Production (NODE_ENV=production) — resolves the released deployment.
const prompt = await promptx.getPrompt("checkout-assistant", {
	sessionId: chat.id, // stable id for sticky A/B routing (optional)
	forceRefresh: false, // bypass the cache and fetch fresh (optional)
});

// Development (NODE_ENV=development) — instant. Resolve a specific version…
const pinned = await promptx.getPrompt("checkout-assistant", { promptVersion: "experiment-a" });

// …or omit promptVersion to get the live draft (your latest edits).
const draft = await promptx.getPrompt("checkout-assistant");
```

- **`sessionId`** — _(production only)_ a stable identifier (user ID, chat ID, …).
  When a deployment splits traffic across variants, the same `sessionId` is always
  routed to the same variant. Without it, the highest-traffic variant is served.
- **`forceRefresh`** — _(production only)_ when `true`, ignores any cached value
  and fetches fresh from the edge.
- **`promptVersion`** — _(development only)_ the name of the prompt version to
  resolve. Omit it to get the live draft. Ignored in production.

### Returned `Prompt`

```ts
interface Prompt {
	identifier: string;
	env: "production" | "development";
	content: string;
	sequence: number; // version number of the served variant
	traffic: number; // traffic weight (0–100); always 100 in development
	routing?: { strategy: "user_sticky"; identifier: string } | { strategy: "default" }; // present only when a production deployment has >1 variant
}
```

## Caching

Caching applies to **production** only. Each client keeps an in-memory cache
keyed by `env:identifier:sessionId`: within `cacheMaxAgeMs` a prompt is served
fresh, then served stale for up to `cacheStaleWhileRevalidateMs` while a single
background refresh runs (concurrent calls are coalesced), then it expires.

**Development is never cached** — every `getPrompt` reads the backend directly so
you always see your latest edit.

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
	promptx, // the ready-to-use, zero-config client singleton
	PromptFetchError,
	PromptxError,
	promptResponseSchema, // Zod schema for the prompt response (shared contract)
} from "@xevos-ai/promptx";

import type {
	Prompt,
	GetPromptOptions,
	DeploymentEnv,
	PromptResponse, // canonical response (alias of Prompt)
	RoutingInfo,
} from "@xevos-ai/promptx";
```

## License

UNLICENSED
