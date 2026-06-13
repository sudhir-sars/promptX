import {
    DocPageWrapper,
    DocSection,
    DocParagraph,
    DocDivider,
    CodeBlock,
    TerminalBlock,
    Callout,
    InlineCode,
} from "../doc-primitives";

export default function NodejsContent() {
    return (
        <DocPageWrapper>
            <div>
                <h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">
                    Node.js
                </h1>

                <DocParagraph className="mt-4 max-w-lg">
                    Use PromptX in any Node.js application to manage, version, and experiment with
                    prompts.
                </DocParagraph>
            </div>

            <DocDivider />

            <DocSection id="installation" label="Setup" title="Installation">
                <TerminalBlock commands="npm install @promptx/sdk" />

                <DocParagraph className="mt-4">PromptX works in any Node.js runtime.</DocParagraph>
            </DocSection>

            <DocDivider />

            <DocSection id="configuration" label="Configuration" title="Configuration">
                <DocParagraph>
                    The SDK automatically reads <InlineCode>PROMPTX_API_KEY</InlineCode> from your
                    environment.
                </DocParagraph>

                <CodeBlock
                    className="mt-5"
                    language="bash"
                    filename=".env"
                    code={`PROMPTX_API_KEY=px_live_xxxxxxxxx`}
                />

                <CodeBlock
                    className="mt-5"
                    language="typescript"
                    filename="promptx.ts"
                    code={`import { PromptX } from "@promptx/sdk";

export const promptx = new PromptX();`}
                />

                <Callout type="note" className="mt-4">
                    When no API key is provided, PromptX automatically uses{" "}
                    <InlineCode>PROMPTX_API_KEY</InlineCode>.
                </Callout>
            </DocSection>

            <DocDivider />

            <DocSection id="getting-started" label="Usage" title="Get a Prompt">
                <DocParagraph>Fetch the latest version of a prompt.</DocParagraph>

                <CodeBlock
                    className="mt-5"
                    language="typescript"
                    code={`const prompt = await promptx.get(
  "chat-assistant"
);

console.log(prompt.content);`}
                />
            </DocSection>

            <DocDivider />

            <DocSection id="llm-usage" label="LLMs" title="Use with an LLM">
                <DocParagraph>
                    Resolve prompts immediately before making model requests.
                </DocParagraph>

                <CodeBlock
                    className="mt-5"
                    language="typescript"
                    code={`const prompt = await promptx.get(
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
                <DocParagraph>
                    Pass a stable session identifier to enable traffic allocation and A/B testing.
                </DocParagraph>

                <CodeBlock
                    className="mt-5"
                    language="typescript"
                    code={`const prompt = await promptx.get(
  "chat-assistant",
  {
    sessionId: chatId,
  }
);`}
                />

                <Callout type="note" className="mt-4">
                    Without a session ID, PromptX cannot consistently assign the same session to the
                    same variant.
                </Callout>
            </DocSection>

            <DocDivider />
        </DocPageWrapper>
    );
}
