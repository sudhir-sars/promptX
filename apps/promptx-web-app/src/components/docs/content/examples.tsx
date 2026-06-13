import {
    DocPageWrapper,
    DocSection,
    DocParagraph,
    DocDivider,
    CodeBlock,
    Callout,
    InlineCode,
} from "../doc-primitives";

export default function ExamplesContent() {
    return (
        <DocPageWrapper>
            <div>
                <h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">
                    Examples
                </h1>
                <DocParagraph className="mt-4 max-w-lg">
                    Production patterns for integrating PromptX into real applications. Each example
                    is self-contained and ready to adapt.
                </DocParagraph>
            </div>
            <DocDivider />
            <DocSection id="basic-fetch" label="Pattern" title="Basic prompt fetch">
                <DocParagraph>
                    The simplest integration — fetch a deployed prompt and pass it to your LLM
                    provider. The SDK resolves the currently active version for the given
                    environment automatically.
                </DocParagraph>
                <CodeBlock
                    className="mt-5"
                    language="typescript"
                    code={`import { promptx } from "@/lib/promptx";

const prompt = await promptx.get("support-agent");

const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: prompt.content },
    { role: "user", content: userMessage },
  ],
});`}
                />
            </DocSection>
            <DocDivider />
            <DocSection id="template-variables" label="Pattern" title="Template variables">
                <DocParagraph>
                    PromptX supports Mustache-style template variables. Define placeholders in your
                    prompt and resolve them at fetch time.
                </DocParagraph>
                <CodeBlock
                    className="mt-5"
                    language="text"
                    filename="Prompt content in dashboard"
                    code={`You are a {{role}} assistant for {{company_name}}.
Respond in {{language}}.
Maximum response length: {{max_tokens}} tokens.`}
                />
                <CodeBlock
                    className="mt-4"
                    language="typescript"
                    filename="Application code"
                    code={`const prompt = await promptx.get("support-agent", {
  variables: {
    role: "customer support",
    company_name: "Acme Corp",
    language: "English",
    max_tokens: "500",
  },
});

// prompt.content is the fully resolved string`}
                />
            </DocSection>
            <DocDivider />
            <DocSection id="ab-testing" label="Pattern" title="A/B testing with traffic splits">
                <DocParagraph>
                    PromptX supports percentage-based traffic splitting between deployed prompt
                    versions. To ensure accurate experiment results, you must provide a stable
                    unique identifier via
                    <InlineCode>sessionId</InlineCode>. This can be a user ID, chat ID, conversation
                    ID, session ID, or any identifier that uniquely represents the current user or
                    conversation.
                </DocParagraph>

                <Callout type="warning" className="mt-4">
                    A/B testing requires a stable <InlineCode>sessionId</InlineCode>. If no{" "}
                    <InlineCode>sessionId</InlineCode> is provided, PromptX resolves requests to the
                    version with the highest traffic allocation.
                </Callout>

                <CodeBlock
                    className="mt-5"
                    language="typescript"
                    code={`const prompt = await promptx.get("checkout-assistant", {
  // Any stable unique identifier
  sessionId: chat.id,
});

// User will consistently receive the same variant
// throughout the experiment`}
                />

                <Callout type="note" className="mt-4">
                    Traffic split percentages are configured in the deployment settings. Once a
                    <InlineCode>sessionId</InlineCode> is provided, PromptX automatically performs
                    sticky allocation and ensures the same user or conversation remains on the same
                    variant.
                </Callout>
            </DocSection>
            <DocDivider />

            <DocSection id="error-handling" label="Pattern" title="Error handling and fallbacks">
                <DocParagraph>
                    The SDK throws typed errors for common failure cases. Always handle errors
                    gracefully, especially in production code paths.
                </DocParagraph>
                <CodeBlock
                    className="mt-5"
                    language="typescript"
                    code={`import { promptx } from "@/lib/promptx";
import { PromptXError, PromptNotFoundError } from "@promptx/sdk";

try {
  const prompt = await promptx.get("checkout-assistant");
} catch (error) {
  if (error instanceof PromptNotFoundError) {
    console.error("Prompt not found:", error.slug);
    return FALLBACK_PROMPT;
  }

  if (error instanceof PromptXError) {
    console.error("PromptX API error:", error.message);
    return FALLBACK_PROMPT;
  }

  throw error;
}`}
                />
                <Callout type="warning" className="mt-4">
                    Always have a fallback prompt for critical code paths. Network issues and API
                    outages happen — your application should degrade gracefully.
                </Callout>
            </DocSection>
            <DocDivider />

            <DocSection id="middleware" label="Pattern" title="Middleware and hooks">
                <DocParagraph>
                    Register middleware functions to intercept, transform, or log prompt resolution.
                    Useful for observability, feature flags, and dynamic overrides.
                </DocParagraph>
                <CodeBlock
                    className="mt-5"
                    language="typescript"
                    code={`// Log every prompt resolution
promptx.use(async (ctx, next) => {
  const start = performance.now();
  await next();
  const ms = (performance.now() - start).toFixed(1);
  console.log(\`[promptx] \${ctx.slug} → v\${ctx.result.version} (\${ms}ms)\`);
});

// Override prompts in development
promptx.use(async (ctx, next) => {
  if (process.env.NODE_ENV === "development" && ctx.slug === "checkout-assistant") {
    ctx.result = {
      content: "You are a test assistant. Respond with 'Hello, test!'",
      version: 0,
      slug: ctx.slug,
    };
    return;
  }
  await next();
});`}
                />
            </DocSection>
        </DocPageWrapper>
    );
}
