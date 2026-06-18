import {
	Callout,
	CodeBlock,
	DocDivider,
	DocPageWrapper,
	DocParagraph,
	DocSection,
	InlineCode,
} from "../doc-primitives";

export default function ExamplesContent() {
	return (
		<DocPageWrapper>
			<div>
				<h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">Examples</h1>
				<DocParagraph className="mt-4 max-w-lg">
					Production patterns for integrating PromptX into real applications. Each example is self-contained and ready
					to adapt.
				</DocParagraph>
			</div>
			<DocDivider />
			<DocSection id="basic-fetch" label="Pattern" title="Basic prompt fetch">
				<DocParagraph>
					The simplest integration — fetch a deployed prompt and pass it to your LLM provider. The SDK resolves the
					currently active version for the client's environment automatically.
				</DocParagraph>
				<CodeBlock
					className="mt-5"
					language="typescript"
					code={`import { promptx } from "@xevos-ai/promptx";

const prompt = await promptx.getPrompt("support-agent");

const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: prompt.content },
    { role: "user", content: userMessage },
  ],
});`}
				/>
				<Callout type="note" className="mt-4">
					The resolved prompt exposes <InlineCode>identifier</InlineCode>, <InlineCode>env</InlineCode>,{" "}
					<InlineCode>content</InlineCode>, <InlineCode>sequence</InlineCode> (the version number), and{" "}
					<InlineCode>traffic</InlineCode>. Compose template variables in your own application code.
				</Callout>
			</DocSection>
			<DocDivider />
			<DocSection id="ab-testing" label="Pattern" title="A/B testing with traffic splits">
				<DocParagraph>
					PromptX supports percentage-based traffic splitting between deployed prompt versions. To ensure accurate
					experiment results, provide a stable unique identifier via
					<InlineCode>sessionId</InlineCode>. This can be a user ID, chat ID, conversation ID, session ID, or any
					identifier that uniquely represents the current user or conversation.
				</DocParagraph>

				<Callout type="warning" className="mt-4">
					A/B testing requires a stable <InlineCode>sessionId</InlineCode>. If no <InlineCode>sessionId</InlineCode> is
					provided, PromptX resolves requests to the version with the highest traffic allocation.
				</Callout>

				<CodeBlock
					className="mt-5"
					language="typescript"
					code={`const prompt = await promptx.getPrompt("checkout-assistant", {
  // Any stable unique identifier
  sessionId: chat.id,
});

// The same session consistently receives the same variant
// throughout the experiment`}
				/>

				<Callout type="note" className="mt-4">
					Traffic split percentages are configured in the deployment settings. Once a <InlineCode>sessionId</InlineCode>{" "}
					is provided, PromptX performs deterministic sticky allocation so the same user or conversation remains on the
					same variant.
				</Callout>
			</DocSection>
			<DocDivider />

			<DocSection id="caching" label="Pattern" title="Caching">
				<DocParagraph>
					The client keeps an in-memory, stale-while-revalidate cache. Fresh prompts are served from memory; once a
					cached entry passes its max-age it is still served while a background refresh runs.
				</DocParagraph>
				<CodeBlock
					className="mt-5"
					language="typescript"
					code={`// Served from cache when fresh, refreshed in the background when stale
const prompt = await promptx.getPrompt("support-agent");`}
				/>
				<Callout type="note" className="mt-4">
					Caching is built in and zero-config: each prompt is served fresh for 60s, then served stale for a further
					60s while a single background refresh runs. Development fetches are never cached.
				</Callout>
			</DocSection>
			<DocDivider />

			<DocSection id="error-handling" label="Pattern" title="Error handling and fallbacks">
				<DocParagraph>
					The SDK throws typed errors for failed fetches. Always handle errors gracefully, especially in production code
					paths.
				</DocParagraph>
				<CodeBlock
					className="mt-5"
					language="typescript"
					code={`import { promptx } from "@xevos-ai/promptx";
import { PromptFetchError, PromptxError } from "@xevos-ai/promptx";

try {
  const prompt = await promptx.getPrompt("checkout-assistant");
} catch (error) {
  if (error instanceof PromptFetchError) {
    // HTTP-level failure from the edge (404, 401, 503, ...)
    console.error("PromptX fetch failed:", error.status, error.message);
    return FALLBACK_PROMPT;
  }

  if (error instanceof PromptxError) {
    console.error("PromptX error:", error.message);
    return FALLBACK_PROMPT;
  }

  throw error;
}`}
				/>
				<Callout type="warning" className="mt-4">
					Always have a fallback prompt for critical code paths. Network issues and API outages happen — your
					application should degrade gracefully. <InlineCode>PromptFetchError</InlineCode> extends{" "}
					<InlineCode>PromptxError</InlineCode> and carries the HTTP <InlineCode>status</InlineCode>.
				</Callout>
			</DocSection>
		</DocPageWrapper>
	);
}
