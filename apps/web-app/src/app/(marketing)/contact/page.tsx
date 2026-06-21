import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/layout";

export const metadata: Metadata = {
	title: "Contact",
	description: "Get in touch with the PromptX team.",
};

const channels = [
	{ label: "General & sales", email: "contact@xevos.dev" },
	{ label: "Product support", email: "support@xevos.dev" },
	{ label: "Privacy & legal", email: "contact@xevos.dev" },
];

export default function ContactPage() {
	return (
		<Page>
			<PageHeader title="Contact us" description="We’d love to hear from you." />

			{channels.map((channel) => (
				<Section key={channel.label}>
					<div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
						<p className="font-medium">{channel.label}</p>
						<a
							href={`mailto:${channel.email}`}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
						>
							{channel.email}
						</a>
					</div>
				</Section>
			))}
		</Page>
	);
}
