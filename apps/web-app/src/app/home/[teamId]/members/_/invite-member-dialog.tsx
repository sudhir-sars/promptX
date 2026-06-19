"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTeamInvites } from "@/hooks/use-team-invites";

type InviteMemberDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

type Role = "admin" | "member";

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
	const { user } = useUser();
	const { createInvite } = useTeamInvites();
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<Role>("member");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const currentUserEmail = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase();

	const reset = () => {
		setEmail("");
		setRole("member");
	};

	const handleOpenChange = (next: boolean) => {
		onOpenChange(next);

		if (!next) {
			reset();
		}
	};

	const normalizedEmail = email.trim().toLowerCase();
	const isSelfInvite = !!currentUserEmail && normalizedEmail === currentUserEmail;

	const handleSubmit = async () => {
		if (!normalizedEmail || isSubmitting) return;

		if (isSelfInvite) {
			toast.error("You cannot invite yourself.");
			return;
		}

		try {
			setIsSubmitting(true);

			const invite = await createInvite({
				email: normalizedEmail,
				role,
			});

			if (invite) {
				toast.success(`Invitation sent to ${invite.email}`);
				handleOpenChange(false);
			}
		} finally {
			setIsSubmitting(false);
			handleOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite member</DialogTitle>

					<DialogDescription>Send an invitation by email. They'll get a link to join this team.</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3">
					<Input
						type="email"
						value={email}
						placeholder="sudhir@xevos.ai"
						onChange={(e) => setEmail(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								void handleSubmit();
							}
						}}
						className="rounded-full px-4 placeholder:text-xs placeholder:-translate-y-0.5"
					/>

					{isSelfInvite ? <p className="px-2 text-xs text-destructive">You cannot invite yourself.</p> : null}

					<Button
						variant="outline"
						onClick={handleSubmit}
						loading={isSubmitting}
						disabled={!normalizedEmail || isSelfInvite}
						className="rounded-full text-[12.5px]"
					>
						{isSubmitting ? "Sending..." : "Send invitation"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
