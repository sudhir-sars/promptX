"use client";

import { ActivityIcon } from "@/components/ui/icons";

export default function ActivityPage() {
  return (
    <div className="h-full flex-1 space-y-7 overflow-y-auto no-scrollbar px-6 py-20 md:px-10 lg:px-16 transition-all duration-300 ease-in-out">
      <div>
        <h1 className="text-xl font-semibold">Activity</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Track deployments, version changes, rollbacks, and team activity.
        </p>
      </div>

      <section className="overflow-hidden rounded-4xl border">
        <div className="flex flex-col items-center px-8 py-16 text-center">
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border">
            <ActivityIcon className="size-7 text-muted-foreground" />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Coming Soon</h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Follow deployments, prompt updates, rollbacks, member actions, and workspace events
            through a unified activity timeline.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Badge label="Deployments" />
            <Badge label="Rollbacks" />
            <Badge label="Versions" />
            <Badge label="Publishing" />
            <Badge label="Members" />
            <Badge label="Audit Logs" />
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <FeatureCard
          title="Deployments"
          description="Track releases, traffic changes, and deployment history."
        />

        <FeatureCard
          title="Version History"
          description="Monitor prompt updates and publishing activity."
        />

        <FeatureCard
          title="Team Activity"
          description="View member actions, invitations, and access changes."
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
