"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/ui/icons";

/* ------------------------------------------------------------------ */
/*  DocPageWrapper — standard outer wrapper for all doc content pages  */
/* ------------------------------------------------------------------ */
export function DocPageWrapper({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={cn("flex flex-col gap-12", className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/*  DocSection                                                         */
/* ------------------------------------------------------------------ */
export function DocSection({
    label,
    title,
    children,
    className,
    id,
}: {
    label?: string;
    title?: string;
    children: React.ReactNode;
    className?: string;
    id?: string;
}) {
    return (
        <section id={id} className={cn("scroll-mt-20", className)}>
            {label && (
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/30">
                    {label}
                </p>
            )}
            {title && (
                <h2 className="text-[18px] font-semibold leading-tight tracking-tight text-foreground/90 md:text-[21px]">
                    {title}
                </h2>
            )}
            <div className={cn(title && "mt-4")}>{children}</div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  DocH3                                                              */
/* ------------------------------------------------------------------ */
export function DocH3({
    children,
    id,
    className,
}: {
    children: React.ReactNode;
    id?: string;
    className?: string;
}) {
    return (
        <h3
            id={id}
            className={cn(
                "scroll-mt-20 text-[13px] font-semibold tracking-tight text-foreground/80",
                className,
            )}
        >
            {children}
        </h3>
    );
}

/* ------------------------------------------------------------------ */
/*  DocParagraph                                                       */
/* ------------------------------------------------------------------ */
export function DocParagraph({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <p className={cn("text-[13px] leading-[1.75] text-muted-foreground", className)}>
            {children}
        </p>
    );
}

/* ------------------------------------------------------------------ */
/*  DocDivider                                                         */
/* ------------------------------------------------------------------ */
export function DocDivider({ className }: { className?: string }) {
    return <div className={cn("h-px  w-full bg-border rounded-full", className)} />;
}

/* ------------------------------------------------------------------ */
/*  CodeBlock                                                          */
/* ------------------------------------------------------------------ */

export function CodeBlock({
    code,
    language,
    filename,
    className,
}: {
    code: string;
    language?: string;
    filename?: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const hasHeader = language || filename;

    return (
        <div
            className={cn("overflow-hidden rounded-4xl border border-foreground/[0.06]", className)}
        >
            <div className="flex items-center justify-between border-foreground/[0.06] px-4 py-2">
                <div className="flex items-center gap-2.5">
                    {filename && (
                        <span className="font-mono  p-0.5 px-2 rounded-full bg-border text-[11px] text-foreground/80">
                            {filename}
                        </span>
                    )}

                    {language && !filename && (
                        <span className=" font-mono capitalize text-[11px] p-0.5 px-2 rounded-full bg-border text-foreground/80">
                            {language}
                        </span>
                    )}

                    {!hasHeader && <span className="text-[10px] text-foreground/20">code</span>}
                </div>

                <button
                    onClick={handleCopy}
                    aria-label="Copy code"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/25 transition-colors hover:bg-foreground/[0.03] hover:text-foreground/60"
                >
                    {copied ? (
                        <CheckIcon className="size-3.5 " />
                    ) : (
                        <CopyIcon className="size-3.5" />
                    )}
                </button>
            </div>

            <pre className="overflow-x-auto p-5">
                <code className="font-mono text-[12px] leading-[1.75] text-foreground/65">
                    {code}
                </code>
            </pre>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  TerminalBlock                                                      */
/* ------------------------------------------------------------------ */

export function TerminalBlock({
    commands,
    className,
}: {
    commands: string | string[];
    className?: string;
}) {
    const lines = Array.isArray(commands) ? commands : [commands];
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(lines.join("\n"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-full border border-foreground/[0.06] bg-foreground/[0.02]",
                className,
            )}
        >
            <button
                onClick={handleCopy}
                className="absolute right-1 top-1  z-10 flex h-8 w-8 items-center justify-center rounded-full text-foreground/30 transition-all hover:bg-foreground/[0.04] hover:text-foreground/60"
                aria-label="Copy command"
            >
                {copied ? <CheckIcon className="h-4 w-4 " /> : <CopyIcon className="h-4 w-4" />}
            </button>

            <pre className="overflow-x-auto p-2 px-4">
                <code className="font-mono text-[14px] leading-[1.75] text-foreground/55">
                    {lines.map((l) => `$ ${l}`).join("\n")}
                </code>
            </pre>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  InlineCode                                                         */
/* ------------------------------------------------------------------ */
export function InlineCode({ children }: { children: React.ReactNode }) {
    return (
        <code className="rounded-full border border-foreground/[0.08] bg-foreground/[0.03] px-2 py-0.5 font-mono text-[11.5px] text-foreground/65">
            {children}
        </code>
    );
}

/* ------------------------------------------------------------------ */
/*  Callout — monochromatic, opacity-based differentiation            */
/* ------------------------------------------------------------------ */
const calloutStyles = {
    note: {
        label: "Note",
        labelColor: "text-foreground/35",
        bg: "bg-input/50",
    },
    tip: {
        label: "Tip",
        labelColor: "text-foreground/45",
        bg: "bg-input/50",
    },
    warning: {
        label: "Warning",
        labelColor: "text-foreground/55",
        bg: "bg-orange-500/30",
    },
    danger: {
        label: "Danger",
        labelColor: "text-foreground/65",
        bg: "bg-red-500/20",
    },
};

export function Callout({
    type = "note",
    title,
    children,
    className,
}: {
    type?: keyof typeof calloutStyles;
    title?: string;
    children: React.ReactNode;
    className?: string;
}) {
    const style = calloutStyles[type];

    return (
        <div className={cn("rounded-4xl px-6 py-3", style.bg, className)}>
            <p className="text-[13px] leading-[1.7] text-muted-foreground">{children}</p>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  PropTable                                                          */
/* ------------------------------------------------------------------ */
export function PropTable({
    columns,
    rows,
    className,
}: {
    columns: string[];
    rows: (string | React.ReactNode)[][];
    className?: string;
}) {
    return (
        <div
            className={cn("overflow-x-auto rounded-2xl border border-foreground/[0.06]", className)}
        >
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-foreground/[0.06]">
                        {columns.map((col) => (
                            <th
                                key={col}
                                className="px-5 py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/35"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-b border-foreground/[0.04] last:border-b-0">
                            {row.map((cell, j) => (
                                <td
                                    key={j}
                                    className={cn(
                                        "px-5 py-3 text-[11.5px] text-foreground/60",
                                        typeof cell === "string" &&
                                            !cell.includes(" ") &&
                                            cell.length < 40
                                            ? "font-mono"
                                            : "",
                                    )}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  StepList                                                           */
/* ------------------------------------------------------------------ */
export function StepList({
    steps,
    className,
}: {
    steps: { title: string; content: React.ReactNode }[];
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col", className)}>
            {steps.map((step, i) => (
                <div key={i} className="relative flex gap-5 pb-9 last:pb-0">
                    {i < steps.length - 1 && (
                        <div className="absolute left-[15px] top-[30px] bottom-0 w-px bg-foreground/[0.06]" />
                    )}
                    <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-foreground/[0.1] text-[10px] font-medium text-foreground/45">
                        {i + 1}
                    </div>
                    <div className="min-w-0 flex-1 pt-[5px]">
                        <p className="text-[13px] font-medium text-foreground/80">{step.title}</p>
                        <div className="mt-2 text-[13px] leading-[1.7] text-muted-foreground">
                            {step.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  DocList                                                            */
/* ------------------------------------------------------------------ */
export function DocList({
    items,
    className,
}: {
    items: (string | React.ReactNode)[];
    className?: string;
}) {
    return (
        <ul className={cn("flex flex-col gap-2.5", className)}>
            {items.map((item, i) => (
                <li
                    key={i}
                    className="flex items-start gap-3 text-[13px] leading-[1.7] text-muted-foreground"
                >
                    <span className="mt-[9px] size-[5px] shrink-0 rounded-full bg-foreground/20" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

/* ------------------------------------------------------------------ */
/*  DocGrid                                                            */
/* ------------------------------------------------------------------ */
export function DocGrid({
    children,
    cols = 2,
    className,
}: {
    children: React.ReactNode;
    cols?: 2 | 3;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "grid gap-3",
                cols === 2 && "grid-cols-1 md:grid-cols-2",
                cols === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                className,
            )}
        >
            {children}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  DocCard                                                            */
/* ------------------------------------------------------------------ */
export function DocCard({
    title,
    description,
    href,
    className,
}: {
    title: string;
    description?: string;
    href?: string;
    className?: string;
}) {
    const content = (
        <>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/65">
                {title}
            </p>
            {description && (
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                    {description}
                </p>
            )}
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                className={cn(
                    "group block rounded-4xl border border-foreground/[0.06] p-5 transition-colors hover:border-foreground/[0.12] hover:bg-foreground/[0.02]",
                    className,
                )}
            >
                {content}
            </a>
        );
    }

    return (
        <div className={cn("rounded-2xl border border-foreground/[0.06] p-5", className)}>
            {content}
        </div>
    );
}
