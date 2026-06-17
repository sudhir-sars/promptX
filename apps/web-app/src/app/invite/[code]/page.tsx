"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { MembersIcon } from "@/components/ui/icons";
import { useInvite } from "@/hooks/use-invite";

type InvitePreview = {
	teamName: string;
	teamAvatar: string | null;
	role: "admin" | "member";
	inviterName: string;
};

export default function InvitePage() {
	const params = useParams<{ code: string }>();
	const router = useRouter();
	const { isLoaded, isSignedIn } = useUser();

	const code = params.code;

	const { invitePreview, acceptInvite, declineInvite } = useInvite();

	const [invite, setInvite] = useState<InvitePreview | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [action, setAction] = useState<"accept" | "decline" | null>(null);

	useEffect(() => {
		void (async () => {
			try {
				const result = await invitePreview(code);
				setInvite(result);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [code, invitePreview]);

	const handleAccept = async () => {
		setAction("accept");

		try {
			const result = await acceptInvite(code);

			if (result?.teamId) {
				toast.success("Invitation accepted");
				router.push(`/home/${result.teamId}`);
			}
		} finally {
			setAction(null);
		}
	};

	const handleDecline = async () => {
		setAction("decline");

		try {
			const result = await declineInvite(code);

			if (result?.success) {
				toast.success("Invitation declined");
				router.push("/home");
			}
		} finally {
			setAction(null);
		}
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center px-6">
				<div className="w-full max-w-md rounded-3xl border p-8 text-center">
					<Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
					<p className="mt-4 text-sm text-muted-foreground">Loading invitation...</p>
				</div>
			</div>
		);
	}

	if (!invite) {
		return (
			<div className="flex min-h-screen items-center justify-center px-6">
				<div className="w-full max-w-md rounded-3xl border p-8 text-center">
					<div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border">
						<MembersIcon className="size-7 text-muted-foreground" />
					</div>

					<h1 className="text-xl font-semibold">Invitation not found</h1>

					<p className="mt-3 text-sm text-muted-foreground">
						This invitation is invalid, expired, or has already been used.
					</p>

					<Button variant="outline" className="mt-8" onClick={() => router.push("/")}>
						Go to PromptX
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center px-6 py-20">
			<div className="w-full max-w-md rounded-3xl border p-8 text-center">
				<div className="mx-auto mb-6 flex size-14 items-center justify-center overflow-hidden rounded-2xl border">
					{invite.teamAvatar ? (
						<Image
							src={invite.teamAvatar}
							alt={invite.teamName}
							width={56}
							height={56}
							unoptimized
							className="size-full object-cover"
						/>
					) : (
						<MembersIcon className="size-7 text-muted-foreground" />
					)}
				</div>

				<h1 className="text-xl font-semibold tracking-tight">Join {invite.teamName}</h1>

				<p className="mt-3 text-sm leading-6 text-muted-foreground">
					<span className="font-medium text-foreground">{invite.inviterName}</span> invited you to join{" "}
					<span className="font-medium text-foreground">{invite.teamName}</span> as{" "}
					{invite.role === "admin" ? "an" : "a"}{" "}
					<span className="font-medium capitalize text-foreground">{invite.role}</span>.
				</p>

				<div className="mt-8">
					{!isLoaded ? (
						<Button disabled className="w-full">
							<Loader2 className="mr-2 size-4 animate-spin" />
							Loading...
						</Button>
					) : !isSignedIn ? (
						<div className="space-y-4">
							<p className="text-sm text-muted-foreground">Sign in or create an account to accept this invitation.</p>

							<Button
								className="w-full"
								onClick={() => router.push(`/sign-in?redirect_url=${encodeURIComponent(`/invite/${code}`)}`)}
							>
								Sign in to accept
							</Button>
						</div>
					) : (
						<div className="flex justify-center gap-3">
							<Button variant="outline" disabled={action !== null} onClick={handleDecline}>
								{action === "decline" && <Loader2 className="mr-2 size-4 animate-spin" />}
								Decline
							</Button>

							<Button disabled={action !== null} onClick={handleAccept}>
								{action === "accept" && <Loader2 className="mr-2 size-4 animate-spin" />}
								Accept invitation
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
