"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { useNavigationStore } from "@/stores/navigation-store";

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
