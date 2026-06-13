import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-8 md:px-16 lg:px-24"
      style={{
        backgroundImage: "radial-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <span
        aria-hidden
        className="
          pointer-events-none
          absolute
          right-[-2%]
          top-1/2
          -translate-y-1/2
          select-none
          whitespace-nowrap
          font-black
          leading-none
          tracking-tighter
          text-foreground/10
          z-0
        "
        style={{
          fontSize: "clamp(120px, 22vw, 300px)",
        }}
      >
        XEVOS
      </span>

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-gradient-to-r
          from-background
          via-background/90
          via-15%
          to-transparent
        "
      />
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[2]
          bg-gradient-to-b
          from-background/20
          via-transparent
          to-background/10
        "
      />

      {/* Content */}
      <div className="relative z-10 max-w-xl">
        <div className="mb-7 flex items-center gap-3">
          <div className="h-px w-10 bg-foreground/25" />

          <p className=" text-[10px] font-mono font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Prompt management platform
          </p>
        </div>

        <h1 className="font-bold leading-[1.05] tracking-tight text-[28px] md:text-[45px] text-foreground/90">
          Your Agents are only
          <br />
          as good as the prompts
          <br />
          <span>running it.</span>
        </h1>

        <p className="mt-5 max-w-sm text-xs md:text-sm leading-relaxed text-muted-foreground">
          Version, control, rollouts, and one-click rollback for every prompt in production — no
          code deploys required.
        </p>

        <div className="mt-10 flex flex-wrap gap-2.5">
          <Button asChild size="lg">
            <Link href="/sign-in">Get Started</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/docs">Documentation</Link>
          </Button>
        </div>

        <p className="mt-6  text-[10px] uppercase tracking-[0.12em] text-foreground/20">
          Free for individuals · No credit card
        </p>
      </div>
    </section>
  );
}
