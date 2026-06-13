"use client";

import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const { signIn } = useSignIn();
  const [loading, setLoading] = useState(false);

  const signInWith = async () => {
    if (!signIn) return;

    try {
      setLoading(true);

      const { error } = await signIn.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: "/home",
      });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-background"
      style={{
        backgroundImage: "radial-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute right-[-5%] top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-black tracking-tighter text-foreground/[0.04]"
        style={{
          fontSize: "clamp(140px,24vw,360px)",
        }}
      >
        XEVOS
      </span>

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/75" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        {/* LEFT */}

        <div className="hidden lg:flex flex-col justify-center px-16 xl:px-24">
          <Link
            href="/"
            className="mb-10 flex items-center text-[14px] font-semibold uppercase tracking-[0.15em]"
          >
            XEVOS AI
            <div className="relative ml-2 size-10">
              <Image src="/logo.png" alt="XEVOS" fill className="object-contain" />
            </div>
          </Link>

          <div className="max-w-xl">
            <div className="mb-7 flex items-center gap-3">
              <div className="h-px w-10 bg-foreground/25" />

              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Prompt Infrastructure Platform
              </p>
            </div>

            <h1 className="text-4xl font-bold leading-[1.02] tracking-tight">
              Your agents are only
              <br />
              as good as the prompts
              <br />
              running them.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Version prompts, manage deployments, monitor production and rollback instantly without
              redeploying code.
            </p>

            <div className="mt-14 space-y-6">
              {["Immutable version history", "One-click rollbacks", "Production observability"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-4 text-sm">
                    <div className="h-px w-8 bg-foreground/15" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-md">
            <div className="rounded-[36px] border border-foreground/[0.08] bg-background/80 p-8 backdrop-blur-sm">
              <div className="mb-10">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Authentication
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight">Continue to XEVOS</h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in with Google to access your workspace.
                </p>
              </div>

              <Button
                variant={"outline"}
                onClick={() => signInWith()}
                disabled={loading}
                className="h-12 w-full rounded-full"
              >
                {loading ? "Redirecting..." : "Continue with Google"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
