import Link from "next/link";

const footerSections = [
    {
        title: "Product",
        links: [
            { label: "Docs", href: "/docs" },
            { label: "Pricing", href: "/pricing" },
            { label: "Changelog", href: "/changelog" },
            { label: "Roadmap", href: "/roadmap" },
            { label: "Status", href: "/status" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" },
            { label: "Press", href: "/press" },
            { label: "Partners", href: "/partners" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Security", href: "/security" },
            { label: "Cookies", href: "/cookies" },
            { label: "DPA", href: "/dpa" },
        ],
    },
];

export function LandingFooter() {
    return (
        <footer className="px-8 pb-10 pt-6 md:px-16 lg:px-24">
            <div className="mx-auto max-w-5xl">
                <div className="h-px w-full bg-foreground/[0.06]" />

                <div className="flex flex-col justify-between gap-10 pt-10 md:flex-row">
                    {/* Brand */}
                    <div>
                        <Link
                            href="/"
                            className=" text-[12px] font-semibold uppercase tracking-[0.15em] text-foreground"
                        >
                            XEVOS AI
                        </Link>
                        <p className="mt-2 text-[12px] text-muted-foreground">
                            Production-grade prompt management.
                        </p>
                    </div>

                    {/* Link columns */}
                    <div className="flex flex-wrap gap-12 md:gap-16">
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/30">
                                    {section.title}
                                </p>
                                <nav className="flex flex-col gap-2">
                                    {section.links.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="mt-10  text-[10px] uppercase tracking-[0.12em] text-foreground/20">
                    © {new Date().getFullYear()} XEVOS AI
                </p>
            </div>
        </footer>
    );
}
