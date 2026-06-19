"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AccessGate } from "@/components/ui/access-gate";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Member } from "@/convex/types";
import { useTeamInvites } from "@/hooks/use-team-invites";
import { confirm } from "@/stores/confirm-dialog-store";

interface InvitesListProps {
	membership: Member;
}

export function InvitesList({ membership }: InvitesListProps) {
	const { invites, status, hasMore, loadMoreRef, cancelInvite } = useTeamInvites();

	const canManage = membership.role === "owner" || membership.role === "admin";

	const [pendingId, setPendingId] = useState<string | null>(null);

	const handleCancel = async (invite: (typeof invites)[number]) => {
		if (pendingId) return;

		const approved = await confirm({
			title: "Cancel invitation",
			description: `Cancel invitation for ${invite.email}?`,
			confirmText: "Cancel Invitation",
			variant: "destructive",
			cancelText: "back",
		});

		if (!approved) return;

		setPendingId(invite._id);

		try {
			await cancelInvite(invite._id);
		} finally {
			setPendingId(null);
		}
	};

	const handleCopy = async (invite: (typeof invites)[number]) => {
		const url = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${invite.code}`;

		try {
			await navigator.clipboard.writeText(url);

			toast.success("Invite link copied");
		} catch {
			toast.error("Failed to copy invite link");
		}
	};

	if (!canManage) {
		return <AccessGate variant="invite" />;
	}

	if (status === "error") {
		return <ErrorState message="Failed to load invitations." />;
	}

	if (status === "loading" && invites.length === 0) {
		return (
			<div className="rounded-4xl border py-8 text-center text-sm text-muted-foreground">Loading invitations...</div>
		);
	}

	if ((status === "loaded" || status === "exhausted") && invites.length === 0) {
		return <EmptyState title="No invited members" description="Invite teammates to collaborate on this team." />;
	}

	return (
		<>
			<div className="overflow-hidden rounded-4xl border">
				{invites.map((invite) => {
					const isPending = pendingId === invite._id;

					return (
						<div key={invite._id} className="flex items-center justify-between border-b px-4 py-4 last:border-b-0">
							<div className="flex min-w-0 items-center gap-3">
								<Avatar className="size-10">
									<AvatarFallback>{invite.email.charAt(0).toUpperCase()}</AvatarFallback>
								</Avatar>

								<div className="min-w-0">
									<p className="truncate text-sm font-medium">{invite.email}</p>

									<p className="text-xs text-muted-foreground">Pending invitation</p>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<Button size="sm" variant="outline" onClick={() => handleCopy(invite)}>
									Copy Link
								</Button>

								<Button size="sm" variant="destructive" loading={isPending} onClick={() => handleCancel(invite)}>
									Cancel
								</Button>
							</div>
						</div>
					);
				})}

				{(status === "loaded" || status === "loading-more") && hasMore && (
					<div ref={loadMoreRef} className="flex justify-center py-4 text-sm text-muted-foreground">
						{status === "loading-more" ? "Loading more invitations..." : "Scroll for more"}
					</div>
				)}
			</div>
			<div className="h-30" />
		</>
	);
}
