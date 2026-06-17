"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useConfirmDialogStore } from "@/stores/confirm-dialog-store";

export function ConfirmDialog() {
	const { open, title, description, confirmText, cancelText, variant, close } = useConfirmDialogStore();

	return (
		<Dialog
			open={open}
			onOpenChange={(value) => {
				if (!value) close(false);
			}}
		>
			<DialogContent className="sm:max-w-[400px] p-4 rounded-[36px]">
				<DialogHeader className="text-center">
					<DialogTitle>{title}</DialogTitle>

					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>

				<div className="mt-2 flex flex-col gap-2">
					<Button variant="outline" onClick={() => close(false)} className="w-full">
						{cancelText}
					</Button>
					<Button
						variant={variant === "destructive" ? "destructive" : "subtle"}
						onClick={() => close(true)}
						className="w-full"
					>
						{confirmText}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
