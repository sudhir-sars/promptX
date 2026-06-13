import {
    DocPageWrapper,
    DocSection,
    DocParagraph,
    DocDivider,
    Callout,
    DocCard,
    DocGrid,
} from "../doc-primitives";

export default function RoadmapContent() {
    return (
        <DocPageWrapper>
            <section className="border-b border-border/50 pb-10">
                <div className="mb-6 flex items-center gap-3">
                    <div className="h-px w-10 bg-foreground/20" />
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        roadmap
                    </p>
                </div>

                <h1 className="max-w-3xl font-bold leading-[1.05] text-4xl tracking-tight text-foreground/90">
                    Building the operating
                    <br />
                    system for AI agents.
                </h1>

                <DocParagraph className="mt-5 max-w-3xl text-balance">
                    PromptX is the first product in the Xevos AI ecosystem. Our vision extends
                    beyond prompt management. We are building a complete platform for creating,
                    deploying, operating, scaling, and monetizing AI agents from a single unified
                    environment.
                </DocParagraph>

                <div className="mt-8 flex flex-wrap gap-2">
                    {[
                        "Agent Development",
                        "Deployments",
                        "Hosting",
                        "Marketplace",
                        "Monetization",
                    ].map((tag) => (
                        <div
                            key={tag}
                            className="rounded-full border border-foreground/[0.08] bg-input/50 px-4 py-1.5 text-[11px]"
                        >
                            {tag}
                        </div>
                    ))}
                </div>
            </section>

            <DocSection id="vision" label="Long Term Vision" title="The future of Xevos AI">
                <DocParagraph>
                    Xevos AI aims to become the platform where developers build, deploy, operate,
                    distribute, and monetize AI agents. From prompt creation to production
                    infrastructure, every part of the agent lifecycle should be managed from one
                    place.
                </DocParagraph>

                <Callout type="note" className="mt-4">
                    Roadmaps represent our current direction and priorities. Features and timelines
                    may evolve as we continue learning from developers and teams.
                </Callout>
            </DocSection>

            <DocDivider />

            <DocSection id="agent-development" label="Platform" title="Agent Development">
                <DocParagraph>
                    Tools for building, testing, versioning, and iterating on agents.
                </DocParagraph>

                <DocGrid cols={2} className="mt-4">
                    <DocCard
                        title="PromptX"
                        description="Version control, deployments, rollbacks, and prompt infrastructure."
                    />
                    <DocCard
                        title="Agent Studio"
                        description="Visual environment for creating and managing agent workflows."
                    />
                    <DocCard
                        title="Agent Testing"
                        description="Evaluate outputs, run benchmarks, and validate behavior before deployment."
                    />
                    <DocCard
                        title="Tool Integrations"
                        description="Connect agents to APIs, databases, and external services."
                    />
                </DocGrid>
            </DocSection>

            <DocDivider />

            <DocSection id="knowledge" label="Data Layer" title="Managed Knowledge Infrastructure">
                <DocParagraph>
                    Every serious AI agent requires access to business data. Xevos AI will provide
                    managed knowledge services that allow developers to create custom knowledge
                    bases without managing infrastructure.
                </DocParagraph>

                <DocGrid cols={2} className="mt-4">
                    <DocCard
                        title="Knowledge Bases"
                        description="Upload documents, websites, PDFs, and structured data."
                    />
                    <DocCard
                        title="Managed Vector Storage"
                        description="Hosted retrieval infrastructure with automatic indexing."
                    />
                    <DocCard
                        title="Enterprise Connectors"
                        description="Connect CRMs, databases, internal tools, and business systems."
                    />
                    <DocCard
                        title="Custom Agent Memory"
                        description="Persistent memory and context layers tailored to each agent."
                    />
                </DocGrid>
            </DocSection>

            <DocDivider />

            <DocSection id="deployments" label="Infrastructure" title="Agent Deployments">
                <DocParagraph>
                    Production infrastructure for deploying and operating agents at scale.
                </DocParagraph>

                <DocGrid cols={2} className="mt-4">
                    <DocCard
                        title="Managed Hosting"
                        description="Deploy agents without managing servers or infrastructure."
                    />
                    <DocCard
                        title="Traffic Management"
                        description="Canary releases, rollbacks, and controlled deployments."
                    />
                    <DocCard
                        title="Observability"
                        description="Logs, traces, usage metrics, and operational insights."
                    />
                    <DocCard
                        title="Global Delivery"
                        description="Low-latency execution across regions."
                    />
                </DocGrid>
            </DocSection>

            <DocDivider />

            <DocSection id="marketplace" label="Distribution" title="Agent Marketplace">
                <DocParagraph>
                    Publish, discover, and distribute agents through a unified marketplace.
                </DocParagraph>

                <DocGrid cols={2} className="mt-4">
                    <DocCard
                        title="Public Listings"
                        description="Publish agents for discovery by customers."
                    />
                    <DocCard
                        title="Private Distribution"
                        description="Share agents with teams and organizations."
                    />
                    <DocCard
                        title="Verified Creators"
                        description="Build trust through verification and reputation systems."
                    />
                    <DocCard
                        title="Usage Analytics"
                        description="Understand adoption and customer engagement."
                    />
                </DocGrid>
            </DocSection>

            <DocDivider />

            <DocSection id="commerce" label="Monetization" title="Agent Commerce">
                <DocParagraph>Everything required to sell and monetize AI agents.</DocParagraph>

                <DocGrid cols={2} className="mt-4">
                    <DocCard
                        title="Subscriptions"
                        description="Monthly and annual billing models."
                    />
                    <DocCard
                        title="Usage Pricing"
                        description="Charge based on requests, tokens, or actions."
                    />
                    <DocCard
                        title="Revenue Management"
                        description="Payments, invoicing, and creator payouts."
                    />
                    <DocCard
                        title="Licensing"
                        description="Control access and commercial usage rights."
                    />
                </DocGrid>
            </DocSection>
        </DocPageWrapper>
    );
}
