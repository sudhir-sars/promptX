"use client";

import { useEffect } from "react";
import { useMediaQuery } from "@mantine/hooks";

import { useNavigationStore } from "@/stores/navigation-store";
import { useDocsNavigationStore } from "@/stores/docs-navigation-store";

export function useNavigationMediaSync() {
    const syncDesktop = useNavigationStore((state) => state.syncDesktop);
    const syncXlDesktop = useNavigationStore((state) => state.syncXlDesktop);

    const syncDocsDesktop = useDocsNavigationStore((state) => state.syncDesktop);

    const syncDocsXlDesktop = useDocsNavigationStore((state) => state.syncXlDesktop);

    const desktop = useMediaQuery("(min-width: 1024px)");
    const xlDesktop = useMediaQuery("(min-width: 1224px)");

    useEffect(() => {
        if (desktop === undefined || xlDesktop === undefined) return;

        syncDesktop(desktop);
        syncXlDesktop(xlDesktop);

        syncDocsDesktop(desktop);
        syncDocsXlDesktop(xlDesktop);
    }, [desktop, xlDesktop, syncDesktop, syncXlDesktop, syncDocsDesktop, syncDocsXlDesktop]);

    return null;
}
