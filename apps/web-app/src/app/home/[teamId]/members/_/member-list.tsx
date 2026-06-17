"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Member } from "@/convex/types";
import { useTeamMembers } from "@/hooks/use-team-members";
import { confirm } from "@/stores/confirm-dialog-store";

interface MembersListProps {
	membership: Member;
}

export function MembersList({ membership }: MembersListProps) {
	const { members, status, hasMore, loadMoreRef, removeMember, updateMemberRole } = useTeamMembers();

	const [pendingId, setPendingId] = useState<string | null>(null);

	const canManage = membership.role === "owner" || membership.role === "admin";

	const handleRemove = async (member: (typeof members)[number]) => {
		if (pendingId) return;

		const approved = await confirm({
			title: "Remove member",
			description: `Remove ${member.name} from the team?`,
			confirmText: "Remove",
			variant: "destructive",
		});

		if (!approved) return;

		setPendingId(member._id);

		try {
			await removeMember(member.userId);
		} finally {
			setPendingId(null);
		}
	};

	const handleRoleChange = async (member: (typeof members)[number], role: "admin" | "member") => {
		if (member.role === role || pendingId) return;

		const approved = await confirm({
			title: "Update role",
			description: `Change ${member.name}'s role from ${member.role} to ${role}?`,
			confirmText: "Update Role",
			variant: "default",
		});

		if (!approved) return;

		setPendingId(member._id);

		try {
			await updateMemberRole(member.userId, role);
		} finally {
			setPendingId(null);
		}
	};

	if (status === "error") {
		return <ErrorState message="Failed to load members." />;
	}

	if (status === "loading" && members.length === 0) {
		return <div className="rounded-4xl border py-8 text-center text-sm text-muted-foreground">Loading members...</div>;
	}

	if ((status === "loaded" || status === "exhausted") && members.length === 0) {
		return <EmptyState variant="team" />;
	}

	return (
		<>
			<div className="overflow-hidden rounded-4xl border">
				{members.map((member) => {
					const isSelf = membership?.userId === member.userId;

					const isPending = pendingId === member._id;

					return (
						<div key={member._id} className="flex items-center justify-between border-b px-4 py-4 last:border-b-0">
							<div className="flex min-w-0 items-center gap-3">
								<Avatar className="size-10">
									<AvatarImage src={member.avatar} />
									<AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
								</Avatar>

								<div className="min-w-0">
									<p className="truncate text-sm font-medium">
										{member.name}
										{isSelf && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
									</p>

									<p className="truncate text-xs text-muted-foreground">{member.email}</p>
								</div>
							</div>

							<div className="flex items-center gap-2">
								{member.role === "owner" ? (
									<Badge variant="outline" className="capitalize bg-input/50 text-sm px-4 py-[13px]">
										Owner
									</Badge>
								) : (
									<Select
										value={member.role}
										disabled={!canManage || isSelf || isPending}
										onValueChange={(value) => handleRoleChange(member, value as "admin" | "member")}
									>
										<SelectTrigger size="sm">
											<SelectValue />
										</SelectTrigger>

										<SelectContent>
											<SelectItem value="member">Member</SelectItem>

											<SelectItem value="admin">Admin</SelectItem>
										</SelectContent>
									</Select>
								)}

								{canManage && !isSelf && member.role !== "owner" && (
									<Button size="sm" variant="destructive" disabled={isPending} onClick={() => handleRemove(member)}>
										Remove
									</Button>
								)}
							</div>
						</div>
					);
				})}

				{(status === "loaded" || status === "loading-more") && hasMore && (
					<div ref={loadMoreRef} className="flex justify-center py-4 text-sm text-muted-foreground">
						{status === "loading-more" ? "Loading more members..." : "Scroll for more"}
					</div>
				)}
			</div>
			<div className="h-30" />
		</>
	);
}
