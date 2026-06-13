// components/dialogs/dialogs.tsx

"use client";

import { TeamDialog } from "@/components/dialogs/create-team";
import { PromptDialog } from "@/components/dialogs/prompt-dialog";
import { DeployDialog } from "@/components/dialogs/deploy-dialog";

export function Dialogs() {
    return (
        <>
            <DeployDialog />
            <TeamDialog />
            <PromptDialog />
        </>
    );
}
