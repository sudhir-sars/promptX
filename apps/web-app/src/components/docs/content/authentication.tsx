import {
  Callout,
  CodeBlock,
  DocDivider,
  DocList,
  DocPageWrapper,
  DocParagraph,
  DocSection,
  InlineCode,
} from "../doc-primitives";

export default function AuthenticationContent() {
  return (
    <DocPageWrapper>
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">
          Authentication
        </h1>

        <DocParagraph className="mt-4 max-w-lg">
          PromptX authenticates all SDK requests using a single API key generated from the
          dashboard.
        </DocParagraph>
      </div>

      <DocDivider />

      <DocSection id="api-key" label="Credentials" title="API key">
        <DocParagraph>
          Your API key is used to authenticate requests made through the PromptX SDK. You can view
          or regenerate your key from the dashboard at any time.
        </DocParagraph>

        <Callout type="warning" className="mt-4">
          Keep your API key secret. Anyone with access to the key can make requests on behalf of
          your PromptX account.
        </Callout>
      </DocSection>

      <DocDivider />

      <DocSection id="setup" label="Setup" title="Adding your API key">
        <DocParagraph>
          Store your API key in an environment variable and load it when creating a PromptX client.
        </DocParagraph>

        <CodeBlock
          className="mt-5"
          filename=".env.local"
          code={`PROMPTX_API_KEY=px_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
        />
      </DocSection>

      <DocDivider />

      <DocSection id="sdk-auth" label="SDK" title="SDK authentication">
        <DocParagraph>
          By default, the SDK automatically reads the API key from the{" "}
          <InlineCode>PROMPTX_API_KEY</InlineCode> environment variable.
        </DocParagraph>

        <CodeBlock
          className="mt-5"
          language="typescript"
          code={`import { PromptX } from "@promptx/sdk";

const promptx = new PromptX();

// Or explicitly:

const promptx = new PromptX({
  apiKey: process.env.PROMPTX_API_KEY!,
});`}
        />
      </DocSection>

      <DocDivider />

      <DocSection id="rotation" label="Security" title="Regenerating your API key">
        <DocParagraph>
          If your API key is compromised or needs to be rotated, generate a new key from the
          dashboard and update any applications using the old key.
        </DocParagraph>
      </DocSection>

      <DocDivider />

      <DocSection id="best-practices" label="Security" title="Security best practices">
        <DocList
          items={[
            "Never commit API keys to source control.",
            "Store API keys in environment variables or a secrets manager.",
            "Regenerate your API key immediately if you suspect it has been exposed.",
            "Do not embed API keys in client-side applications.",
            "Limit dashboard access to trusted team members.",
          ]}
        />
      </DocSection>
    </DocPageWrapper>
  );
}
