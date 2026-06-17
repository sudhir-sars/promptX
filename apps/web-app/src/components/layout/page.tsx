import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageProps {
	children: ReactNode;
	className?: string;
}

export function Page({ children, className }: PageProps) {
	return (
		<div
			className={cn(
				"h-full flex-1 overflow-y-auto px-6 py-20 transition-all duration-300 ease-in-out no-scrollbar md:px-10 lg:px-16",
				className,
			)}
		>
			<div className="mx-auto space-y-4 h-full max-w-5xl">{children}</div>
		</div>
	);
}
