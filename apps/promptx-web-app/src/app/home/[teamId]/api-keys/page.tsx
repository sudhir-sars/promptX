"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useApiKeys } from "@/hooks/use-api-keys";
import { Id } from "@/convex/_generated/dataModel";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";

export type CreateApiKeyResult = FunctionReturnType<typeof api.actions.apiKey.create>;

export default function ApiKeysPage() {
    const { activeApiKeys, revokedApiKeys, createApiKey, revokeApiKey } = useApiKeys();

    const [createdKey, setCreatedKey] = useState<CreateApiKeyResult | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [revokingKeyId, setRevokingKeyId] = useState<string | null>(null);
    const [isCopying, setIsCopying] = useState(false);

    const handleCreate = async () => {
        try {
            setIsCreating(true);

            const result = await createApiKey();

            setCreatedKey(result);

            toast.success("API key created");
        } catch {
            toast.error("Failed to create API key");
        } finally {
            setIsCreating(false);
        }
    };

    const handleRevoke = async (keyId: Id<"apiKeys">) => {
        try {
            setRevokingKeyId(keyId);
            await revokeApiKey(keyId);

            toast.success("API key revoked");
        } catch {
            toast.error("Failed to revoke API key");
        } finally {
            setRevokingKeyId(null);
        }
    };

    const handleCopy = async () => {
        if (!createdKey) return;

        try {
            setIsCopying(true);

            await navigator.clipboard.writeText(createdKey.key);
            setCreatedKey(null);

            toast.success("API key copied");
        } catch {
            toast.error("Failed to copy API key");
        } finally {
            setIsCopying(false);
        }
    };

    return (
        <>
            <div className="h-full flex-1 space-y-7 overflow-y-auto no-scrollbar px-6 py-20 md:px-10 lg:px-16 transition-all duration-300 ease-in-out">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">API Keys</h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage API keys for accessing the platform programmatically.
                        </p>
                    </div>

                    <Button variant="outline" onClick={handleCreate} disabled={isCreating}>
                        {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isCreating ? "Generating..." : "Generate Key"}
                    </Button>
                </div>

                <div className="rounded-4xl border p-4">
                    <p className="text-sm">API keys inherit the permissions of your account.</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Keep keys secure and revoke any key that is no longer needed.
                    </p>
                </div>

                <div className="mt-6 space-y-6">
                    <section className="overflow-hidden rounded-4xl border">
                        <div className="p-5">
                            {activeApiKeys.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No active API keys.</p>
                            ) : (
                                <div className="space-y-3">
                                    {activeApiKeys.map((key) => {
                                        const isRevoking = revokingKeyId === key._id;

                                        return (
                                            <div
                                                key={key._id}
                                                className="flex items-center justify-between rounded-3xl border p-4"
                                            >
                                                <div>
                                                    <p className="font-mono text-sm">{key.keyId}</p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {key.prefix}••••••••••••
                                                    </p>
                                                </div>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    disabled={isRevoking}
                                                    onClick={() => handleRevoke(key._id)}
                                                >
                                                    {isRevoking && (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    )}
                                                    {isRevoking ? "Revoking..." : "Revoke"}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>

                    {revokedApiKeys.length > 0 && (
                        <section className="overflow-hidden rounded-4xl border">
                            <div className="p-5">
                                <div className="space-y-3">
                                    {revokedApiKeys.map((key) => (
                                        <div
                                            key={key._id}
                                            className="flex items-center justify-between rounded-3xl border bg-muted/30 p-4 opacity-70"
                                        >
                                            <div>
                                                <p className="font-mono text-sm">{key.keyId}</p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {key.prefix}••••••••••••
                                                </p>
                                            </div>

                                            <span className="text-xs text-muted-foreground">
                                                Revoked
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <Dialog
                open={!!createdKey}
                onOpenChange={(open) => {
                    if (!open) {
                        setCreatedKey(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-2xl rounded-4xl">
                    <DialogHeader>
                        <DialogTitle>API Key Created</DialogTitle>

                        <DialogDescription>
                            This secret will only be shown once. Copy it now and store it securely.
                        </DialogDescription>
                    </DialogHeader>

                    {createdKey && (
                        <div className="space-y-5">
                            <div
                                onClick={handleCopy}
                                className="mt-1 rounded-3xl border bg-muted p-4 cursor-grab"
                            >
                                <code className="break-all text-xs">{createdKey.key}</code>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={handleCopy} disabled={isCopying}>
                                    {isCopying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isCopying ? "Copying..." : "Copy Key"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
