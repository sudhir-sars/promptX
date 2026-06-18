import {
	Callout,
	CodeBlock,
	DocCard,
	DocDivider,
	DocGrid,
	DocPageWrapper,
	DocParagraph,
	DocSection,
	InlineCode,
	StepList,
	TerminalBlock,
} from "../doc-primitives";

export default function GettingStartedContent() {
	return (
		<DocPageWrapper>
			<section className="border-b border-border/50 pb-10">
				<div className="mb-6 flex items-center gap-3">
					<div className="h-px w-10 bg-foreground/20" />
					<p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
						getting started
					</p>
				</div>

				<h1 className="max-w-2xl font-bold leading-[1.05] text-4xl tracking-tight text-foreground/90">
					Get up and running
					<br />
					in two minutes.
				</h1>

				<DocParagraph className="mt-5 max-w-2xl text-balance">
					PromptX gives you version control, instant rollbacks, and gradual rollouts for every prompt in production.
					This guide walks you through installation, project creation, and your first deployment.
				</DocParagraph>

				<div className="mt-8 flex flex-wrap gap-2">
					{["Node.js 18+", "SDK setup", "First deploy"].map((tag) => (
						<div
							key={tag}
							className="rounded-full border border-foreground/[0.08] bg-input/50 px-4 py-1.5 text-[11px] "
						>
							{tag}
						</div>
					))}
				</div>
			</section>

			<DocSection id="prerequisites" label="Before you begin" title="Prerequisites">
				<DocParagraph>
					You need a PromptX account and Node.js 18+ installed. The SDK supports all major runtimes, but this guide uses
					Node.js so the setup stays concrete and easy to follow.
				</DocParagraph>
				<Callout type="tip" className="mt-4">
					Don&apos;t have an account yet? Sign up at{" "}
					<a href="/sign-in" className="underline underline-offset-2">
						xevos.ai/sign-in
					</a>
					. It&apos;s free for individual developers — no credit card required.
				</Callout>
			</DocSection>

			<DocDivider />

			<DocSection id="install" label="Step 1" title="Install the SDK">
				<DocParagraph>Install the PromptX SDK using your preferred package manager.</DocParagraph>
				<div className="mt-5 flex flex-col gap-3">
					<TerminalBlock commands="npm install @xevos-ai/promptx" />
					<TerminalBlock commands="yarn add @xevos-ai/promptx" />
					<TerminalBlock commands="pnpm add @xevos-ai/promptx" />
				</div>
			</DocSection>

			<DocDivider />

			<DocSection id="configure" label="Step 2" title="Configure your API key">
				<DocParagraph>
					Create an API key from the PromptX dashboard under <InlineCode>Settings → API Keys</InlineCode>, then store it
					in your environment variables.
				</DocParagraph>
				<CodeBlock className="mt-5" filename=".env" code={`PROMPTX_API_KEY=xe_live_...`} />
				<Callout type="warning" className="mt-4">
					Never commit your API key to version control. Add <InlineCode>.env</InlineCode> to your{" "}
					<InlineCode>.gitignore</InlineCode>.
				</Callout>
			</DocSection>

			<DocDivider />

			<DocSection id="initialize" label="Step 3" title="Import the client">
				<DocParagraph>
					There is nothing to initialize — import the ready-to-use <InlineCode>promptx</InlineCode> singleton. It
					reads its configuration from your environment automatically.
				</DocParagraph>
				<CodeBlock
					className="mt-5"
					language="typescript"
					code={`import { promptx } from "@xevos-ai/promptx";`}
				/>
			</DocSection>

			<DocDivider />

			<DocSection id="first-prompt" label="Step 4" title="Fetch your first prompt">
				<DocParagraph>
					Once you&apos;ve created a prompt in the dashboard and deployed it, you can fetch it from your application
					code. The SDK resolves the currently active deployment automatically.
				</DocParagraph>
				<CodeBlock
					className="mt-5"
					language="typescript"
					filename="app/api/chat/route.ts"
					code={`import { promptx } from "@xevos-ai/promptx";

export async function POST(req: Request) {
  const { message } = await req.json();

  // Fetch the active deployment of "checkout-assistant"
  const prompt = await promptx.getPrompt("checkout-assistant");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: prompt.content },
      { role: "user", content: message },
    ],
  });

  return Response.json({ reply: response.choices[0].message.content });
}`}
				/>
				<Callout type="note" className="mt-4">
					<InlineCode>promptx.getPrompt()</InlineCode> automatically resolves traffic-split deployments. If you have a
					canary deployment at 10%, 10% of sessions will receive the canary version.
				</Callout>
			</DocSection>

			<DocDivider />

			<DocSection id="deploy" label="Step 5" title="Deploy a version">
				<StepList
					className="mt-2"
					steps={[
						{
							title: "Open the Prompt Studio",
							content: "Navigate to your prompt in the dashboard. Edit the system prompt content in the editor.",
						},
						{
							title: "Save a version",
							content:
								"Click 'Save Version' to create an immutable snapshot. Give it a descriptive name like 'Added discount logic.'",
						},
						{
							title: "Deploy",
							content:
								"Click 'Deploy' on the version you want live and choose its traffic allocation.",
						},
						{
							title: "Verify",
							content: "The SDK automatically picks up the new deployment. No code changes, no redeploy.",
						},
					]}
				/>
			</DocSection>

			<DocDivider />

			<DocSection id="next-steps" label="What's next" title="Continue learning">
				<DocGrid cols={2} className="mt-2">
					<DocCard
						title="Prompt Versioning"
						description="Understand the version model, diffs, and lifecycle states."
						href="/docs/prompt-versioning"
					/>
					<DocCard
						title="Deployments"
						description="Traffic splitting, canary releases, and rollback procedures."
						href="/docs/deployments"
					/>
					<DocCard
						title="Authentication"
						description="API key scopes, team permissions, and SDK auth setup."
						href="/docs/authentication"
					/>
					<DocCard
						title="Examples"
						description="Real-world patterns and code snippets for common workflows."
						href="/docs/examples"
					/>
				</DocGrid>
			</DocSection>
		</DocPageWrapper>
	);
}
