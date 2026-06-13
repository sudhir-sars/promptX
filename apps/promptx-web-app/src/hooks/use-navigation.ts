"use client";

import { useEffect } from "react";

import { useNavigationStore } from "@/stores/navigation-store";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export function useNavigation() {
    const { teamId, promptId } = useParams();

    const navigate = useNavigationStore((s) => s.navigate);

    useEffect(() => {
        navigate({
            teamId: teamId as Id<"teams">,
            promptId: promptId as Id<"prompts">,
        });
    }, [teamId, promptId, navigate]);
}
