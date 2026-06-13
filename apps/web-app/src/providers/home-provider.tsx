"use client";

import { notFound, usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useTeams } from "@/hooks/use-team";
import { useTeamsStore } from "@/stores/data-store";
import { useNavigationStore } from "@/stores/navigation-store";

type HomeProviderProps = {
  children: ReactNode;
};

export function HomeProvider({ children }: HomeProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { loadTeams } = useTeams();

  const teamId = useNavigationStore((state) => state.teamId);

  const teamIds = useTeamsStore((state) => state.teamIds);

  const teamsById = useTeamsStore((state) => state.teamsById);

  const cursor = useTeamsStore((state) => state.cursor);

  useEffect(() => {
    if (pathname !== "/home" || cursor.status !== "uninitialized") return;

    void loadTeams();
  }, [pathname, cursor.status, loadTeams]);

  if (pathname !== "/home") {
    return <>{children}</>;
  }

  if (
    cursor.status === "loading" ||
    cursor.status === "loading-more" ||
    cursor.status === "uninitialized"
  ) {
    return null;
  }

  if (teamId && teamsById[teamId]) {
    router.replace(`/home/${teamId}`);

    return null;
  }

  const firstTeamId = teamIds[0];

  if (firstTeamId) {
    router.replace(`/home/${firstTeamId}`);
    return null;
  }

  notFound();
}
