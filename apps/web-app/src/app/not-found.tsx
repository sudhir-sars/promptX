"use client";

import { ArrowLeftIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-8 md:px-16 lg:px-24">
			<span
				aria-hidden
				className="pointer-events-none absolute right-[-2%] top-1/2 -translate-y-1/2 select-none text-[clamp(180px,38vw,460px)] font-black leading-none tracking-tighter text-foreground/[0.04]"
			>
				404
			</span>

			<div className="relative z-10 max-w-md">
				<div className="mb-7 h-px w-10 bg-foreground/25" />

				<p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Error 404</p>

				<h1 className="mt-4 text-[clamp(2.5rem,6vw,3.75rem)] font-bold leading-[1.1] tracking-tight">
					Page not
					<br />
					found.
				</h1>

				<p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
					This page has been moved, deleted, or never existed. Check the URL or head back somewhere safe.
				</p>

				<div className="mt-9 flex flex-wrap gap-2.5">
					<Button
						variant="outline"
						size={"lg"}
						onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
						className="cursor-pointer"
					>
						<ArrowLeftIcon className="mr-1.5 size-3.5" />
						Go back
					</Button>

					<Button asChild size={"lg"}>
						<Link href="/">
							<HomeIcon className="mr-1.5 size-3.5" />
							Go home
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
