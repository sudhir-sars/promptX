import type { ReactNode } from "react";

import type { Id } from "@/convex/_generated/dataModel";

import { PromptProvider } from "@/providers/prompt-provider";

type PromptLayoutProps = {
    children: ReactNode;

    params: Promise<{
        promptId: string;
    }>;
};

export default async function PromptLayout({ children, params }: PromptLayoutProps) {
    const { promptId } = await params;

    return <PromptProvider promptId={promptId as Id<"prompts">}>{children}</PromptProvider>;
}
