import { Callout, DocDivider, DocPageWrapper, DocParagraph, DocSection, InlineCode } from "../doc-primitives";

export default function ReleasesContent() {
	return (
		<DocPageWrapper>
			<section className="border-b border-border/50 pb-10">
				<div className="mb-6 flex items-center gap-3">
					<div className="h-px w-10 bg-foreground/20" />
					<p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
						releases
					</p>
				</div>

				<h1 className="max-w-2xl font-bold leading-[1.05] text-4xl tracking-tight text-foreground/90">
					Product releases
					<br />
					and updates.
				</h1>

				<DocParagraph className="mt-5 max-w-2xl text-balance">
					Follow the evolution of PromptX. Every release includes new features, platform improvements, bug fixes, and
					deployment updates.
				</DocParagraph>

				<div className="mt-8 flex flex-wrap gap-2">
					{["Versioned", "Release Notes", "Platform Updates"].map((tag) => (
						<div key={tag} className="rounded-full border border-foreground/[0.08] bg-input/50 px-4 py-1.5 text-[11px]">
							{tag}
						</div>
					))}
				</div>
			</section>

			<DocSection id="v0-1-0" label="May 2026" title="v0.1.0 — Initial Public Release">
				<DocParagraph>
					The first public release of PromptX introduces the core platform for managing prompts as production
					infrastructure.
				</DocParagraph>

				<Callout type="tip" className="mt-4">
					Released in May 2026.
				</Callout>

				<div className="mt-8 space-y-8">
					<div>
						<h3 className="mb-3 font-semibold text-lg">New</h3>

						<ul className="space-y-2 text-muted-foreground">
							<li>• Prompt Studio editor</li>
							<li>• Prompt versioning</li>
							<li>• Immutable version history</li>
							<li>• One-click rollbacks</li>
							<li>• Environment deployments</li>
							<li>• Traffic allocation controls</li>
							<li>• Node.js SDK</li>
							<li>• Next.js integration</li>
							<li>• REST API</li>
							<li>• API key management</li>
						</ul>
					</div>

					<div>
						<h3 className="mb-3 font-semibold text-lg">Platform</h3>

						<ul className="space-y-2 text-muted-foreground">
							<li>• Deployment history tracking</li>
							<li>• Version comparison tools</li>
							<li>• Team-ready project architecture</li>
							<li>• Production-grade prompt delivery</li>
						</ul>
					</div>

					<div>
						<h3 className="mb-3 font-semibold text-lg">Developer Experience</h3>

						<ul className="space-y-2 text-muted-foreground">
							<li>• TypeScript-first SDK design</li>
							<li>• Environment variable configuration</li>
							<li>
								• Standardized API key format using <InlineCode>px_live_</InlineCode>
							</li>
							<li>• Framework-friendly integration patterns</li>
						</ul>
					</div>
				</div>
			</DocSection>

			<DocDivider />

			<DocSection id="upcoming" label="Next Release" title="What's coming next">
				<DocParagraph>
					We are actively working on new SDKs, deployment workflows, and collaboration features.
				</DocParagraph>

				<Callout type="note" className="mt-4">
					For planned features and future work, see the roadmap page.
				</Callout>
			</DocSection>
		</DocPageWrapper>
	);
}
