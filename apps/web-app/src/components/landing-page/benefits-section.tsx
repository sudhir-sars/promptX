export function BenefitsSection() {
	return (
		<section className="px-8 py-20 md:px-16 md:py-28 lg:px-24">
			<div className="mx-auto max-w-5xl">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
					{[
						{
							title: "No more prompt drift",
							description: "Every change tracked. Every version recoverable. Never lose a working prompt again.",
						},
						{
							title: "Deploy without deploying",
							description: "Update prompts in production without touching your codebase. Zero downtime, zero risk.",
						},
						{
							title: "Built for AI teams",
							description: "From solo developers to enterprise. PromptX scales with your AI infrastructure.",
						},
					].map((item) => (
						<div key={item.title}>
							<p className=" text-[11px] uppercase tracking-[0.12em] text-foreground/70">{item.title}</p>
							<p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{item.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
