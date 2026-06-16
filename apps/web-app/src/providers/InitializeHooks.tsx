"use client";

import { useNavigationMediaSync } from "@/hooks/use-media";
import { useNavigation } from "@/hooks/use-navigation";

export function InitializeHooks() {
	useNavigationMediaSync();
	useNavigation();

	return null;
}
