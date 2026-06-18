import {
	Callout,
	DocDivider,
	DocH3,
	DocList,
	DocPageWrapper,
	DocParagraph,
	DocSection,
	InlineCode,
	PropTable,
} from "../doc-primitives";

export default function PromptVersioningContent() {
	return (
		<DocPageWrapper>
			<div>
				<h1 className="text-[22px] font-semibold tracking-tight text-foreground/90 md:text-[26px]">
					Prompt Versioning
				</h1>
				<DocParagraph className="mt-4 max-w-lg">
					Every save creates an immutable version. Every version is recoverable. No more prompt drift, no more guessing
					what changed.
				</DocParagraph>
			</div>

			<DocDivider />

			<DocSection id="how-it-works" label="Concepts" title="How versioning works">
				<DocParagraph>
					PromptX uses an append-only version model. When you save a version, the platform creates a complete, immutable
					snapshot of your prompt content. Versions are never modified after creation — you always create a new version
					instead of editing an existing one.
				</DocParagraph>

				<div className="mt-5 flex flex-col gap-4">
					<div>
						<DocH3>Version identity</DocH3>
						<DocParagraph className="mt-2">
							Each version has a monotonically increasing integer ID (<InlineCode>v0</InlineCode>,{" "}
							<InlineCode>v1</InlineCode>, <InlineCode>v2</InlineCode>…) and an optional human-readable tag (for
							example, <InlineCode>production</InlineCode>, <InlineCode>preview</InlineCode>, or{" "}
							<InlineCode>experiment-a</InlineCode>). The integer is assigned automatically. Tags are optional but
							strongly recommended.
						</DocParagraph>
					</div>

					<div>
						<DocH3>Immutability</DocH3>
						<DocParagraph className="mt-2">
							Once saved, a version&apos;s content cannot be changed. This guarantees full auditability, you can always
							trace back to the exact prompt content running in production at any point in time.
						</DocParagraph>
					</div>

					<div>
						<DocH3>Draft state</DocH3>
						<DocParagraph className="mt-2">
							The Prompt Studio always operates on a draft. Drafts are mutable — you can edit them freely. Saving a
							version promotes the current draft to an immutable version and creates a new draft based on it.
						</DocParagraph>
					</div>
				</div>
			</DocSection>

			<DocDivider />

			<DocSection id="version-states" label="Lifecycle" title="Version states">
				<DocParagraph>A version moves through a defined set of states throughout its lifecycle.</DocParagraph>
				<PropTable
					className="mt-5"
					columns={["State", "Description", "Mutable"]}
					rows={[
						["draft", "Active working copy in the Studio editor", "Yes"],
						["saved", "Immutable snapshot, not yet deployed", "No"],
						["deployed", "Actively serving traffic in one or more environments", "No"],
						["rolled-back", "Previously deployed, replaced by a newer version", "No"],
					]}
				/>
			</DocSection>

			<DocDivider />

			<DocSection id="creating-versions" label="Usage" title="Creating versions">
				<DocH3>From the Studio</DocH3>
				<DocParagraph className="mt-2">
					Edit your prompt in the Studio, then click &ldquo;Save Version&rdquo;. You&apos;ll be asked for an optional
					version tag. The version is created immediately and appears in the version timeline.
				</DocParagraph>
			</DocSection>

			<DocDivider />

			<DocSection id="comparing-versions" label="Diffing" title="Comparing versions">
				<DocParagraph>
					Every version comparison opens in diff mode by default. New versions are initially compared against the
					immediately preceding version, but you can switch the comparison target to any existing version in the
					prompt's history.
				</DocParagraph>

				<Callout type="tip" className="mt-4">
					Comparing against older versions is useful for reviewing long-term prompt evolution or validating changes
					before rolling back to a previous version.
				</Callout>
			</DocSection>

			<DocDivider />

			<DocSection id="restoring" label="Recovery" title="Restoring previous versions">
				<DocParagraph>
					Any version can be restored from the dashboard. Restoring creates a new version with the same content as the
					selected version while preserving all existing history.
				</DocParagraph>
			</DocSection>

			<DocDivider />

			<DocSection id="best-practices" label="Best practices" title="Version management tips">
				<DocList
					items={[
						'Tag every version. Tags like "Added discount handling" are infinitely more useful than v12 when scanning the timeline six months later.',
						"Write descriptions for non-trivial changes. Future you will thank present you when debugging a regression.",
						"Review diffs before deploying. A one-line change in a system prompt can dramatically alter behavior.",
					]}
				/>
			</DocSection>
		</DocPageWrapper>
	);
}
