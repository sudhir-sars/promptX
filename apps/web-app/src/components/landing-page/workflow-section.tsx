"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  ChevronLeftIcon,
  DeployIcon,
  ObservabilityIcon,
  SettingsIcon,
  StudioIcon,
  VersionsIcon,
} from "../ui/icons";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const versions = [
  {
    label: "Draft",
    sub: "Just now",
    isDraft: true,
    isSelected: true,
    isDeployed: false,
  },
  {
    label: "Tool Routing",
    sub: "2 hours ago",
    isDraft: false,
    isSelected: false,
    isDeployed: true,
  },
  {
    label: "Memory Upgrade",
    sub: "Yesterday",
    isDraft: false,
    isSelected: false,
    isDeployed: true,
  },
  {
    label: "Response Compression",
    sub: "3 days ago",
    isDraft: false,
    isSelected: false,
    isDeployed: false,
  },
  {
    label: "Reasoning Tune",
    sub: "5 days ago",
    isDraft: false,
    isSelected: false,
    isDeployed: false,
  },
  {
    label: "Context Expansion",
    sub: "1 week ago",
    isDraft: false,
    isSelected: false,
    isDeployed: false,
  },
  {
    label: "Safety Alignment",
    sub: "10 days ago",
    isDraft: false,
    isSelected: false,
    isDeployed: false,
  },
  {
    label: "Workflow Optimization",
    sub: "2 weeks ago",
    isDraft: false,
    isSelected: false,
    isDeployed: false,
  },
  {
    label: "Agent Memory",
    sub: "18 days ago",
    isDraft: false,
    isSelected: false,
    isDeployed: false,
  },
  {
    label: "Intent Detection",
    sub: "3 weeks ago",
    isDraft: false,
    isSelected: false,
    isDeployed: false,
  },
  {
    label: "Prompt Refactor",
    sub: "1 month ago",
    isDraft: false,
    isSelected: false,
    isDeployed: false,
  },
  {
    label: "Inference Tuning",
    sub: "5 weeks ago",
    isDraft: false,
    isSelected: false,
    isDeployed: false,
  },
  {
    label: "Fallback Logic",
    sub: "6 weeks ago",
    isDraft: false,
    isSelected: false,
    isDeployed: false,
  },
  {
    label: "Knowledge Refresh",
    sub: "2 months ago",
    isDraft: false,
    isSelected: false,
    isDeployed: false,
  },
  {
    label: "Foundation",
    sub: "3 months ago",
    isDraft: false,
    isSelected: false,
    isDeployed: false,
  },
];

export function ProductShowcase() {
  const [prompt, setPrompt] = useState(
    `You are a helpful checkout assistant. Guide the user through their purchase step by step.

Be concise and friendly. Always suggest related products when the cart value is under $50.

Respond in the same language as the user. Keep responses under 3 sentences.

Additional instructions:
- Always confirm the shipping address before finalizing.
- Offer promo codes if the user mentions discounts.
- Ask for feedback after successful checkout to improve future interactions.`,
  );

  const handleAction = () => {
    toast("Let's gooo  🎉🎉🎉", {
      description: "Create an account and you'll be ready to go in seconds.",
      action: {
        label: "Get Started",
        onClick: () => (window.location.href = "/sign-in"),
      },
      position: "top-right",
      duration: 5000,
    });
  };

  return (
    <section className="px-4 py-12 sm:px-6 md:px-12 md:py-20 lg:px-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex min-h-[600px] lg:h-[640px] flex-col overflow-hidden rounded-[32px] border">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-10">
            <div className="flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-xs">
              Foundry Lab
              <ChevronLeftIcon className="rotate-180 pr-2" size={13} />
            </div>

            <div className="order-3 w-full md:order-none md:flex md:flex-1 md:justify-center">
              <Input
                placeholder="Search anything..."
                className="h-8 w-full md:w-[420px] lg:w-[500px] rounded-full border px-4 text-xs! placeholder:text-center placeholder:text-[11px]"
              />
            </div>

            <div className="ml-auto hidden md:block w-[52px]" />
          </div>

          {/* Main */}
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden">
            {/* Sidebar */}
            <div className="relative hidden lg:flex w-[230px] shrink-0 flex-col px-6 py-7">
              <div className="absolute right-0 top-[20%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-foreground/[0.06] to-transparent" />

              <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[11.5px] text-muted-foreground">
                <ChevronLeftIcon animate={false} />
                Prompts
              </div>

              <div className="flex flex-1 flex-col justify-center gap-1">
                {[
                  { label: "Studio", active: true, icon: StudioIcon },
                  { label: "Versions", active: false, icon: VersionsIcon },
                  { label: "Deployments", active: false, icon: DeployIcon },
                  {
                    label: "Observability",
                    active: false,
                    icon: ObservabilityIcon,
                  },
                  { label: "Settings", active: false, icon: SettingsIcon },
                ].map((item) => (
                  <Button
                    key={item.label}
                    variant={item.active ? "outline" : "ghost"}
                    className={`h-auto rounded-full border px-4 py-2 text-[11.5px] transition-all flex items-center justify-start gap-2 ${
                      item.active
                        ? "border-foreground/[0.08] bg-input/50! text-foreground"
                        : "border-transparent text-muted-foreground hover:bg-input/50!"
                    }`}
                    onClick={() => handleAction()}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </Button>
                ))}
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-3 rounded-full border border-foreground/[0.08] bg-foreground/[0.03] px-2 py-1">
                  <div className="flex size-7 items-center justify-center rounded-full bg-background text-[9px] font-semibold">
                    XE
                  </div>

                  <div>
                    <p className="text-[10px] font-medium text-foreground">Xevos AI</p>
                    <p className="text-[9px] text-muted-foreground">Pro plan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Studio */}
            <div className="min-w-0 flex-1 overflow-hidden px-4 py-6 sm:px-8 lg:px-12 lg:py-9">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-[16px] font-semibold text-foreground">checkout-assistant</h2>

                  <p className="mt-1.5 text-[11px] text-muted-foreground">Draft · Saved just now</p>
                </div>

                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    className="h-7 rounded-full border border-foreground/[0.08] px-3.5 text-[11px] text-muted-foreground hover:bg-foreground/[0.03]"
                    onClick={() => handleAction()}
                  >
                    Save Version
                  </Button>

                  <Button
                    className="h-7 rounded-full border border-foreground/[0.08] px-3.5 text-[11px]"
                    onClick={() => handleAction()}
                  >
                    Deploy <DeployIcon size={12} className="ml-1" />
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border-foreground/[0.06] p-1">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[320px] h-[50vh] lg:h-[440px] no-scrollbar rounded-4xl p-6 text-xs!"
                  placeholder="Write your system prompt here..."
                />
              </div>

              {/* Mobile Versions */}
              <div className="mt-6 xl:hidden">
                <div className="mb-3 text-xs font-medium text-muted-foreground">Versions</div>

                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {versions.map((item, index) => (
                    <div
                      key={item.label}
                      className="min-w-[170px] rounded-2xl border border-foreground/[0.08] p-4"
                    >
                      <p
                        className={`text-xs ${
                          item.isSelected ? "font-medium text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </p>

                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {item.sub} · v{index}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Versions */}
            <div
              className="relative hidden xl:block w-[240px] shrink-0 overflow-hidden px-8 py-8"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
              }}
            >
              <div className="absolute left-0 top-[5%] bottom-[5%] w-px bg-gradient-to-b from-transparent via-foreground/[0.06] to-transparent" />

              <div className="relative h-full overflow-y-auto no-scrollbar pr-2">
                <div className="absolute left-[9px] top-0 h-full w-px bg-gradient-to-b from-foreground/[0.08] via-foreground/[0.08] to-transparent" />

                <div className="space-y-7">
                  {versions.map((item, index) => (
                    <div key={item.label} className="relative flex items-start pl-8">
                      <div
                        className={[
                          "absolute left-[4.5px] top-[5px] h-[11px] w-[11px]",
                          item.isDraft
                            ? item.isSelected
                              ? "rotate-45 border border-foreground bg-foreground"
                              : "rotate-45 border border-foreground bg-background"
                            : "",
                          item.isDeployed ? "animate-pulse rounded-full border bg-blue-500/70" : "",
                          !item.isDraft &&
                            !item.isDeployed &&
                            "rounded-full border border-foreground/15 bg-transparent",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />

                      <div>
                        <p
                          className={`text-[12px] ${
                            item.isSelected
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.label}
                        </p>

                        <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                          {item.sub} · v{index}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
