export function SocialProof() {
	const metrics = [
		{ value: "10,000+", label: "prompts managed" },
		{ value: "99.9%", label: "uptime" },
		{ value: "< 50ms", label: "API latency" },
		{ value: "500+", label: "teams" },
		{ value: "100K+", label: "versions tracked" },
	];

	return (
		<section className="relative border-y border-border/50 py-20">
			<div className="mx-auto max-w-7xl px-6">
				<div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16 md:gap-x-20">
					{metrics.map((metric) => (
						<div key={metric.label} className="flex items-center gap-3 text-center">
							<span className=" text-[13px] font-semibold tracking-tight text-foreground">{metric.value}</span>
							<span className=" text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{metric.label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
