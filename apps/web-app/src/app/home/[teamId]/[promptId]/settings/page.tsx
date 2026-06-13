"use client";

import { useEffect } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { EditIcon, TrashIcon } from "@/components/ui/icons";

import { usePrompts } from "@/hooks/use-prompt";

import { usePromptDialogStore } from "@/stores/prompt-dialog-store";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { prompt, deletePrompt } = usePrompts();
    const router = useRouter();

    const openEdit = usePromptDialogStore((state) => state.openEdit);

    if (!prompt) return null;

    return (
        <div className="h-full flex-1 space-y-7  overflow-y-auto no-scrollbar px-6 py-20 md:px-10 lg:px-16 transition-all duration-300 ease-in-out">
            <div className="mb-8">
                <h1 className="text-xl font-semibold">Prompt Settings</h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage prompt details and lifecycle.
                </p>
            </div>

            <div className="space-y-6">
                <section className="overflow-hidden rounded-4xl border">
                    <div className="p-5">
                        <div>
                            <div className="w-full flex justify-between">
                                <div className="text-xs text-muted-foreground">Name</div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openEdit(prompt._id, prompt.name)}
                                >
                                    <EditIcon />
                                    Rename
                                </Button>
                            </div>

                            <p className="mt-1 text-sm font-medium">{prompt.name}</p>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-4xl border border-destructive/15">
                    <div className="  px-5 py-3">
                        <h2 className="text-sm font-medium text-destructive">Danger Zone</h2>
                    </div>

                    <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium">Delete Prompt</p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Permanently remove this prompt, all versions, deployments, and
                                associated history.
                            </p>
                        </div>

                        <Button
                            variant="destructive"
                            onClick={async () => {
                                const confirmed = confirm("Delete this prompt permanently?");

                                if (!confirmed) return;

                                router.push(`/home/${prompt.teamId}`);
                                await deletePrompt(prompt._id);
                            }}
                        >
                            <TrashIcon />
                            Delete Prompt
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
