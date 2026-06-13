import { DocPageWrapper, DocParagraph, Callout } from "../doc-primitives";

export default function GoContent() {
    return (
        <DocPageWrapper>
            <div>
                <h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">
                    Go
                </h1>

                <DocParagraph className="mt-4 max-w-lg">
                    Native Go support is currently in development.
                </DocParagraph>

                <Callout type="note" className="mt-8">
                    The PromptX Go SDK is coming soon. Join the waitlist or follow releases for
                    updates.
                </Callout>

                <DocParagraph className="mt-8 max-w-lg">
                    In the meantime, you can integrate with PromptX using the REST API from any Go
                    application.
                </DocParagraph>
            </div>
        </DocPageWrapper>
    );
}
