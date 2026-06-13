"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DocsSearchBar } from "./search/searchbar";

import { LoginIcon, MenuIcon } from "@/components/ui/icons";

import { useDocsNavigationStore } from "@/stores/docs-navigation-store";

export function DocsHeader() {
    const navigate = useDocsNavigationStore((state) => state.navigate);

    const leftSidebarOpen = useDocsNavigationStore((state) => state.leftSidebarOpen);

    return (
        <header className="fixed left-0 top-0 z-[100] w-full">
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-background/60 backdrop-blur-md"
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
                }}
            />

            <div className="relative h-14 lg:px-10">
                {/* Mobile Menu */}
                <div className="absolute left-4 top-1/2 z-20 -translate-y-1/2 lg:hidden">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                            navigate({
                                leftSidebarOpen: !leftSidebarOpen,
                            })
                        }
                    >
                        <MenuIcon />
                    </Button>
                </div>

                {/* Logo */}
                <div className="absolute left-14 top-1/2 z-10 flex -translate-y-1/2 items-center lg:left-10">
                    <Link
                        href="/"
                        className="flex items-center text-[14px] font-semibold uppercase tracking-[0.15em] text-foreground"
                    >
                        <span className="hidden sm:block">XEVOS AI</span>

                        <div className="relative size-10">
                            <Image
                                src="/logo.png"
                                alt="XEVOS AI"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>
                </div>

                <div className="absolute left-1/2 top-1/2 hidden h-8.5 w-[550px] -translate-x-1/2 -translate-y-1/2 lg:block">
                    <DocsSearchBar />
                </div>

                <div className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2 lg:right-10">
                    <div className="lg:hidden">
                        <DocsSearchBar mode="compact" />
                    </div>

                    <div className="">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="group relative overflow-hidden"
                        >
                            <Link href="/sign-in">
                                Sign In
                                <LoginIcon animate={false} className="h-10 w-10 shrink-0" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
