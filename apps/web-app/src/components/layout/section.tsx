import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionProps {
	children: ReactNode;
	className?: string;
}

export function Section({ children, className }: SectionProps) {
	return <section className={cn("space-y-2 rounded-4xl border p-5", className)}>{children}</section>;
}
