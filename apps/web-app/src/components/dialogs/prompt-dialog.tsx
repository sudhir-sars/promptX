"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { usePrompts } from "@/hooks/use-prompt";
import { slugify } from "@/lib/utils";

import { usePromptDialogStore } from "@/stores/prompt-dialog-store";

export function PromptDialog() {
	const { createPrompt, renamePrompt } = usePrompts();

	const {
		isOpen,
		mode,
		promptId,

		name,

		setOpen,
		setName,

		reset,
	} = usePromptDialogStore();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const slugPreview = slugify(name.trim());

	const handleSubmit = async () => {
		const trimmedName = name.trim();

		if (!trimmedName || isSubmitting) return;
		if (mode === "edit" && !promptId) return;
		try {
			setIsSubmitting(true);

			if (mode === "create") {
				await createPrompt({
					name: trimmedName,
				});
			} else {
				await renamePrompt(trimmedName);
			}

			reset();

			setOpen(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		setOpen(open);
		if (!open) reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{mode === "create" ? "Create Prompt" : "Edit Prompt"}</DialogTitle>

					<DialogDescription className="text-xs font-normal text-muted-foreground">
						{mode === "create" ? "Add a new AI prompt to your workspace" : "Update prompt information"}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3">
					<Input
						value={name}
						placeholder="Prompt name"
						onChange={(e) => setName(e.target.value)}
						className="rounded-full px-4 placeholder:text-xs"
					/>

					{mode === "create" && slugPreview && (
						<div className="rounded-2xl border bg-muted/20 px-4 py-3">
							<div className="text-xs text-muted-foreground">
								<span className="font-medium">Slug:</span> Used by the API & SDK. Cannot be changed later.
							</div>

							<p className="mt-1 break-all font-mono">{slugPreview}</p>
						</div>
					)}

					<Button
						variant="outline"
						onClick={handleSubmit}
						disabled={!name.trim() || isSubmitting}
						className="rounded-full"
					>
						{isSubmitting
							? mode === "create"
								? "Creating..."
								: "Saving..."
							: mode === "create"
								? "Create Prompt"
								: "Save Changes"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
