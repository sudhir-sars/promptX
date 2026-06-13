"use client";

import { notFound } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { db } from "@/lib/convex/client";

import { useTeamsStore } from "@/stores/data-store";
import { useNavigationStore } from "@/stores/navigation-store";

type TeamProviderProps = {
  teamId: Id<"teams">;
  children: ReactNode;
};

export function TeamProvider({ teamId, children }: TeamProviderProps) {
  const navigate = useNavigationStore((state) => state.navigate);

  const [missing, setMissing] = useState(false);

  useEffect(() => {
    navigate({ teamId });
  }, [teamId, navigate]);

  useEffect(() => {
    const cached = useTeamsStore.getState().teamsById[teamId];

    if (cached) return;

    void db.query(api.teams.team.getTeam, { teamId }).then((team) => {
      if (team) {
        useTeamsStore.getState().cache([team]);
      } else {
        setMissing(true);
      }
    });
  }, [teamId]);

  if (missing) notFound();

  return <>{children}</>;
}
