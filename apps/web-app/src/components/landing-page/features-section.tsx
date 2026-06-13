const features = [
  {
    title: "Prompt Studio",
    description: "A workspace for editing and organizing prompts.",
  },

  {
    title: "Version Control",
    description: "Immutable version history with complete traceability for every prompt change.",
  },
  {
    title: "Deployments",
    description: "Gradual rollouts with traffic splitting and one-click rollback.",
  },
  {
    title: "Observability",
    description: "Understand how prompts perform in production with real-time insights.",
  },
  {
    title: "SDK",
    description: "Integrate deployed prompts into your application with minimal setup.",
  },
  {
    title: "Teams",
    description:
      "Collaborate across shared workspaces with roles, permissions, and activity history.",
  },
  {
    title: "Evaluations",
    description:
      "Measure prompt quality with automated testing, scoring, and performance analysis.",
  },
  {
    title: "Metrics",
    description: "Bring your own success metrics and monitor them alongside prompt performance.",
  },
  {
    title: "Intelligence",
    description: "Surface actionable insights from production usage, outcomes, and user behavior.",
  },
];

export function FeaturesSection() {
  return (
    <section className="px-8 py-20 md:px-16 md:py-28 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6  text-[10px] uppercase tracking-[0.15em] text-foreground/70">
          What you get
        </p>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[32px] border border-foreground/[0.08] sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="border-b border-r hover:bg-input/50 border-foreground/[0.06] p-8 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+2)]:border-b lg:[&:nth-last-child(-n+3)]:border-b-0"
            >
              <p className=" text-[11px] uppercase tracking-[0.12em] text-foreground/70">
                {feature.title}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
