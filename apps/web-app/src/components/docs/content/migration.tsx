import {
	Callout,
	CodeBlock,
	DocCard,
	DocDivider,
	DocGrid,
	DocH3,
	DocList,
	DocPageWrapper,
	DocParagraph,
	DocSection,
	InlineCode,
	StepList,
} from "../doc-primitives";

export default function MigrationContent() {
	return (
		<DocPageWrapper>
			<div>
				<h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">
					Migration Guide
				</h1>
				<DocParagraph className="mt-4 max-w-lg">
					Move from hardcoded prompts to PromptX. This guide walks through a
					typical migration with practical examples and a verification
					checklist.
				</DocParagraph>
			</div>

			<DocDivider />

			<DocSection
				id="from-hardcoded"
				label="Migration path"
				title="From hardcoded prompts"
			>
				<DocParagraph>
					Most teams start with prompts embedded directly in application code.
					The migration is straightforward: extract each prompt into PromptX,
					then replace the hardcoded string with an SDK call.
				</DocParagraph>

				<DocH3 className="mt-5">Before</DocH3>
				<CodeBlock
					className="mt-3"
					language="typescript"
					code={`const SYSTEM_PROMPT = \`You are a helpful checkout assistant.
Guide the user through their purchase step by step.
Be concise and friendly.\`;

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ],
});`}
				/>

				<DocH3 className="mt-5">After</DocH3>
				<CodeBlock
					className="mt-3"
					language="typescript"
					code={`import { promptx } from "@xevos-ai/promptx";

const prompt = await promptx.getPrompt("checkout-assistant");

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: prompt.content },
    { role: "user", content: userMessage },
  ],
});`}
				/>

				<Callout type="tip" className="mt-4">
					Start by migrating your most frequently changed prompts first. They
					benefit the most from version control and no-deploy updates.
				</Callout>
			</DocSection>

			<DocDivider />

			<DocSection
				id="step-by-step"
				label="Process"
				title="Step-by-step migration"
			>
				<StepList
					steps={[
						{
							title: "Inventory your prompts",
							content: (
								<>
									Search your codebase for all system prompts. Common patterns:{" "}
									<InlineCode>role: &quot;system&quot;</InlineCode>,{" "}
									<InlineCode>system_prompt</InlineCode>,{" "}
									<InlineCode>SYSTEM_PROMPT</InlineCode>. Document each one with
									its location and purpose.
								</>
							),
						},
						{
							title: "Create prompts in PromptX",
							content:
								"For each prompt, create a new entry in the dashboard. Paste the current prompt content and give it a meaningful slug.",
						},
						{
							title: "Save and deploy",
							content:
								"Save the initial version and deploy it. This makes it available via the SDK.",
						},
						{
							title: "Install the SDK",
							content:
								"Add the PromptX SDK to your project and configure the client with your API key.",
						},
						{
							title: "Replace hardcoded strings",
							content:
								"Replace each hardcoded prompt with a promptx.getPrompt() call. Deploy and verify each prompt one at a time.",
						},
						{
							title: "Remove dead code",
							content:
								"Once all prompts are migrated and verified, remove the hardcoded strings and any prompt-related configuration files.",
						},
					]}
				/>
			</DocSection>

			<DocDivider />

			<DocSection
				id="verification"
				label="Checklist"
				title="Migration verification"
			>
				<DocList
					items={[
						"All prompts created in PromptX with correct content",
						"Initial versions saved and deployed",
						"SDK installed and client configured in your application",
						"All hardcoded prompt references replaced with SDK calls",
						"Error handling and fallback prompts implemented",
						"Production deployment completed with monitoring",
						"Old prompt strings cleaned up",
					]}
				/>

				<DocGrid cols={2} className="mt-8">
					<DocCard
						title="Prompt Versioning"
						description="Learn how the version model works and best practices for managing versions."
						href="/docs/prompt-versioning"
					/>
					<DocCard
						title="Deployments"
						description="Set up traffic splitting and canary releases for migrated prompts."
						href="/docs/deployments"
					/>
				</DocGrid>
			</DocSection>
		</DocPageWrapper>
	);
}
