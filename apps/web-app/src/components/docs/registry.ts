import dynamic from "next/dynamic";

/* ------------------------------------------------------------------ */
/*  Lazy-loaded content components                                     */
/*  Page metadata and navigation live in ./sidebar/config.ts          */
/* ------------------------------------------------------------------ */
export const docComponents: Record<string, React.ComponentType> = {
	"getting-started": dynamic(() => import("./content/getting-started"), {
		ssr: false,
	}),
	examples: dynamic(() => import("./content/examples"), { ssr: false }),
	"prompt-versioning": dynamic(() => import("./content/prompt-versioning"), {
		ssr: false,
	}),
	deployments: dynamic(() => import("./content/deployments"), { ssr: false }),
	authentication: dynamic(() => import("./content/authentication"), {
		ssr: false,
	}),
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
