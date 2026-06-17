// components/ui/access-gate.tsx

"use client";
import { BiShieldQuarter } from "react-icons/bi";

type AccessGateVariant = "invite";

interface AccessGateProps {
	variant?: AccessGateVariant;
}

interface AccessGateConfig {
	title: string;
	description: string;
	icon: React.ComponentType<{
		size?: number;
		strokeWidth?: number;
		className?: string;
		animate?: boolean;
	}>;
}

const ACCESS_GATE_CONFIG: Record<AccessGateVariant, AccessGateConfig> = {
	invite: {
		title: "Access restricted",
		description: "You must be invited to this team before you can view this page.",
		icon: BiShieldQuarter,
	},
};

export function AccessGate({ variant = "invite" }: AccessGateProps) {
	const config = ACCESS_GATE_CONFIG[variant];
	const Icon = config.icon;

	return (
		<div className="flex h-full w-full items-center justify-center px-6">
			<div className="flex max-w-sm flex-col items-center text-center">
				<div className="flex size-14 items-center justify-center">
					<Icon animate={false} size={32} className="size-10 text-muted-foreground" />
				</div>

				<h2 className="mt-5 text-base font-medium">{config.title}</h2>

				<p className="mt-2 text-sm leading-6 text-muted-foreground">{config.description}</p>
			</div>
		</div>
	);
}
