// src/app/home/layout.tsx

import { Header } from "@/components/layout/Header";
import { LeftSidebar } from "@/components/layout/sidebar/left-sidebar";
import { RightSidebar } from "@/components/layout/sidebar/right-sidebar";

import { Dialogs } from "./dialogs";

import { ConvexClientProvider } from "@/providers/convex-client";
import { HomeProvider } from "@/providers/home-provider";
import { InitializeHooks } from "@/providers/InitializeHooks";

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <ConvexClientProvider>
            <HomeProvider>
                <Dialogs />
                <InitializeHooks />
                <div className="relative h-screen overflow-hidden">
                    <Header />
                    <div className="flex h-full w-full">
                        <LeftSidebar />
                        <main className="min-w-0 flex-1">{children}</main>
                        <RightSidebar />
                    </div>
                </div>
            </HomeProvider>
        </ConvexClientProvider>
    );
}
