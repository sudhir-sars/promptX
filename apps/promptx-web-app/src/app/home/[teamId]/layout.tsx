import type { ReactNode } from "react";

import type { Id } from "@/convex/_generated/dataModel";

import { TeamProvider } from "@/providers/team-provider";

type TeamLayoutProps = {
    children: ReactNode;

    params: Promise<{
        teamId: string;
    }>;
};

export default async function TeamLayout({ children, params }: TeamLayoutProps) {
    const { teamId } = await params;

    return <TeamProvider teamId={teamId as Id<"teams">}>{children}</TeamProvider>;
}
