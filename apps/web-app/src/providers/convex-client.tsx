"use client";

import type { ReactNode } from "react";
import { RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { db } from "@/lib/convex/client";

function useClerkAuth() {
    const auth = useAuth();

    return {
        ...auth,
        getToken: async () =>
            auth.getToken({
                template: "convex",
            }),
    };
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ConvexProviderWithClerk client={db} useAuth={useClerkAuth}>
            <AuthLoading>
                <div />
            </AuthLoading>

            <Unauthenticated>
                <RedirectToSignIn />
            </Unauthenticated>

            <Authenticated>{children}</Authenticated>
        </ConvexProviderWithClerk>
    );
}
