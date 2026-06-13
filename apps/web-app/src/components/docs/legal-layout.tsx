"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  LegalLayout — shared shell for legal / policy pages                */
/* ------------------------------------------------------------------ */
export function LegalLayout({
    title,
    subtitle,
    lastUpdated,
    ghost,
    children,
}: {
    title: string;
    subtitle: string;
    lastUpdated: string;
    ghost: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className="relative min-h-[100svh]"
            style={{
                backgroundImage:
                    "radial-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
            }}
        >
            {/* Ghost watermark */}
            <span
                aria-hidden
                className="pointer-events-none fixed right-[-2%] top-1/2 -translate-y-1/2 select-none font-black uppercase leading-none tracking-tighter text-foreground/[0.03]"
                style={{ fontSize: "clamp(100px, 18vw, 240px)" }}
            >
                {ghost}
            </span>

            <div className="relative z-10 mx-auto max-w-3xl px-8 pb-24 pt-20 md:px-16 lg:px-8">
                {/* Header */}
                <div className="mb-5 flex items-center gap-3">
                    <div className="h-px w-8 bg-foreground/20" />
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Legal
                    </p>
                </div>

                <h1
                    className="font-bold leading-[1.1] tracking-tight"
                    style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
                >
                    {title}
                </h1>

                <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">{subtitle}</p>

                <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-foreground/25">
                    Last updated — {lastUpdated}
                </p>

                {/* Content */}
                <div className="mt-14 flex flex-col gap-10">{children}</div>

                {/* Footer nav */}
                <div className="mt-20">
                    <div className="h-px w-full bg-foreground/[0.06]" />
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Button asChild variant="outline">
                            <Link href="/">
                                <HomeIcon className="mr-1.5 size-3.5" />
                                Go home
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/docs/getting-started">Documentation</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  LegalSection — numbered section within a legal page                */
/* ------------------------------------------------------------------ */
export function LegalSection({
    number,
    title,
    children,
    id,
}: {
    number: string;
    title: string;
    children: React.ReactNode;
    id?: string;
}) {
    return (
        <section id={id} className="scroll-mt-24">
            <div className="mb-3 flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-lg border border-foreground/[0.08] font-mono text-[10px] text-foreground/40">
                    {number}
                </span>
                <h2 className="text-[15px] font-semibold tracking-tight text-foreground/85">
                    {title}
                </h2>
            </div>
            <div className="pl-10 text-[13px] leading-[1.8] text-muted-foreground [&>p+p]:mt-3">
                {children}
            </div>
        </section>
    );
}
