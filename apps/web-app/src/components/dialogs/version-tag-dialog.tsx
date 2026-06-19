"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useVersions } from "@/hooks/use-versions";
import { useVersionTagDialogStore } from "@/stores/version-tag-dialog-store";

export function VersionTagDialog() {
	const { setTag } = useVersions();

	const { isOpen, version, close } = useVersionTagDialogStore();

	const [value, setValue] = useState("");
	const [pending, setPending] = useState<"save" | "remove" | null>(null);

	const isSaving = pending !== null;

	const existingTag = version?.tag && version.tag !== "draft" ? version.tag : "";

	useEffect(() => {
		if (isOpen) {
			setValue(existingTag);
		}
	}, [isOpen, existingTag]);

	if (!version) {
		return null;
	}

	const trimmed = value.trim();
	const unchanged = trimmed === existingTag;

	const handleSave = async () => {
		if (isSaving || !trimmed || unchanged) {
			return;
		}

		try {
			setPending("save");
			await setTag(version._id, trimmed);
			close();
		} finally {
			setPending(null);
		}
	};

	const handleRemove = async () => {
		if (isSaving) {
			return;
		}

		try {
			setPending("remove");
			await setTag(version._id, "");
			close();
		} finally {
			setPending(null);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && !isSaving && close()}>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>{existingTag ? "Edit Tag" : "Add Tag"}</DialogTitle>

					<DialogDescription>
						Assign a single tag to v{version.sequence}. Tags must be unique within this prompt.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3">
					<Input
						autoFocus
						value={value}
						placeholder="e.g. production, staging, baseline"
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								void handleSave();
							}
						}}
						className="rounded-full px-4 placeholder:text-xs"
					/>

					<div className="flex items-center gap-2">
						{existingTag && (
							<Button
								variant="outline"
								onClick={handleRemove}
								loading={pending === "remove"}
								disabled={isSaving}
								className="rounded-full text-destructive"
							>
								Remove
							</Button>
						)}

						<Button
							onClick={handleSave}
							loading={pending === "save"}
							disabled={isSaving || !trimmed || unchanged}
							className="ml-auto rounded-full"
						>
							{pending === "save" ? "Saving..." : "Save Tag"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
