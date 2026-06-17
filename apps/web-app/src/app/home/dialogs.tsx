// components/dialogs/dialogs.tsx

"use client";

import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { TeamDialog } from "@/components/dialogs/create-team";
import { DeployDialog } from "@/components/dialogs/deploy-dialog";
import { PromptDialog } from "@/components/dialogs/prompt-dialog";
import { RollbackDialog } from "@/components/dialogs/rollback-dialog";
import { VersionTagDialog } from "@/components/dialogs/version-tag-dialog";

export function Dialogs() {
	return (
		<>
			<DeployDialog />
			<ConfirmDialog />
			<RollbackDialog />
			<TeamDialog />
			<PromptDialog />
			<VersionTagDialog />
		</>
	);
}
