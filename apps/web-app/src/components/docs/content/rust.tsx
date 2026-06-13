import { Callout, DocPageWrapper, DocParagraph } from "../doc-primitives";

export default function RustContent() {
  return (
    <DocPageWrapper>
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">
          Rust
        </h1>

        <DocParagraph className="mt-4 max-w-lg">
          Native Rust support is currently in development.
        </DocParagraph>

        <Callout type="note" className="mt-8">
          The PromptX Rust SDK is coming soon. Follow releases for updates.
        </Callout>

        <DocParagraph className="mt-8 max-w-lg">
          In the meantime, you can integrate with PromptX using the REST API from any Rust
          application.
        </DocParagraph>
      </div>
    </DocPageWrapper>
  );
}
