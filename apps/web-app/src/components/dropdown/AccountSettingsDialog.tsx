"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrashIcon } from "@/components/ui/icons";
import { api } from "@/convex/_generated/api";
import { db } from "@/lib/convex/client";
import { confirm } from "@/stores/confirm-dialog-store";
import { useConsentStore } from "@/stores/consent-store";

type AccountSettingsDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function AccountSettingsDialog({ open, onOpenChange }: AccountSettingsDialogProps) {
	const { user } = useUser();
	const openPreferences = useConsentStore((state) => state.openPreferences);

	const [isExporting, setIsExporting] = useState(false);
	const [isDeletingAccount, setIsDeletingAccount] = useState(false);

	const handleExport = async () => {
		setIsExporting(true);
		try {
			const data = await db.action(api.privacy.exportMyData, {});

			const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "promptx-data-export.json";
			link.click();
			URL.revokeObjectURL(url);
		} catch {
			toast.error("Could not export your data. Please try again or contact support@xevos.dev.");
		} finally {
			setIsExporting(false);
		}
	};

	const handleDeleteAccount = async () => {
		const approved = await confirm({
			title: "Delete account",
			description:
				"This permanently deletes your account and every team you own, including all prompts, versions, deployments, API keys, and related data. This action cannot be undone.",
			confirmText: "Delete Account",
			variant: "destructive",
		});

		if (!approved) {
			return;
		}

		setIsDeletingAccount(true);
		try {
			await user?.delete();
			window.location.href = "/";
		} catch {
			toast.error("Could not delete your account. Please contact support@xevos.dev.");
			setIsDeletingAccount(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={(next) => !isDeletingAccount && onOpenChange(next)}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Account Settings</DialogTitle>

					<DialogDescription>Manage your data, privacy, and account.</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					<div className="space-y-4">
						<div>
							<h2 className="font-medium">Your Data &amp; Privacy</h2>

							<p className="mt-1 text-sm text-muted-foreground">
								Manage your cookie choices and export a copy of your personal data.
							</p>
						</div>

						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<p className="font-medium">Cookie preferences</p>

								<p className="mt-1 text-sm text-muted-foreground">
									Review or change which optional cookies you allow.
								</p>
							</div>

							<Button variant="outline" onClick={openPreferences}>
								Manage Cookies
							</Button>
						</div>

						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<p className="font-medium">Export your data</p>

								<p className="mt-1 text-sm text-muted-foreground">
									Download a machine-readable copy of your account data.
								</p>
							</div>

							<Button variant="outline" loading={isExporting} onClick={handleExport}>
								{isExporting ? "Preparing..." : "Export Data"}
							</Button>
						</div>
					</div>

					<div className="space-y-4 rounded-xl border border-destructive/15 p-4">
						<div>
							<h2 className="font-medium text-destructive">Delete Account</h2>
						</div>

						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<p className="font-medium">Delete your account</p>

								<p className="mt-1 text-sm text-muted-foreground">
									Permanently remove your account and every team you own.
								</p>
							</div>

							<Button variant="destructive" loading={isDeletingAccount} onClick={handleDeleteAccount}>
								{!isDeletingAccount && <TrashIcon />}
								{isDeletingAccount ? "Deleting..." : "Delete Account"}
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
