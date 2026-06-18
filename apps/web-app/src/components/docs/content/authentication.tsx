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
				<h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">Authentication</h1>

				<DocParagraph className="mt-4 max-w-lg">
					PromptX authenticates all SDK requests using a single API key generated from the dashboard.
				</DocParagraph>
			</div>

			<DocDivider />

			<DocSection id="api-key" label="Credentials" title="API key">
				<DocParagraph>
					Your API key authenticates requests made through the PromptX SDK or the REST API. Keys are scoped to a single
					team and use the format <InlineCode>xe_live_&lt;keyId&gt;_&lt;teamId&gt;.&lt;secret&gt;</InlineCode>. The
					secret is shown only once at creation — store it immediately. You can create or revoke keys from the dashboard
					at any time.
				</DocParagraph>

				<Callout type="warning" className="mt-4">
					Keep your API key secret. Anyone with access to the key can resolve prompts on behalf of your team. PromptX
					stores only a hash of the secret, so a lost key cannot be recovered — revoke it and create a new one.
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
					code={`PROMPTX_API_KEY=xe_live_xxxxxxxxxx_<teamId>.xxxxxxxxxxxxxxxx`}
				/>
			</DocSection>

			<DocDivider />

			<DocSection id="sdk-auth" label="SDK" title="SDK authentication">
				<DocParagraph>
					Pass your API key to the client constructor. Read it from an environment variable rather than hardcoding it.
				</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="typescript"
					code={`import { PromptXClient } from "@xevos-ai/promptx";

const promptx = new PromptXClient({
  apiKey: process.env.PROMPTX_API_KEY!,
  // Optional: target a non-production environment
  // env: "preview",
});`}
				/>
			</DocSection>

			<DocDivider />

			<DocSection id="rotation" label="Security" title="Regenerating your API key">
				<DocParagraph>
					If your API key is compromised or needs to be rotated, generate a new key from the dashboard and update any
					applications using the old key.
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
