"use client";

import { useState } from "react";
import { Page, PageHeader, Section } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { EditIcon, MembersIcon, TrashIcon } from "@/components/ui/icons";

import { useTeams } from "@/hooks/use-team";
import { getRelativeTime } from "@/lib/date";

import { confirm } from "@/stores/confirm-dialog-store";
import { useTeamDialogStore } from "@/stores/team-dialog-store";
import { TransferOwnershipDialog } from "./_/transfer-ownership-dialog";

export default function SettingsPage() {
	const { team, deleteTeam, membership } = useTeams();

	const { openEdit } = useTeamDialogStore();

	const [transferOpen, setTransferOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	if (!membership || !team) {
		return <ErrorState message="Unable to load team details. The team may not exist or you may not have access." />;
	}

	const canManage = membership.role === "owner" || membership.role === "admin";

	const isOwner = membership.role === "owner";

	const handleDelete = async () => {
		const approved = await confirm({
			title: "Delete team",
			description:
				"This action cannot be undone. All prompts, versions, deployments, members, invitations, and associated data will be permanently removed.",
			confirmText: "Delete Team",
			variant: "destructive",
		});

		if (!approved) {
			return;
		}

		setIsDeleting(true);
		try {
			await deleteTeam({
				teamId: team._id,
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Page>
			<PageHeader title="Team Settings" description="Manage team details and lifecycle." />

			{!canManage && (
				<Section>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<MembersIcon className="size-4 shrink-0" />
						<span>You have read-only access to this team.</span>
					</div>
				</Section>
			)}

			<Section>
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0">
						<h2 className="truncate text-[15px] font-medium capitalize">{team.name}</h2>

						<div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-0">
							<span>
								{team.meta.memberCount} {team.meta.memberCount === 1 ? "Member" : "Members"}
							</span>

							<span className="hidden px-2 sm:inline">|</span>

							<span>
								{team.meta.promptCount} {team.meta.promptCount === 1 ? "Prompt" : "Prompts"}
							</span>

							<span className="hidden px-2 sm:inline">|</span>

							<span>Created {getRelativeTime(team._creationTime)}</span>
						</div>
					</div>

					{canManage && (
						<Button size="sm" variant="outline" onClick={() => openEdit(team._id, team.name)}>
							<EditIcon />
							Rename
						</Button>
					)}
				</div>
			</Section>

			{isOwner && (
				<Section>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<p className="font-medium">Transfer Ownership</p>

							<p className="mt-1 text-sm text-muted-foreground">
								Hand this team over to another member. You will become an admin.
							</p>
						</div>

						<Button variant="outline" onClick={() => setTransferOpen(true)}>
							Transfer Ownership
						</Button>
					</div>
				</Section>
			)}

			{isOwner && (
				<Section className="border-destructive/15">
					<div className="space-y-4">
						<div>
							<h2 className="font-medium text-destructive">Danger Zone</h2>
						</div>

						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<p className="font-medium">Delete Team</p>

								<p className="mt-1 text-sm text-muted-foreground">
									Permanently remove this team and all associated data.
								</p>
							</div>

							<Button variant="destructive" loading={isDeleting} onClick={handleDelete}>
								{!isDeleting && <TrashIcon />}
								{isDeleting ? "Deleting..." : "Delete Team"}
							</Button>
						</div>
					</div>
				</Section>
			)}

			{isOwner && <TransferOwnershipDialog open={transferOpen} onOpenChange={setTransferOpen} />}
		</Page>
	);
}
