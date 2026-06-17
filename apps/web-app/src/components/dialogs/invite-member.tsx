"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeamInvites } from "@/hooks/use-team-invites";

type InviteMemberDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

type Role = "admin" | "member";

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
	const { createInvite } = useTeamInvites();

	const [email, setEmail] = useState("");
	const [role, setRole] = useState<Role>("member");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const reset = () => {
		setEmail("");
		setRole("member");
	};

	const handleOpenChange = (next: boolean) => {
		onOpenChange(next);

		if (!next) reset();
	};

	const handleSubmit = async () => {
		const trimmed = email.trim();

		if (!trimmed || isSubmitting) return;

		try {
			setIsSubmitting(true);

			const invite = await createInvite({ email: trimmed, role });

			if (invite) {
				toast.success(`Invitation sent to ${invite.email}`);

				handleOpenChange(false);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="rounded-2xl shadow-2xl">
				<DialogHeader>
					<DialogTitle>Invite member</DialogTitle>

					<DialogDescription className="text-xs font-normal text-muted-foreground">
						Send an invitation by email. They'll get a link to join this team.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3">
					<Input
						type="email"
						value={email}
						placeholder="teammate@company.com"
						onChange={(e) => setEmail(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") void handleSubmit();
						}}
						className="rounded-full px-4 placeholder:text-xs"
					/>

					<Select value={role} onValueChange={(value) => setRole(value as Role)}>
						<SelectTrigger className="w-full rounded-full px-4">
							<SelectValue placeholder="Role" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="member">Member</SelectItem>
							<SelectItem value="admin">Admin</SelectItem>
						</SelectContent>
					</Select>

					<Button
						variant="outline"
						onClick={handleSubmit}
						disabled={!email.trim() || isSubmitting}
						className="rounded-full text-[12.5px]"
					>
						{isSubmitting ? "Sending..." : "Send invitation"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
