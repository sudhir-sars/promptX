"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { InviteMemberDialog } from "@/components/dialogs/invite-member";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyIcon, LogoutIcon, MembersIcon, PlusIcon, SettingsIcon, TrashIcon, UserIcon } from "@/components/ui/icons";
import { LoadingState } from "@/components/ui/loading-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useTeams } from "@/hooks/use-team";
import { useTeamInvites } from "@/hooks/use-team-invites";
import { useTeamMembers } from "@/hooks/use-team-members";
import { db } from "@/lib/convex/client";
import { consumeError } from "@/lib/errors";
import { useNavigationStore } from "@/stores/navigation-store";

type Role = "owner" | "admin" | "member";
type AssignableRole = "admin" | "member";

export default function MembersPage() {
	const router = useRouter();
	const teamId = useNavigationStore((state) => state.teamId);

	const { team, transferOwnership } = useTeams();
	const { members, cursor: membersCursor, loadMembers, updateMemberRole, removeMember, leaveTeam } = useTeamMembers();
	const { invites, cursor: invitesCursor, loadInvites, cancelInvite } = useTeamInvites();

	const [viewer, setViewer] = useState<Doc<"members"> | null>(null);
	const [viewerLoading, setViewerLoading] = useState(true);
	const [inviteOpen, setInviteOpen] = useState(false);
	const [pendingMemberId, setPendingMemberId] = useState<string | null>(null);
	const [pendingInviteId, setPendingInviteId] = useState<string | null>(null);

	const loadViewer = useCallback(async () => {
		if (!teamId) return;

		try {
			const membership = await db.query(api.teams.member.getMyMembership, { teamId });
			setViewer(membership);
		} catch (error) {
			consumeError(error);
		} finally {
			setViewerLoading(false);
		}
	}, [teamId]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: hooks read the store via getState(), not reactive state
	useEffect(() => {
		if (!teamId) return;

		void loadMembers();
		void loadViewer();
	}, [teamId]);

	const canManage = viewer?.role === "owner" || viewer?.role === "admin";
	const isOwner = viewer?.role === "owner";

	// biome-ignore lint/correctness/useExhaustiveDependencies: loadInvites reads the store via getState(), not reactive state
	useEffect(() => {
		if (canManage) void loadInvites();
	}, [canManage]);

	const handleRoleChange = async (member: Doc<"members">, role: AssignableRole) => {
		setPendingMemberId(member._id);

		try {
			await updateMemberRole(member.userId, role);
			toast.success(`${member.name} is now ${role === "admin" ? "an admin" : "a member"}`);
		} finally {
			setPendingMemberId(null);
		}
	};

	const handleRemove = async (member: Doc<"members">) => {
		if (!confirm(`Remove ${member.name} from the team?`)) return;

		setPendingMemberId(member._id);

		try {
			await removeMember(member.userId);
			toast.success(`${member.name} removed`);
		} finally {
			setPendingMemberId(null);
		}
	};

	const handleTransfer = async (member: Doc<"members">) => {
		if (!teamId) return;

		if (!confirm(`Transfer ownership to ${member.name}? You will become an admin.`)) return;

		setPendingMemberId(member._id);

		try {
			await transferOwnership({ teamId, userId: member.userId });
			await loadViewer();
			toast.success(`${member.name} is now the owner`);
		} finally {
			setPendingMemberId(null);
		}
	};

	const handleLeave = async () => {
		if (!confirm("Leave this team? You will lose access to its prompts.")) return;

		await leaveTeam();
		toast.success("You left the team");
		router.push("/home");
	};

	const handleCancelInvite = async (invite: Doc<"invites">) => {
		setPendingInviteId(invite._id);

		try {
			await cancelInvite(invite._id);
			toast.success("Invitation cancelled");
		} finally {
			setPendingInviteId(null);
		}
	};

	const handleCopyLink = async (invite: Doc<"invites">) => {
		try {
			await navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.code}`);
			toast.success("Invite link copied");
		} catch {
			toast.error("Failed to copy invite link");
		}
	};

	if (viewerLoading || (membersCursor.status === "loading" && members.length === 0)) {
		return <LoadingState variant="project" />;
	}

	return (
		<>
			<div className="h-full flex-1 space-y-7 overflow-y-auto no-scrollbar px-6 py-20 md:px-10 lg:px-16 transition-all duration-300 ease-in-out">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className="text-xl font-semibold">Members</h1>

						<p className="mt-1 text-sm text-muted-foreground">
							Manage team members, permissions, invitations, and collaboration.
						</p>
					</div>

					{canManage && (
						<Button variant="outline" onClick={() => setInviteOpen(true)}>
							<PlusIcon />
							Invite
						</Button>
					)}
				</div>

				{canManage && (
					<section className="overflow-hidden rounded-4xl border">
						<div className="border-b px-5 py-4">
							<h2 className="text-sm font-medium">Pending invitations</h2>

							<p className="mt-1 text-xs text-muted-foreground">People who have been invited but haven't joined yet.</p>
						</div>

						<div className="p-5">
							{invites.length === 0 ? (
								<p className="text-sm text-muted-foreground">No pending invitations.</p>
							) : (
								<div className="space-y-3">
									{invites.map((invite) => {
										if (!invite) return null;

										const isPending = pendingInviteId === invite._id;

										return (
											<div key={invite._id} className="flex items-center justify-between gap-3 rounded-3xl border p-4">
												<div className="min-w-0">
													<p className="truncate text-sm font-medium">{invite.email}</p>

													<p className="mt-1 text-xs capitalize text-muted-foreground">{invite.role}</p>
												</div>

												<div className="flex shrink-0 items-center gap-2">
													<Button size="sm" variant="ghost" onClick={() => handleCopyLink(invite)}>
														<CopyIcon />
														Copy link
													</Button>

													<Button
														size="sm"
														variant="destructive"
														disabled={isPending}
														onClick={() => handleCancelInvite(invite)}
													>
														{isPending && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
														Cancel
													</Button>
												</div>
											</div>
										);
									})}

									{invitesCursor.status === "loaded" && invitesCursor.next && (
										<Button variant="ghost" className="w-full" onClick={() => loadInvites()}>
											Load more
										</Button>
									)}
								</div>
							)}
						</div>
					</section>
				)}

				<section className="overflow-hidden rounded-4xl border">
					<div className="border-b px-5 py-4">
						<h2 className="text-sm font-medium">Team members</h2>

						<p className="mt-1 text-xs text-muted-foreground">{team?.meta.memberCount ?? members.length} members</p>
					</div>

					<div className="p-5">
						<div className="space-y-3">
							{members.map((member) => {
								if (!member) return null;

								const isSelf = viewer ? member.userId === viewer.userId : false;
								const isOwnerRow = member.role === "owner";
								const adminTouchingAdmin = viewer?.role === "admin" && member.role === "admin";

								const canChangeRole = canManage && !isOwnerRow && !adminTouchingAdmin;
								const canRemove = canManage && !isOwnerRow && !isSelf && !adminTouchingAdmin;
								const canTransfer = isOwner && !isOwnerRow;
								const canLeave = isSelf && !isOwnerRow;

								const hasActions = canRemove || canTransfer || canLeave;
								const isPending = pendingMemberId === member._id;

								return (
									<div key={member._id} className="flex items-center justify-between gap-3 rounded-3xl border p-4">
										<div className="flex min-w-0 items-center gap-3">
											<Avatar src={member.avatar} name={member.name} />

											<div className="min-w-0">
												<p className="truncate text-sm font-medium">
													{member.name}
													{isSelf && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
												</p>

												<p className="truncate text-xs text-muted-foreground">{member.email}</p>
											</div>
										</div>

										<div className="flex shrink-0 items-center gap-2">
											{isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}

											{canChangeRole ? (
												<Select
													value={member.role}
													disabled={isPending}
													onValueChange={(value) => handleRoleChange(member, value as AssignableRole)}
												>
													<SelectTrigger size="sm" className="w-28 rounded-full">
														<SelectValue />
													</SelectTrigger>

													<SelectContent>
														<SelectItem value="member">Member</SelectItem>
														<SelectItem value="admin">Admin</SelectItem>
													</SelectContent>
												</Select>
											) : (
												<RoleBadge role={member.role} />
											)}

											{hasActions && (
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button size="icon-sm" variant="ghost" disabled={isPending}>
															<SettingsIcon />
														</Button>
													</DropdownMenuTrigger>

													<DropdownMenuContent align="end">
														{canTransfer && (
															<DropdownMenuItem onClick={() => handleTransfer(member)}>
																<UserIcon />
																Transfer ownership
															</DropdownMenuItem>
														)}

														{canRemove && (
															<DropdownMenuItem variant="destructive" onClick={() => handleRemove(member)}>
																<TrashIcon />
																Remove
															</DropdownMenuItem>
														)}

														{canLeave && (
															<DropdownMenuItem variant="destructive" onClick={handleLeave}>
																<LogoutIcon />
																Leave team
															</DropdownMenuItem>
														)}
													</DropdownMenuContent>
												</DropdownMenu>
											)}
										</div>
									</div>
								);
							})}

							{membersCursor.status === "loaded" && membersCursor.next && (
								<Button variant="ghost" className="w-full" onClick={() => loadMembers()}>
									Load more
								</Button>
							)}
						</div>
					</div>
				</section>

				{!canManage && (
					<div className="flex items-center gap-2 rounded-4xl border p-4 text-sm text-muted-foreground">
						<MembersIcon className="size-4 shrink-0" />
						Only owners and admins can invite or manage members.
					</div>
				)}
			</div>

			<InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
		</>
	);
}

function RoleBadge({ role }: { role: Role }) {
	return <span className="rounded-full border px-3 py-1 text-xs capitalize text-muted-foreground">{role}</span>;
}

function Avatar({ src, name }: { src: string; name: string }) {
	const initial = name.trim().charAt(0).toUpperCase() || "U";

	if (src) {
		return (
			<div className="relative size-9 shrink-0 overflow-hidden rounded-full border">
				<Image src={src} alt={initial} fill unoptimized className="object-cover" />
			</div>
		);
	}

	return (
		<div className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium">
			{initial}
		</div>
	);
}
