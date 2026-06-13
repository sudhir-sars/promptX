# @promptx/shared

Framework-agnostic contracts shared across the monorepo. **No `convex`, `hono`,
`next`, or `react` imports may ever appear here.**

Scope is intentionally narrow: only the small, verified prompt/KV payload and
the SDK↔Edge wire contract. **No raw table / domain entity types** — the SDK and
Edge never need them, and those stay coupled to Convex in the web app.

## Layers

| Folder       | Contains                                             | Depends on  |
| ------------ | ---------------------------------------------------- | ----------- |
| `types/`     | primitives (`DeploymentEnv`)                         | —           |
| `contracts/` | cross-boundary DTOs (edge HTTP, KV storage, API key) | `types`     |
| `constants/` | route/version constants, runtime defaults            | —           |
| `utils/`     | pure helpers (kv-key builders, api-key parsing)      | `contracts` |

Allowed import direction: `utils → constants/contracts → types`.
Nothing here may import an app or the SDK.

## Consuming

```ts
import { DeploymentEnv, GetPromptResponse } from "@promptx/shared";
import { promptKvKey, parseApiKey } from "@promptx/shared/utils";
import { KVPromptConfig } from "@promptx/shared/contracts";
```

## What is intentionally NOT here

- Raw table / domain entity types (Team, Prompt, Deployment…) — Convex-coupled,
  stay in the web app.
- `isPrompt()` — single consumer (SDK), stays in the SDK.
- `selectVariant()` — single consumer (Edge), stays in the Edge.
- Anything importing Convex `Doc`/`Id`, Hono `MiddlewareHandler`, or CF `Env`.
