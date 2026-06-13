// components/dialogs/dialogs.tsx

"use client";

import { TeamDialog } from "@/components/dialogs/create-team";
import { DeployDialog } from "@/components/dialogs/deploy-dialog";
import { PromptDialog } from "@/components/dialogs/prompt-dialog";

export function Dialogs() {
  return (
    <>
      <DeployDialog />
      <TeamDialog />
      <PromptDialog />
    </>
  );
}
