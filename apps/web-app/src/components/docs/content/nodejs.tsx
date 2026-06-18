import {
	Callout,
	CodeBlock,
	DocDivider,
	DocPageWrapper,
	DocParagraph,
	DocSection,
	InlineCode,
	PropTable,
	TerminalBlock,
} from "../doc-primitives";

export default function NodejsContent() {
	return (
		<DocPageWrapper>
			<div>
				<h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">Node.js</h1>

				<DocParagraph className="mt-4 max-w-lg">
					Use PromptX in any Node.js application to manage, version, and experiment with prompts.
				</DocParagraph>
			</div>

			<DocDivider />

			<DocSection id="installation" label="Setup" title="Installation">
				<TerminalBlock commands="npm install @xevos-ai/promptx" />

				<DocParagraph className="mt-4">PromptX works in any Node.js 18+ runtime.</DocParagraph>
			</DocSection>

			<DocDivider />

			<DocSection id="configuration" label="Configuration" title="Configuration">
				<DocParagraph>
					Store your API key in the <InlineCode>PROMPTX_API_KEY</InlineCode> environment variable — the SDK reads it
					automatically.
				</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="bash"
					filename=".env"
					code={`PROMPTX_API_KEY=xe_live_xxxxxxxxxx_<teamId>.xxxxxxxx`}
				/>

				<CodeBlock
					className="mt-5"
					language="typescript"
					code={`import { promptx } from "@xevos-ai/promptx";`}
				/>

				<Callout type="note" className="mt-4">
					<InlineCode>PROMPTX_API_KEY</InlineCode> is the only variable you set. The environment is chosen
					automatically from <InlineCode>NODE_ENV</InlineCode>.
				</Callout>
			</DocSection>

			<DocDivider />

			<DocSection id="getting-started" label="Usage" title="Get a Prompt">
				<DocParagraph>Resolve the active deployment of a prompt for the client's environment.</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="typescript"
					code={`const prompt = await promptx.getPrompt(
  "chat-assistant"
);

console.log(prompt.content);   // string
console.log(prompt.sequence);  // version number`}
				/>
			</DocSection>

			<DocDivider />

			<DocSection id="llm-usage" label="LLMs" title="Use with an LLM">
				<DocParagraph>Resolve prompts immediately before making model requests.</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="typescript"
					code={`const prompt = await promptx.getPrompt(
  "chat-assistant"
);

const completion =
  await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: prompt.content,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });`}
				/>
			</DocSection>

			<DocDivider />

			<DocSection id="ab-testing" label="Experiments" title="A/B Testing">
				<DocParagraph>Pass a stable session identifier to enable traffic allocation and A/B testing.</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="typescript"
					code={`const prompt = await promptx.getPrompt(
  "chat-assistant",
  {
    sessionId: chatId,
  }
);`}
				/>

				<Callout type="note" className="mt-4">
					Without a session ID, PromptX cannot consistently assign the same session to the same variant. It instead
					serves the variant with the highest configured traffic allocation.
				</Callout>
			</DocSection>

			<DocDivider />

			<DocSection id="error-handling" label="Errors" title="Error handling">
				<DocParagraph>
					The SDK throws <InlineCode>PromptFetchError</InlineCode> when the edge returns a non-2xx response. It extends{" "}
					<InlineCode>PromptxError</InlineCode> and exposes the HTTP <InlineCode>status</InlineCode>.
				</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="typescript"
					code={`import { PromptFetchError } from "@xevos-ai/promptx";

try {
  const prompt = await promptx.getPrompt("chat-assistant");
} catch (error) {
  if (error instanceof PromptFetchError) {
    console.error(error.status, error.message);
    return FALLBACK_PROMPT;
  }
  throw error;
}`}
				/>
			</DocSection>

			<DocDivider />

			<DocSection id="config" label="Reference" title="Config Options">
				<DocParagraph>
					The client configures itself from the environment. The environment (production or development) is taken
					from <InlineCode>NODE_ENV</InlineCode>.
				</DocParagraph>

				<PropTable
					className="mt-5"
					columns={["Variable", "Type", "Default", "Description"]}
					rows={[["PROMPTX_API_KEY", "string", "—", "Required. Your team's API key."]]}
				/>
			</DocSection>

			<DocDivider />
		</DocPageWrapper>
	);
}
