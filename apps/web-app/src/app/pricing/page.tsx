import Link from "next/link";
import { Button } from "@/components/ui/button";

const tiers = [
	{
		name: "Free",
		price: "$0",
		period: "forever",
		description: "For individual developers exploring prompt management.",
		features: [
			"1 project",
			"50 prompts",
			"Unlimited versions",
			"Community support",
			"1 environment",
			"1,000 API calls / month",
		],
		cta: "Get Started",
		ctaVariant: "outline" as const,
		highlight: false,
	},
	{
		name: "Pro",
		price: "$49",
		period: "/ month",
		description: "For teams shipping AI products to production.",
		features: [
			"Unlimited projects",
			"Unlimited prompts",
			"Unlimited versions",
			"Priority support",
			"5 environments",
			"100,000 API calls / month",
			"Traffic splitting",
			"Team collaboration (5 seats)",
			"Audit logs",
			"Observability dashboard",
		],
		cta: "Start Free Trial",
		ctaVariant: "default" as const,
		highlight: true,
	},
	{
		name: "Enterprise",
		price: "Custom",
		period: "",
		description: "For organizations with advanced security and scale requirements.",
		features: [
			"Everything in Pro",
			"Unlimited seats",
			"Unlimited API calls",
			"Unlimited environments",
			"SSO / SAML",
			"Custom SLA (99.99%)",
			"Dedicated support engineer",
			"Data residency options",
			"DPA and BAA",
			"On-premise deployment option",
			"Custom integrations",
		],
		cta: "Contact Sales",
		ctaVariant: "outline" as const,
		highlight: false,
	},
];

const faq = [
	{
		q: "Can I switch plans at any time?",
		a: "Yes. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period. We prorate upgrades — you only pay the difference.",
	},
	{
		q: "What counts as an API call?",
		a: "Each call to promptx.get() counts as one API call. Cached responses (served from the SDK's in-memory cache) do not count. Version management operations (create, list, diff) are counted separately and have generous limits on all plans.",
	},
	{
		q: "Do you offer annual billing?",
		a: "Yes. Annual billing saves 20%. Contact sales@xevos.ai for annual pricing on Pro and Enterprise plans.",
	},
	{
		q: "What happens if I exceed my API call limit?",
		a: "We don't cut off your service. You'll receive a notification at 80% and 100% usage. If you consistently exceed your limit, we'll reach out to discuss upgrading. We never want rate limits to break your production application.",
	},
	{
		q: "Is there a free trial for Pro?",
		a: "Yes. Pro comes with a 14-day free trial, no credit card required. You'll get a reminder before the trial ends.",
	},
];

export default function PricingPage() {
	return (
		<div
			className="relative min-h-[100svh]"
			style={{
				backgroundImage: "radial-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px)",
				backgroundSize: "22px 22px",
			}}
		>
			<span
				aria-hidden
				className="pointer-events-none fixed right-[-2%] top-1/2 -translate-y-1/2 select-none font-black uppercase leading-none tracking-tighter text-foreground/[0.03]"
				style={{ fontSize: "clamp(100px, 18vw, 240px)" }}
			>
				PRICING
			</span>

			<div className="relative z-10 mx-auto max-w-5xl px-8 pb-24 pt-20 md:px-16 lg:px-8">
				<div className="mb-5 flex items-center gap-3">
					<div className="h-px w-8 bg-foreground/20" />
					<p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Plans</p>
				</div>

				<h1 className="font-bold leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
					Simple, predictable
					<br />
					pricing.
				</h1>

				<p className="mt-5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
					Free for individuals. Scaled pricing for teams. No hidden fees, no surprise overages.
				</p>

				{/* Tier cards */}
				<div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
					{tiers.map((tier) => (
						<div
							key={tier.name}
							className={`flex flex-col rounded-[24px] border p-7 ${
								tier.highlight ? "border-foreground/[0.15] bg-foreground/[0.02]" : "border-foreground/[0.06]"
							}`}
						>
							<p className="text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/50">{tier.name}</p>

							<div className="mt-4 flex items-baseline gap-1.5">
								<span className="text-[32px] font-bold tracking-tight text-foreground/90">{tier.price}</span>
								{tier.period && <span className="text-[12px] text-muted-foreground">{tier.period}</span>}
							</div>

							<p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">{tier.description}</p>

							<div className="my-6 h-px w-full bg-foreground/[0.06]" />

							<ul className="flex flex-1 flex-col gap-2.5">
								{tier.features.map((f) => (
									<li key={f} className="flex items-start gap-2.5 text-[12px] text-muted-foreground">
										<span className="mt-[6px] size-1 shrink-0 rounded-full bg-foreground/30" />
										{f}
									</li>
								))}
							</ul>

							<Button asChild variant={tier.ctaVariant} className="mt-8 w-full rounded-xl">
								<Link href={tier.name === "Enterprise" ? "/contact" : "/sign-in"}>{tier.cta}</Link>
							</Button>
						</div>
					))}
				</div>

				{/* FAQ */}
				<div className="mt-20">
					<p className="mb-8 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/30">
						Frequently asked
					</p>
					<div className="flex flex-col gap-px overflow-hidden rounded-[24px] border border-foreground/[0.06]">
						{faq.map((item) => (
							<div key={item.q} className="border-b border-foreground/[0.04] p-6 last:border-b-0">
								<p className="text-[13px] font-medium text-foreground/80">{item.q}</p>
								<p className="mt-2.5 text-[12.5px] leading-relaxed text-muted-foreground">{item.a}</p>
							</div>
						))}
					</div>
				</div>

				{/* Footer */}
				<div className="mt-16 border-t border-foreground/[0.06] pt-8">
					<p className="text-[13px] text-muted-foreground">
						Need a custom plan?{" "}
						<Link href="/contact" className="text-foreground/70 underline underline-offset-2">
							Talk to sales
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
