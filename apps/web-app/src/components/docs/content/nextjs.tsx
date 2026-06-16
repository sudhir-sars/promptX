import {
	Callout,
	CodeBlock,
	DocDivider,
	DocPageWrapper,
	DocParagraph,
	DocSection,
	InlineCode,
	TerminalBlock,
} from "../doc-primitives";

export default function NextjsContent() {
	return (
		<DocPageWrapper>
			<div>
				<h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">Next.js</h1>

				<DocParagraph className="mt-4 max-w-lg">
					Use PromptX from Route Handlers, Server Actions, Edge Runtime, and other server-side code. Prompts are
					typically resolved immediately before making a model request.
				</DocParagraph>
			</div>

			<DocDivider />

			<DocSection id="installation" label="Setup" title="Installation">
				<TerminalBlock commands="npm install @promptx/sdk" />

				<DocParagraph className="mt-4">
					PromptX works with both App Router and Pages Router. No Next.js-specific package is required.
				</DocParagraph>
			</DocSection>

			<DocDivider />

			<DocSection id="configuration" label="Configuration" title="Configuration">
				<DocParagraph>
					The SDK automatically reads <InlineCode>PROMPTX_API_KEY</InlineCode>. In most cases, that's all you need.
				</DocParagraph>

				<CodeBlock className="mt-5" language="bash" filename=".env" code={`PROMPTX_API_KEY=px_live_xxxxxxxxx`} />

				<CodeBlock
					className="mt-5"
					language="typescript"
					filename="lib/promptx.ts"
					code={`import { PromptX } from "@promptx/sdk";

export const promptx = new PromptX();`}
				/>

				<DocParagraph className="mt-4">To override the automatically detected API key:</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="typescript"
					code={`import { PromptX } from "@promptx/sdk";

export const promptx = new PromptX({
  apiKey: process.env.MY_PROMPTX_API_KEY!,
});`}
				/>

				<Callout type="note" className="mt-4">
					When no API key is provided, PromptX automatically uses <InlineCode>PROMPTX_API_KEY</InlineCode>.
				</Callout>
			</DocSection>

			<DocDivider />

			<DocSection id="route-handlers" label="API" title="Route Handlers">
				<DocParagraph>
					Route Handlers are the most common place to resolve prompts before making model requests.
				</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="typescript"
					filename="app/api/chat/route.ts"
					code={`import { promptx } from "@/lib/promptx";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, chatId } = await req.json();

  const prompt = await promptx.get("chat-assistant", {
    sessionId: chatId,
  });

  const completion = await openai.chat.completions.create({
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
  });

  return NextResponse.json({
    reply: completion.choices[0].message.content,
  });
}`}
				/>

				<Callout type="tip" className="mt-4">
					Pass a stable identifier such as the current chat ID when using A/B testing or traffic allocation.
				</Callout>
			</DocSection>

			<DocDivider />

			<DocSection id="server-actions" label="Actions" title="Server Actions">
				<DocParagraph>PromptX can also be used directly inside Server Actions.</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="typescript"
					filename="app/actions.ts"
					code={`"use server";

import { promptx } from "@/lib/promptx";

export async function generateReply(message: string) {
  const prompt = await promptx.get("chat-assistant");

  return openai.chat.completions.create({
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
  });
}`}
				/>
			</DocSection>

			<DocDivider />

			<DocSection id="edge-runtime" label="Edge" title="Edge Runtime">
				<DocParagraph>PromptX is fully compatible with the Next.js Edge Runtime.</DocParagraph>

				<CodeBlock
					className="mt-5"
					language="typescript"
					filename="app/api/chat/route.ts"
					code={`import { promptx } from "@/lib/promptx";

export const runtime = "edge";

export async function POST(req: Request) {
  const { message, chatId } = await req.json();

  const prompt = await promptx.get("chat-assistant", {
    sessionId: chatId,
  });

  // Call your model provider here.
}`}
				/>
			</DocSection>

			<DocDivider />
		</DocPageWrapper>
	);
}
