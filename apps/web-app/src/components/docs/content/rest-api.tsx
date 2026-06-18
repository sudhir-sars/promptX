import {
	Callout,
	CodeBlock,
	DocDivider,
	DocPageWrapper,
	DocParagraph,
	DocSection,
	InlineCode,
	PropTable,
} from "../doc-primitives";

export default function RestApiContent() {
	return (
		<DocPageWrapper>
			<div>
				<h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">
					REST API
				</h1>

				<DocParagraph className="mt-4 max-w-lg">
					Resolve prompts directly over HTTP from the PromptX edge. No SDK
					required — works in any language or runtime.
				</DocParagraph>
			</div>

			<DocDivider />

			<DocSection id="base-url" label="Setup" title="Base URL">
				<DocParagraph>
					All endpoints are served from the edge worker and versioned under{" "}
					<InlineCode>/v0</InlineCode>. Authenticate every request by passing
					your API key as a Bearer token.
				</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="bash"
					filename=".env"
					code={`PROMPTX_API_BASE=https://edge.promptx.xevos.dev
PROMPTX_API_KEY=xe_live_xxxxxxxxxx_<teamId>.xxxxxxxx`}
				/>
			</DocSection>

			<DocDivider />

			<DocSection
				id="authentication"
				label="Authentication"
				title="Authentication"
			>
				<DocParagraph>
					Pass your API key as a Bearer token in the{" "}
					<InlineCode>Authorization</InlineCode> header on every request. Keys
					use the format{" "}
					<InlineCode>
						xe_live_&lt;keyId&gt;_&lt;teamId&gt;.&lt;secret&gt;
					</InlineCode>
					.
				</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="bash"
					code={`curl https://edge.promptx.xevos.dev/v0/prompts/chat-assistant \\
  -H "Authorization: Bearer xe_live_xxxxxxxxxx_<teamId>.xxxxxxxx"`}
				/>

				<Callout type="note" className="mt-4">
					Keep your API key out of client-side code. All requests should
					originate from your server.
				</Callout>
			</DocSection>

			<DocDivider />

			<DocSection id="get-prompt" label="Endpoints" title="Get a Prompt">
				<DocParagraph>
					Fetch the active deployment of a prompt by its identifier. The optional{" "}
					<InlineCode>env</InlineCode> query parameter accepts <InlineCode>production</InlineCode> or{" "}
					<InlineCode>development</InlineCode> and defaults to <InlineCode>production</InlineCode>.
				</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="bash"
					code={`GET /v0/prompts/:identifier?env=production`}
				/>

				<CodeBlock
					className="mt-5"
					language="bash"
					filename="Request"
					code={`curl "https://edge.promptx.xevos.dev/v0/prompts/chat-assistant?env=production" \\
  -H "Authorization: Bearer xe_live_xxxxxxxxxx_<teamId>.xxxxxxxx"`}
				/>

				<CodeBlock
					className="mt-5"
					language="json"
					filename="200 Response"
					code={`{
  "identifier": "chat-assistant",
  "env": "production",
  "content": "You are a helpful assistant...",
  "sequence": 4,
  "traffic": 100
}`}
				/>
			</DocSection>

			<DocDivider />

			<DocSection id="ab-testing" label="Experiments" title="A/B Testing">
				<DocParagraph>
					When a deployment splits traffic across multiple versions, pass a
					stable session identifier in the{" "}
					<InlineCode>x-promptx-session-id</InlineCode> header. The edge hashes
					this value to assign each session to a consistent version according to
					the deployment's traffic allocation.
				</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="bash"
					filename="Request"
					code={`curl "https://edge.promptx.xevos.dev/v0/prompts/chat-assistant?env=production" \\
  -H "Authorization: Bearer xe_live_xxxxxxxxxx_<teamId>.xxxxxxxx" \\
  -H "x-promptx-session-id: user_8f3kd"`}
				/>

				<DocParagraph className="mt-4">
					When a variant is selected and more than one variant exists, the
					response includes a <InlineCode>routing</InlineCode> object describing
					how the choice was made.
				</DocParagraph>

				<CodeBlock
					className="mt-4"
					language="json"
					filename="200 Response (multi-variant)"
					code={`{
  "identifier": "chat-assistant",
  "env": "production",
  "content": "You are a helpful assistant...",
  "sequence": 5,
  "traffic": 20,
  "routing": { "strategy": "user_sticky", "identifier": "user_8f3kd" }
}`}
				/>

				<Callout type="warning" className="mt-4">
					Without a <InlineCode>x-promptx-session-id</InlineCode> header, the
					edge serves the variant with the highest configured traffic
					allocation, and <InlineCode>routing.strategy</InlineCode> is{" "}
					<InlineCode>&quot;default&quot;</InlineCode>.
				</Callout>
			</DocSection>

			<DocDivider />

			<DocSection
				id="response-schema"
				label="Reference"
				title="Response Schema"
			>
				<DocParagraph>
					Every successful response returns the resolved prompt for the
					requested environment.
				</DocParagraph>

				<PropTable
					className="mt-5"
					columns={["Field", "Type", "Description"]}
					rows={[
						[
							"identifier",
							"string",
							"The prompt identifier (slug) that was requested.",
						],
						[
							"env",
							"string",
							"Resolved environment: production or development.",
						],
						["content", "string", "The prompt content to send to your model."],
						[
							"sequence",
							"number",
							"Version sequence number of the served variant.",
						],
						[
							"traffic",
							"number",
							"Traffic weight (0–100) of the served variant.",
						],
						[
							"routing",
							"object?",
							"Present only when the deployment has multiple variants.",
						],
					]}
				/>
			</DocSection>

			<DocDivider />

			<DocSection id="errors" label="Reference" title="Errors">
				<DocParagraph>
					Non-2xx responses return a JSON body of the shape{" "}
					<InlineCode>{`{ "error": string }`}</InlineCode>.
				</DocParagraph>

				<PropTable
					className="mt-5"
					columns={["Status", "Meaning"]}
					rows={[
						[
							"401",
							"Missing or malformed Authorization header, invalid API key, or key does not own the prompt.",
						],
						["404", "Prompt not found for this team."],
						["503", "No active deployment for the requested environment."],
					]}
				/>

				<CodeBlock
					className="mt-5"
					language="json"
					filename="Error Response"
					code={`{
  "error": "No active deployment for this environment"
}`}
				/>
			</DocSection>

			<DocDivider />

			<DocSection id="health" label="Status" title="Health Check">
				<DocParagraph>
					The unauthenticated <InlineCode>/health</InlineCode> endpoint returns
					a simple liveness payload.
				</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="bash"
					code={`curl https://edge.promptx.xevos.dev/health
# { "status": "ok" }`}
				/>
			</DocSection>
		</DocPageWrapper>
	);
}
