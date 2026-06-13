import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
    return (
        <section className="px-8 py-20 md:px-16 md:py-28 lg:px-24">
            <div className="mx-auto max-w-5xl">
                <div className="h-px w-full bg-foreground/[0.06]" />

                <div className="py-16 md:py-20">
                    <h2
                        className="font-bold leading-[1.1] tracking-tight"
                        style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
                    >
                        Ready to take control of your prompts?
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                        Free for individual developers. No credit card required.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-2.5">
                        <Button asChild size="lg">
                            <Link href="/sign-in">Get Started</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/docs">Documentation</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
