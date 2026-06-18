"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Id } from "@/convex/_generated/dataModel";
import { useTeams } from "@/hooks/use-team";
import { useTeamMembers } from "@/hooks/use-team-members";
import { cn } from "@/lib/utils";
import { confirm } from "@/stores/confirm-dialog-store";

type TransferOwnershipDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function TransferOwnershipDialog({ open, onOpenChange }: TransferOwnershipDialogProps) {
	const { team, transferOwnership } = useTeams();
	const { members, status, hasMore, loadMoreRef } = useTeamMembers();

	const [selectedId, setSelectedId] = useState<Id<"users"> | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Only existing non-owner members can receive ownership.
	const candidates = useMemo(() => members.filter((member) => member.role !== "owner"), [members]);

	useEffect(() => {
		if (open) {
			setSelectedId(null);
		}
	}, [open]);

	const selected = candidates.find((member) => member.userId === selectedId) ?? null;

	const handleTransfer = async () => {
		if (!team || !selected || isSubmitting) {
			return;
		}

		const approved = await confirm({
			title: "Transfer ownership",
			description: `Make ${selected.name} the owner of this team? You will become an admin and lose owner-only controls. This can't be undone by you.`,
			confirmText: "Transfer Ownership",
			variant: "destructive",
		});

		if (!approved) {
			return;
		}

		try {
			setIsSubmitting(true);

			await transferOwnership({
				teamId: team._id,
				userId: selected.userId,
			});

			toast.success(`${selected.name} is now the team owner`);
			onOpenChange(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Transfer ownership</DialogTitle>

					<DialogDescription>
						Hand over this team to another member. You'll be demoted to admin once the transfer completes.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="max-h-72 space-y-2 overflow-y-auto no-scrollbar">
						{candidates.length === 0 ? (
							<div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
								{status === "loading"
									? "Loading members..."
									: "No other members to transfer ownership to. Invite a member first."}
							</div>
						) : (
							candidates.map((member) => {
								const isSelected = member.userId === selectedId;

								return (
									<button
										key={member._id}
										type="button"
										onClick={() => setSelectedId(member.userId)}
										disabled={isSubmitting}
										className={cn(
											"flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors",
											isSelected
												? "border-foreground bg-muted/40"
												: "hover:bg-muted/30 disabled:hover:bg-transparent",
										)}
									>
										<div className="flex min-w-0 items-center gap-3">
											<Avatar className="size-9">
												<AvatarImage src={member.avatar} />
												<AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
											</Avatar>

											<div className="min-w-0">
												<p className="truncate text-sm font-medium">{member.name}</p>
												<p className="truncate text-xs text-muted-foreground">{member.email}</p>
											</div>
										</div>

										<Badge variant="secondary" className="shrink-0 capitalize">
											{member.role}
										</Badge>
									</button>
								);
							})
						)}

						{(status === "loaded" || status === "loading-more") && hasMore && (
							<div ref={loadMoreRef} className="flex justify-center py-2 text-xs text-muted-foreground">
								{status === "loading-more" ? "Loading more members..." : "Scroll for more"}
							</div>
						)}
					</div>

					<Button onClick={handleTransfer} disabled={!selected || isSubmitting} className="w-full">
						{isSubmitting ? "Transferring..." : "Transfer Ownership"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
