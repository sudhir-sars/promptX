import { ComponentType } from "react";
import Fuse, { IFuseOptions } from "fuse.js";
import {
    APIKeyIcon,
    DeployIcon,
    FoundryIcon,
    NextjsIcon,
    StudioIcon,
    SettingsIcon,
    HomeIcon,
    GettingStartedIcon,
    ExampleIcon,
    VersionsIcon,
    MigrationIcon,
    NodejsIcon,
    APIIcon,
    PythonIcon,
    RustIcon,
    GoIcon,
    ChangelogIcon,
    RoadmapIcon,
    PricingIcon,
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
                        { id: "template-variables", label: "Templates" },
                        { id: "ab-testing", label: "A/B Testing" },
                        { id: "error-handling", label: "Error Handling" },
                        { id: "middleware", label: "Middleware" },
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
                        { id: "api-reference", label: "API Reference" },
                        { id: "guidelines", label: "Guidelines" },
                    ],
                },
                {
                    label: "Authentication",
                    href: "/docs/authentication",
                    icon: APIKeyIcon,
                    toc: [
                        { id: "api-keys", label: "API Keys" },
                        { id: "creating-keys", label: "Creating Keys" },
                        { id: "sdk-auth", label: "SDK Auth" },
                        { id: "key-scopes", label: "Key Scopes" },
                        { id: "key-rotation", label: "Key Rotation" },
                        { id: "security", label: "Security" },
                    ],
                },
                {
                    label: "Migration",
                    href: "/docs/migration",
                    icon: MigrationIcon,
                    toc: [
                        { id: "from-hardcoded", label: "From Hardcoded" },
                        { id: "step-by-step", label: "Step by Step" },
                        { id: "from-env-vars", label: "From Env Vars" },
                        { id: "bulk-import", label: "Bulk Import" },
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
                        { id: "client-setup", label: "Client Setup" },
                        { id: "server-components", label: "Server Components" },
                        { id: "route-handlers", label: "Route Handlers" },
                        { id: "edge-runtime", label: "Edge Runtime" },
                        { id: "middleware", label: "Middleware" },
                        { id: "provider", label: "Provider" },
                    ],
                },
                {
                    label: "Node.js",
                    href: "/docs/nodejs",
                    icon: NodejsIcon,
                    toc: [
                        { id: "installation", label: "Installation" },
                        { id: "initialization", label: "Initialization" },
                        { id: "express", label: "Express" },
                        { id: "fastify", label: "Fastify" },
                        { id: "streaming", label: "Streaming" },
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
                        { id: "resolve-prompt", label: "Resolve a Prompt" },
                        { id: "ab-testing", label: "A/B Testing" },
                        { id: "version-pinning", label: "Version Pinning" },
                        { id: "response-schema", label: "Response Schema" },
                        { id: "errors", label: "Errors" },
                    ],
                },
                {
                    label: "Python",
                    href: "/docs/python",
                    icon: PythonIcon,
                    toc: [
                        { id: "installation", label: "Installation" },
                        { id: "initialization", label: "Initialization" },
                        { id: "usage", label: "Basic Usage" },
                        { id: "fastapi", label: "FastAPI" },
                        { id: "django", label: "Django" },
                        { id: "template-variables", label: "Templates" },
                    ],
                },
                {
                    label: "Go",
                    href: "/docs/go",
                    icon: GoIcon,
                    toc: [
                        { id: "installation", label: "Installation" },
                        { id: "initialization", label: "Initialization" },
                        { id: "fetching", label: "Fetching" },
                        { id: "http-handlers", label: "HTTP Handlers" },
                        { id: "context", label: "Context" },
                        { id: "middleware", label: "Middleware" },
                    ],
                },
                {
                    label: "Rust",
                    href: "/docs/rust",
                    icon: RustIcon,
                    toc: [
                        { id: "installation", label: "Installation" },
                        { id: "initialization", label: "Initialization" },
                        { id: "fetching", label: "Fetching" },
                        { id: "axum", label: "Axum" },
                        { id: "prompt-resolver", label: "PromptResolver" },
                        { id: "error-handling", label: "Error Handling" },
                    ],
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
