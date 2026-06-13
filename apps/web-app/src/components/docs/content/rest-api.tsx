import {
  Callout,
  CodeBlock,
  DocDivider,
  DocPageWrapper,
  DocParagraph,
  DocSection,
  InlineCode,
} from "../doc-primitives";

export default function RestApiContent() {
  return (
    <DocPageWrapper>
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">
          REST API
        </h1>

        <DocParagraph className="mt-4 max-w-lg">
          Integrate Xevos directly over HTTP. No SDK required — works in any language or runtime.
        </DocParagraph>
      </div>

      <DocDivider />

      <DocSection id="base-url" label="Setup" title="Base URL">
        <CodeBlock
          language="bash"
          filename=".env"
          code={`XEVOS_API_BASE=https://api.xevos.ai
XEVOS_API_KEY=px_live_xxxxxxxxx`}
        />

        <DocParagraph className="mt-4">
          All endpoints are versioned under <InlineCode>/v1</InlineCode>. Authenticate every request
          by passing your API key in the <InlineCode>Authorization</InlineCode> header.
        </DocParagraph>
      </DocSection>

      <DocDivider />

      <DocSection id="authentication" label="Authentication" title="Authentication">
        <DocParagraph>Pass your API key as a Bearer token on every request.</DocParagraph>

        <CodeBlock
          className="mt-5"
          language="bash"
          code={`curl https://api.xevos.ai/v1/prompts/chat-assistant \\
  -H "Authorization: Bearer px_live_xxxxxxxxx"`}
        />

        <Callout type="note" className="mt-4">
          Keep your API key out of client-side code. All requests should originate from your server.
        </Callout>
      </DocSection>

      <DocDivider />

      <DocSection id="get-prompt" label="Endpoints" title="Get a Prompt">
        <DocParagraph>Fetch the active deployment of a prompt by its slug.</DocParagraph>

        <CodeBlock className="mt-5" language="bash" code={`GET /v1/prompts/:slug`} />

        <CodeBlock
          className="mt-5"
          language="bash"
          filename="Request"
          code={`curl https://api.xevos.ai/v1/prompts/chat-assistant \\
  -H "Authorization: Bearer px_live_xxxxxxxxx"`}
        />

        <CodeBlock
          className="mt-5"
          language="json"
          filename="Response"
          code={`{
  "id": "prm_01j9xkz3fg",
  "slug": "chat-assistant",
  "content": "You are a helpful assistant...",
  "version": 4,
  "deployed_at": "2025-06-01T10:22:00Z"
}`}
        />
      </DocSection>

      <DocDivider />

      <DocSection id="session" label="Experiments" title="A/B Testing">
        <DocParagraph>
          Pass a stable <InlineCode>session_id</InlineCode> to enable consistent variant assignment
          across traffic splits.
        </DocParagraph>

        <CodeBlock
          className="mt-5"
          language="bash"
          filename="Request"
          code={`curl "https://api.xevos.ai/v1/prompts/chat-assistant?session_id=user_8f3kd" \\
  -H "Authorization: Bearer px_live_xxxxxxxxx"`}
        />
      </DocSection>

      <DocDivider />

      <DocSection id="llm-usage" label="LLMs" title="Use with an LLM">
        <DocParagraph>
          Fetch the prompt and pass its content to your model in the same request cycle.
        </DocParagraph>

        <CodeBlock
          className="mt-5"
          language="typescript"
          code={`const res = await fetch(
  "https://api.xevos.ai/v1/prompts/chat-assistant",
  {
    headers: {
      Authorization: \`Bearer \${process.env.XEVOS_API_KEY}\`,
    },
  }
);

const { content } = await res.json();

const completion =
  await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content },
      { role: "user", content: message },
    ],
  });`}
        />
      </DocSection>

      <DocDivider />
    </DocPageWrapper>
  );
}
