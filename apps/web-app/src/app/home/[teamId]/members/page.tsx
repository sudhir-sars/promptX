"use client";

import { useState } from "react";
import { TiUserAdd } from "react-icons/ti";
import { Page, PageHeader, Section } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeams } from "@/hooks/use-team";
import { useTeamDialogStore } from "@/stores/team-dialog-store";
import { InviteMemberDialog } from "./_/invite-member-dialog";
import { InvitesList } from "./_/invites-list";
import { MembersList } from "./_/member-list";

export default function MembersPage() {
	const openCreate = useTeamDialogStore((state) => state.openCreate);
	const { membership, team } = useTeams();
	const [inviteOpen, setInviteOpen] = useState(false);

	if (!membership || !team) return null;

	const canManage = membership.role === "owner" || membership.role === "admin";

	return (
		<Page>
			<PageHeader
				title="Teams"
				description="Organize collaboration across teams and members"
				action={
					<Button variant="outline" onClick={openCreate}>
						<PlusIcon />
						Create Team
					</Button>
				}
			/>

			<Section>
				<div className="w-full flex justify-between">
					<h2 className=" capitalize">{team?.name}</h2>
					{canManage && (
						<Button variant={"outline"} onClick={() => setInviteOpen(true)}>
							<TiUserAdd />
							Invite Member
						</Button>
					)}
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Avatar className="size-10">
							<AvatarImage src={membership.avatar} />
							<AvatarFallback>{membership.name.charAt(0).toUpperCase()}</AvatarFallback>
						</Avatar>

						<div>
							<div className="capitalize text-sm">{membership.name}</div>

							<Badge variant="secondary" className="mt-1 px-3 capitalize">
								{membership.role}
							</Badge>
						</div>
					</div>
				</div>
			</Section>

			<Tabs className="gap-6" defaultValue="members">
				<TabsList variant="line" className="w-fit">
					<TabsTrigger value="members">Members</TabsTrigger>
					<TabsTrigger value="invites">Invites</TabsTrigger>
				</TabsList>

				<TabsContent value="members">
					<MembersList membership={membership} />
				</TabsContent>

				<TabsContent value="invites">
					<InvitesList membership={membership} />
				</TabsContent>
			</Tabs>
			<InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
		</Page>
	);
}
