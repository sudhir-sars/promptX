# PromptX

Deploy prompts without deploying code.

PromptX is the control plane for AI teams to author, version, ship, and observe
prompts in production — decoupled from your application release cycle. Edit a
prompt, split traffic across versions, watch it perform live, and roll back in
one click. Your app just calls the SDK.

- Website: https://promptx.xevos.dev
- Docs: https://promptx.xevos.dev/docs
- SDK: [`@xevos-ai/promptx`](https://www.npmjs.com/package/@xevos-ai/promptx)

## Why PromptX

- No more prompt drift. Prompts live in one versioned source of truth, not
  scattered across codebases, configs, and copy-paste.
- Deploy without deploying. Ship prompt changes instantly through the edge — no
  rebuild, no redeploy, no waiting on CI.
- Built for AI teams. Teams, roles, and a full audit trail so everyone moves
  fast without stepping on each other.

## Capabilities

**Prompt authoring.** A focused workspace for editing and organizing prompts.
Write your system prompts, organize them per team, and find anything instantly
with full-text search.

**Versioning.** Every prompt keeps a sequenced history of versions plus a live
draft. Tag revisions, compare them side by side with an inline diff, and promote
any version when it's ready — nothing is ever lost.

**Deployments and A/B traffic splitting.** Release prompts as deployments that
split live traffic across multiple versions. Run experiments with weighted
rollouts, find what performs best, and roll back to any previous deployment in
one click.

**Analytics.** Understand how prompts perform in production with real-time
insights — usage, version distribution, and how each rollout is landing.

**Edge serving and SDK.** Released deployments are pushed to the edge
(Cloudflare KV) and served with low latency through the
[`@xevos-ai/promptx`](https://www.npmjs.com/package/@xevos-ai/promptx) SDK
([source](../../packages/ts-sdk)). Integrate deployed prompts into your
application with minimal setup:

```ts
import { promptx } from "@xevos-ai/promptx";

const prompt = await promptx.getPrompt("checkout-assistant");
console.log(prompt.content);
```

**API keys.** Issue scoped `xe_live_...` keys per team for the SDK and edge, with
instant revocation.

**Teams and members.** Invite teammates by email, assign owner, admin, or member
roles, and manage the whole workspace from one place.

**Activity and audit log.** Every meaningful action is recorded — who changed
what, when — for full traceability across the team.

## Stack

Next.js (App Router, React Compiler), Convex, Clerk, Zustand, Tailwind CSS with
shadcn/Radix UI, Cloudflare KV, and Resend.

## Project Structure

```
apps/web-app
├── convex/                     Convex backend
│   ├── schema.ts               Database schema (teams, prompts, versions, deployments, ...)
│   ├── prompts.ts              Prompt queries and mutations
│   ├── versions.ts             Version history, drafts, and tags
│   ├── deployments.ts          Deployment and traffic-split logic
│   ├── apiKeys.ts              API key issuance and revocation
│   ├── activities.ts           Audit log
│   ├── users.ts                User records
│   ├── search.ts               Full-text search
│   ├── teams/                  Team, member, and invite functions
│   ├── actions/                Side-effecting actions (apiKey, deployments, email)
│   ├── emails/                 Transactional email templates
│   ├── http/                   HTTP endpoints (Clerk webhooks, prompt resolution)
│   ├── lib/                    Backend helpers
│   └── types/                  Shared backend types
│
└── src/
    ├── app/                    Next.js App Router
    │   ├── home/[teamId]/       Team workspace
    │   │   ├── [promptId]/      Prompt detail: versions, deployments, analytics, settings
    │   │   ├── activity/        Audit log view
    │   │   ├── api-keys/        API key management
    │   │   ├── members/         Team members and invites
    │   │   └── settings/        Team settings
    │   ├── docs/                Documentation pages
    │   ├── pricing/             Pricing page
    │   ├── sign-in/             Authentication
    │   └── invite/             Invite acceptance
    │
    ├── components/             UI components (landing-page, dialogs, dropdown, layout, ui)
    ├── providers/             React context providers (Convex, team, prompt, theme)
    ├── stores/                Zustand stores (dialogs, editor, navigation, data)
    ├── hooks/                 Data hooks (use-prompt, use-versions, use-deployments, ...)
    ├── lib/                   Client utilities (Convex helpers, dates, errors)
    └── types/                 Shared client types
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

Requires `.env.local` with Convex, Clerk, Cloudflare, and app settings. Server
secrets such as `RESEND_API_KEY` are configured in the Convex dashboard.
