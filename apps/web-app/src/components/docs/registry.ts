import dynamic from "next/dynamic";

/* ------------------------------------------------------------------ */
/*  Doc metadata                                                       */
/* ------------------------------------------------------------------ */
export type DocEntry = {
	title: string;
	description: string;
	section: string;
	ghost: string;
};

export const docMeta: Record<string, DocEntry> = {
	"getting-started": {
		title: "Getting Started",
		description: "Set up PromptX and deploy your first prompt in under five minutes.",
		section: "Developer",
		ghost: "START",
	},
	examples: {
		title: "Examples",
		description: "Practical patterns for common prompt management workflows.",
		section: "Developer",
		ghost: "EXAMPLES",
	},
	"prompt-versioning": {
		title: "Prompt Versioning",
		description: "Immutable version history with full traceability for every prompt change.",
		section: "Guides",
		ghost: "VERSIONS",
	},
	deployments: {
		title: "Deployments",
		description: "Gradual rollouts, traffic splitting, and one-click rollback.",
		section: "Guides",
		ghost: "DEPLOY",
	},
	authentication: {
		title: "Authentication",
		description: "API keys, scopes, and SDK authentication for your applications.",
		section: "Guides",
		ghost: "AUTH",
	},
	migration: {
		title: "Migration Guide",
		description: "Move from hardcoded prompts or other platforms to PromptX.",
		section: "Guides",
		ghost: "MIGRATE",
	},
	nextjs: {
		title: "Next.js",
		description: "Server Components, route handlers, and edge runtime integration.",
		section: "SDK — Next.js",
		ghost: "NEXT",
	},
	react: {
		title: "React",
		description: "Hooks-based client for React applications.",
		section: "SDK — React",
		ghost: "REACT",
	},
	nodejs: {
		title: "Node.js",
		description: "Server-side SDK for Express, Fastify, and any Node runtime.",
		section: "SDK — Node.js",
		ghost: "NODE",
	},
	python: {
		title: "Python",
		description: "Async client for Django, FastAPI, and standalone Python.",
		section: "SDK — Python",
		ghost: "PYTHON",
	},
	go: {
		title: "Go",
		description: "Idiomatic Go client with context-based API.",
		section: "SDK — Go",
		ghost: "GO",
	},
	rust: {
		title: "Rust",
		description: "Async Rust crate with trait-based prompt resolution.",
		section: "SDK — Rust",
		ghost: "RUST",
	},
};

/* ------------------------------------------------------------------ */
/*  Lazy-loaded content components                                     */
/* ------------------------------------------------------------------ */
export const docComponents: Record<string, React.ComponentType> = {
	"getting-started": dynamic(() => import("./content/getting-started"), { ssr: false }),
	examples: dynamic(() => import("./content/examples"), { ssr: false }),
	"prompt-versioning": dynamic(() => import("./content/prompt-versioning"), { ssr: false }),
	deployments: dynamic(() => import("./content/deployments"), { ssr: false }),
	authentication: dynamic(() => import("./content/authentication"), { ssr: false }),
	migration: dynamic(() => import("./content/migration"), { ssr: false }),
	nextjs: dynamic(() => import("./content/nextjs"), { ssr: false }),
	nodejs: dynamic(() => import("./content/nodejs"), { ssr: false }),
	python: dynamic(() => import("./content/python"), { ssr: false }),
	go: dynamic(() => import("./content/go"), { ssr: false }),
	rust: dynamic(() => import("./content/rust"), { ssr: false }),
	"rest-api": dynamic(() => import("./content/rest-api"), { ssr: false }),
	releases: dynamic(() => import("./content/releases"), { ssr: false }),
	roadmap: dynamic(() => import("./content/roadmap"), { ssr: false }),
};
