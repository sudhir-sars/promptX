"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { useTeams } from "@/hooks/use-team";

import { useTeamDialogStore } from "@/stores/team-dialog-store";

export function TeamDialog() {
	const { createTeam, updateTeam } = useTeams();

	const {
		isOpen,
		mode,
		teamId,

		name,

		setOpen,
		setName,

		reset,
	} = useTeamDialogStore();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		const trimmedName = name.trim();

		if (!trimmedName || isSubmitting) {
			return;
		}

		try {
			setIsSubmitting(true);

			if (mode === "create") {
				await createTeam({
					name: trimmedName,
				});
			} else {
				if (!teamId) return;

				await updateTeam({
					teamId,
					name: trimmedName,
				});
			}

			reset();

			setOpen(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		setOpen(open);

		if (!open) {
			reset();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="rounded-2xl shadow-2xl">
				<DialogHeader>
					<DialogTitle>{mode === "create" ? "Create Team" : "Edit Team"}</DialogTitle>

					<DialogDescription className="text-xs font-normal text-muted-foreground">
						{mode === "create" ? "Create a new team workspace" : "Update team information"}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3">
					<Input
						value={name}
						placeholder="Team name"
						onChange={(e) => setName(e.target.value)}
						className="rounded-full px-4 placeholder:text-xs"
					/>

					<Button
						variant="outline"
						onClick={handleSubmit}
						disabled={!name.trim() || isSubmitting}
						className="rounded-full text-[12.5px]"
					>
						{isSubmitting
							? mode === "create"
								? "Creating..."
								: "Saving..."
							: mode === "create"
								? "Create Team"
								: "Save Changes"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
