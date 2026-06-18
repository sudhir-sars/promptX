import type { ComponentType } from "react";
import {
	APIIcon,
	APIKeyIcon,
	ChangelogIcon,
	DeployIcon,
	ExampleIcon,
	GettingStartedIcon,
	GoIcon,
	MigrationIcon,
	NextjsIcon,
	NodejsIcon,
	PythonIcon,
	RoadmapIcon,
	RustIcon,
	VersionsIcon,
} from "@/components/ui/icons";

export type DocsTocItem = {
	id: string;
	label: string;
};

export type DocsSidebarItem = {
	label: string;
	href: string;
	shortcut?: boolean;
	icon: ComponentType<{
		size?: number;
		strokeWidth?: number;
		className?: string;
	}>;
	toc?: DocsTocItem[];
};

export type DocsSidebarSection = {
	items: DocsSidebarItem[];
};

export type DocsConfig = {
	sections: DocsSidebarSection[];
};

export const docsConfig: DocsConfig = {
	sections: [
		{
			items: [
				{
					label: "Getting Started",
					href: "/docs/getting-started",
					icon: GettingStartedIcon,
					toc: [
						{ id: "prerequisites", label: "Prerequisites" },
						{ id: "install", label: "Install SDK" },
						{ id: "configure", label: "API Key" },
						{ id: "initialize", label: "Initialize" },
						{ id: "first-prompt", label: "First Prompt" },
						{ id: "deploy", label: "Deploy" },
						{ id: "next-steps", label: "Next Steps" },
					],
				},
				{
					label: "Examples",
					href: "/docs/examples",
					icon: ExampleIcon,
					toc: [
						{ id: "basic-fetch", label: "Basic Fetch" },
						{ id: "ab-testing", label: "A/B Testing" },
						{ id: "caching", label: "Caching" },
						{ id: "error-handling", label: "Error Handling" },
					],
				},
			],
		},
		{
			items: [
				{
					label: "Prompt Versioning",
					href: "/docs/prompt-versioning",
					icon: VersionsIcon,
					toc: [
						{ id: "how-it-works", label: "How It Works" },
						{ id: "version-states", label: "Version States" },
						{ id: "creating-versions", label: "Creating Versions" },
						{ id: "comparing-versions", label: "Diffing" },
						{ id: "restoring", label: "Restoring" },
						{ id: "best-practices", label: "Best Practices" },
					],
				},
				{
					label: "Deployments",
					href: "/docs/deployments",
					icon: DeployIcon,
					toc: [
						{ id: "deployment-model", label: "Model" },
						{ id: "traffic-splitting", label: "Traffic Splitting" },
						{ id: "deploying", label: "Deploying" },
						{ id: "rollback", label: "Rollback" },
						{ id: "guidelines", label: "Guidelines" },
					],
				},
				{
					label: "Authentication",
					href: "/docs/authentication",
					icon: APIKeyIcon,
					toc: [
						{ id: "api-key", label: "API Key" },
						{ id: "setup", label: "Setup" },
						{ id: "sdk-auth", label: "SDK Auth" },
						{ id: "rotation", label: "Rotation" },
						{ id: "best-practices", label: "Security" },
					],
				},
				{
					label: "Migration",
					href: "/docs/migration",
					icon: MigrationIcon,
					toc: [
						{ id: "from-hardcoded", label: "From Hardcoded" },
						{ id: "step-by-step", label: "Step by Step" },
						{ id: "verification", label: "Verification" },
					],
				},
			],
		},
		{
			items: [
				{
					label: "Next.js",
					href: "/docs/nextjs",
					icon: NextjsIcon,
					toc: [
						{ id: "installation", label: "Installation" },
						{ id: "configuration", label: "Configuration" },
						{ id: "route-handlers", label: "Route Handlers" },
						{ id: "server-actions", label: "Server Actions" },
						{ id: "edge-runtime", label: "Edge Runtime" },
					],
				},
				{
					label: "Node.js",
					href: "/docs/nodejs",
					icon: NodejsIcon,
					toc: [
						{ id: "installation", label: "Installation" },
						{ id: "configuration", label: "Configuration" },
						{ id: "getting-started", label: "Get a Prompt" },
						{ id: "llm-usage", label: "Use with an LLM" },
						{ id: "ab-testing", label: "A/B Testing" },
						{ id: "error-handling", label: "Error Handling" },
						{ id: "config", label: "Config Options" },
					],
				},
				{
					label: "REST API",
					href: "/docs/rest-api",
					icon: APIIcon,
					toc: [
						{ id: "base-url", label: "Base URL" },
						{ id: "authentication", label: "Authentication" },
						{ id: "get-prompt", label: "Get a Prompt" },
						{ id: "ab-testing", label: "A/B Testing" },
						{ id: "response-schema", label: "Response Schema" },
						{ id: "errors", label: "Errors" },
						{ id: "health", label: "Health Check" },
					],
				},
				{
					label: "Python",
					href: "/docs/python",
					icon: PythonIcon,
				},
				{
					label: "Go",
					href: "/docs/go",
					icon: GoIcon,
				},
				{
					label: "Rust",
					href: "/docs/rust",
					icon: RustIcon,
				},
			],
		},

		{
			items: [
				{
					label: "Releases",
					href: "/docs/releases",
					icon: ChangelogIcon,
					shortcut: false,
					toc: [
						{ id: "v0-1-0", label: "v0.1.0" },
						{ id: "upcoming", label: "Upcoming" },
					],
				},
				{
					label: "Roadmap",
					href: "/docs/roadmap",
					icon: RoadmapIcon,
					shortcut: false,
					toc: [
						{ id: "vision", label: "Vision" },
						{ id: "agent-development", label: "Development" },
						{ id: "knowledge", label: "Knowledge" },
						{ id: "deployments", label: "Deployments" },
						{ id: "marketplace", label: "Marketplace" },
						{ id: "commerce", label: "Commerce" },
					],
				},
			],
		},
	],
};

export const docsPages = docsConfig.sections.flatMap((section) => section.items);

export function getCurrentDoc(pathname: string) {
	return docsPages.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}
