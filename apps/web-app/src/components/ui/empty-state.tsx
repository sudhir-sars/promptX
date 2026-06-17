// components/ui/empty-state.tsx

"use client";

import { Button } from "@/components/ui/button";
import { PromptIcon, TeamIcon } from "@/components/ui/icons";

type EmptyStateVariant = "team" | "prompt" | "version" | "activity";
type EmptyStateMode = "default" | "compact";

interface EmptyStateProps {
	variant?: EmptyStateVariant;

	title?: string;
	description?: string;

	action?: () => void;
	actionLabel?: string;

	mode?: EmptyStateMode;
}

interface EmptyStateConfig {
	title: string;
	description: string;
	icon: React.ComponentType<{
		size?: number;
		strokeWidth?: number;
		className?: string;
		animate?: boolean;
	}>;
}

const EMPTY_STATE_CONFIG: Record<EmptyStateVariant, EmptyStateConfig> = {
	team: {
		title: "No teams yet",
		description: "Create your first team workspace to collaborate, organize prompts, and manage projects.",
		icon: TeamIcon,
	},

	prompt: {
		title: "No prompts yet",
		description: "Create your first prompt and start building AI workflows.",
		icon: PromptIcon,
	},

	version: {
		title: "No versions yet",
		description: "Versions will appear here as you save and iterate on your prompt.",
		icon: PromptIcon,
	},

	activity: {
		title: "No activity yet",
		description: "Recent activity, updates, and interactions will appear here as you work.",
		icon: PromptIcon,
	},
};
export function EmptyState({ variant, title, description, action, actionLabel, mode = "default" }: EmptyStateProps) {
	const config = variant ? EMPTY_STATE_CONFIG[variant] : undefined;

	const Icon = config?.icon ?? PromptIcon;

	const finalTitle = title ?? config?.title ?? "Nothing here yet";

	const finalDescription = description ?? config?.description ?? "No content available.";

	if (mode === "compact") {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-sm text-muted-foreground">{finalTitle}</p>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full items-center justify-center px-6">
			<div className="flex max-w-sm flex-col items-center text-center">
				<div className="flex size-14 items-center justify-center">
					<Icon animate={false} size={32} className="size-10 text-muted-foreground" />
				</div>

				<h2 className="mt-5 text-base font-medium">{finalTitle}</h2>

				<p className="mt-2 text-sm leading-6 text-muted-foreground">{finalDescription}</p>

				{action && (
					<Button variant="outline" className="mt-6 rounded-full px-10 text-xs" onClick={action}>
						{actionLabel ?? "Create"}
					</Button>
				)}
			</div>
		</div>
	);
}
