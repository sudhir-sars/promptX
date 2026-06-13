import type { ReactNode } from "react";

import { DocsHeader } from "@/components/docs/header";
import { DocsLeftSidebar } from "@/components/docs/sidebar/leftsidebar";
import { DocsRightSidebar } from "@/components/docs/sidebar/rightsidebar";
import { InitializeHooks } from "@/providers/InitializeHooks";

export default function DocsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative h-screen overflow-hidden">
            <InitializeHooks />
            <DocsHeader />

            <div className="flex h-full w-full">
                <DocsLeftSidebar />

                <main className="min-w-0 flex-1 overflow-hidden">{children}</main>

                <DocsRightSidebar />
            </div>
        </div>
    );
}
