"use client";

import { ObservabilityIcon } from "@/components/ui/icons";

export default function AnalyticsPage() {
  return (
    <div className="h-full flex-1 space-y-7  overflow-y-auto no-scrollbar px-6 py-20 md:px-10 lg:px-16 transition-all duration-300 ease-in-out">
      <div>
        <h1 className="text-xl font-semibold">Analytics</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Monitor usage, performance, quality, and operational health.
        </p>
      </div>

      <section className="overflow-hidden rounded-3xl border">
        <div className="flex flex-col items-center px-8 py-16 text-center">
          <ObservabilityIcon size={56} animate={false} className="mb-6 text-muted-foreground" />

          <h2 className="text-2xl font-semibold tracking-tight">Coming Soon</h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Insights will help you understand how this prompt performs in production. Monitor
            adoption, latency, quality, deployments, and operational health from a single place.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Badge label="Usage Analytics" />
            <Badge label="Performance" />
            <Badge label="Reliability" />
            <Badge label="Evaluations" />
            <Badge label="Cost Tracking" />
            <Badge label="Deployments" />
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <FeatureCard
          title="Usage"
          description="Requests, token consumption, and adoption trends."
        />

        <FeatureCard
          title="Performance"
          description="Latency distributions, throughput, and response times."
        />

        <FeatureCard
          title="Quality"
          description="Prompt evaluations, regressions, and version comparisons."
        />
      </div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return <div className="rounded-full border px-3 py-1 text-xs text-muted-foreground">{label}</div>;
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border p-5">
      <h3 className="text-sm font-medium">{title}</h3>

      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
