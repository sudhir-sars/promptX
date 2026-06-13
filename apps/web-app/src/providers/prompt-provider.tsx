"use client";

import { notFound } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { db } from "@/lib/convex/client";

import { usePromptsStore } from "@/stores/data-store";
import { useNavigationStore } from "@/stores/navigation-store";

type PromptProviderProps = {
  promptId: Id<"prompts">;
  children: ReactNode;
};

export function PromptProvider({ promptId, children }: PromptProviderProps) {
  const navigate = useNavigationStore((state) => state.navigate);
  const teamId = useNavigationStore((state) => state.teamId);

  const [missing, setMissing] = useState(false);

  useEffect(() => {
    navigate({ promptId });
  }, [promptId, navigate]);

  useEffect(() => {
    const cached = usePromptsStore.getState().promptsById[promptId];

    if (cached) return;

    void db.query(api.prompts.getPrompt, { promptId }).then((prompt) => {
      if (prompt && teamId) {
        usePromptsStore.getState().cache(teamId, [prompt]);
      } else if (!prompt) {
        setMissing(true);
      }
    });
  }, [promptId, teamId]);

  if (missing) notFound();

  return <>{children}</>;
}
