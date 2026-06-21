import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/layout";

export const metadata: Metadata = {
	title: "Status",
	description: "PromptX service status.",
};

export default function StatusPage() {
	return (
		<Page>
			<PageHeader title="Status" description="Service availability and incidents." />

			<Section>
				<p className="text-sm leading-relaxed text-muted-foreground">
					A live status page is coming soon. For incidents or urgent issues, email <strong>support@xevos.dev</strong>.
				</p>
			</Section>
		</Page>
	);
}
