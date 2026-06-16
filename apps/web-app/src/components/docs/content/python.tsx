import { Callout, DocPageWrapper, DocParagraph } from "../doc-primitives";

export default function PythonContent() {
	return (
		<DocPageWrapper>
			<div>
				<h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">Python</h1>

				<DocParagraph className="mt-4 max-w-lg">Native Python support is currently in development.</DocParagraph>

				<Callout type="note" className="mt-8">
					The PromptX Python SDK is coming soon. Follow releases for updates.
				</Callout>

				<DocParagraph className="mt-8 max-w-lg">
					In the meantime, you can integrate with PromptX using the REST API from any Python application.
				</DocParagraph>
			</div>
		</DocPageWrapper>
	);
}
