import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/layout";

export const metadata: Metadata = {
	title: "Security",
	description: "How PromptX protects your data.",
};

export default function SecurityPage() {
	return (
		<Page>
			<PageHeader title="Security" description="The practices we follow to keep your account and data safe." />

			<Section>
				<h2 className="font-medium">Data in transit</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					All traffic between your browser and PromptX is encrypted using TLS.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Authentication</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					Sign-in is handled by a dedicated authentication provider supporting modern protections such as multi-factor
					authentication and SSO/SAML on eligible plans. We never store your password.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">API keys</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					API keys are shown once at creation and stored only as a hashed value — we cannot recover the original. You can
					revoke a key at any time, which immediately invalidates it.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Access &amp; isolation</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					Access to data is scoped by team and role, following the principle of least privilege. We rely on reputable
					infrastructure providers to host the service.
				</p>
			</Section>

			<Section>
				<h2 className="font-medium">Reporting a vulnerability</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					If you believe you have found a security issue, please email <strong>contact@xevos.dev</strong> with details. We
					appreciate responsible disclosure and will respond as quickly as we can.
				</p>
			</Section>
		</Page>
	);
}
