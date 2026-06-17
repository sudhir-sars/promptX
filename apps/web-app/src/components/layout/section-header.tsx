import type { ReactNode } from "react";

interface SectionHeaderProps {
	title: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
	return (
		<div className="flex items-center justify-between gap-4">
			<div>
				<h2 className="font-medium">{title}</h2>

				{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
			</div>

			{action}
		</div>
	);
}
