// components/dialogs/dialogs.tsx

"use client";

import { TeamDialog } from "@/components/dialogs/create-team";
import { DeployDialog } from "@/components/dialogs/deploy-dialog";
import { PromptDialog } from "@/components/dialogs/prompt-dialog";
import { RollbackDialog } from "@/components/dialogs/rollback-dialog";
import { VersionTagDialog } from "@/components/dialogs/version-tag-dialog";

export function Dialogs() {
	return (
		<>
			<DeployDialog />
			<RollbackDialog />
			<TeamDialog />
			<PromptDialog />
			<VersionTagDialog />
		</>
	);
}
