"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled
          ? "top-0  bg-background/80 backdrop-blur-md"
          : "top-5 bg-transparent border-transparent",
      )}
    >
      <div className="mx-auto flex h-14 items-center justify-between px-8 md:px-16 lg:px-24">
        <Link
          href="/"
          className="text-[14px] flex items-center  font-semibold uppercase tracking-[0.15em] text-foreground"
        >
          XEVOS AI
          <div className="relative size-10">
            <Image src="/logo.png" alt="XEVOS AI" fill className="object-contain" />
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Agents", href: "/agents" },
            { label: "Foundry", href: "/foundry" },
            { label: "Docs", href: "/docs" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" asChild size="sm">
            <Link href="/sign-in">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
