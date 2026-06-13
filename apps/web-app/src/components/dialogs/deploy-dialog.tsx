"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { Loader2 } from "lucide-react";

import { useDeployments } from "@/hooks/use-deployments";

import { CreateDeployConfig } from "@/convex/types";

import { useDeployDialogStore } from "@/stores/deploy-dialog-store";

import { cn } from "@/lib/utils";

type DeployDialogItem = CreateDeployConfig[number] & {
    isNew: boolean;
};

export function DeployDialog() {
    const { deployments, deployVersion } = useDeployments();

    const { isOpen, version, close } = useDeployDialogStore();

    const [isDeploying, setIsDeploying] = useState(false);
    const [abTesting, setAbTesting] = useState(false);

    const activeDeployment = deployments.find((deployment) => deployment.active);

    const hasExistingDeployment =
        !!activeDeployment &&
        !(
            activeDeployment.config.length === 1 &&
            activeDeployment.config[0]?.versionId === version?._id
        );

    const simpleConfig = useMemo<DeployDialogItem[]>(() => {
        if (!version) {
            return [];
        }

        return [
            {
                versionId: version._id,
                sequence: version.sequence,
                traffic: 100,
                isNew: true,
            },
        ];
    }, [version]);

    const [config, setConfig] = useState<DeployDialogItem[]>([]);

    useEffect(() => {
        if (!isOpen || !version) {
            return;
        }

        setAbTesting(false);
        setConfig(simpleConfig);
    }, [isOpen, version, simpleConfig]);

    const totalTraffic = useMemo(
        () => config.reduce((sum, item) => sum + item.traffic, 0),
        [config],
    );

    const remainingTraffic = Math.max(0, 100 - totalTraffic);

    const enableABTesting = () => {
        if (!activeDeployment || !version) {
            return;
        }

        const currentConfig = activeDeployment.config;

        const nextConfig: DeployDialogItem[] = [
            ...currentConfig
                .filter((item) => item.versionId !== version._id)
                .map((item) => ({
                    versionId: item.versionId,
                    sequence: item.sequence,
                    traffic: item.traffic,
                    isNew: false,
                })),
            {
                versionId: version._id,
                sequence: version.sequence,
                traffic: 0,
                isNew: true,
            },
        ].sort((a, b) => a.sequence - b.sequence);

        setConfig(nextConfig);
        setAbTesting(true);
    };

    const handleTrafficChange = (versionId: string, requestedValue: number) => {
        if (isDeploying) {
            return;
        }

        setConfig((prev) => {
            const current = prev.find((item) => item.versionId === versionId);

            if (!current) {
                return prev;
            }

            const currentTotal = prev.reduce((sum, item) => sum + item.traffic, 0);

            let nextValue = requestedValue;

            const delta = nextValue - current.traffic;

            if (delta > 0) {
                const remaining = 100 - currentTotal;

                nextValue = current.traffic + Math.min(delta, Math.max(remaining, 0));
            }

            return prev.map((item) =>
                item.versionId === versionId
                    ? {
                          ...item,
                          traffic: nextValue,
                      }
                    : item,
            );
        });
    };

    const handleDeploy = async () => {
        if (isDeploying) {
            return;
        }

        if (abTesting && totalTraffic !== 100) {
            return;
        }

        try {
            setIsDeploying(true);

            await deployVersion({
                env: "production",
                config: config.map(({ isNew, ...item }) => item),
            });

            close();
        } finally {
            setIsDeploying(false);
        }
    };

    if (!version) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isDeploying && close()}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Deploy Version</DialogTitle>

                    <DialogDescription>
                        {abTesting
                            ? "Split traffic between deployed versions."
                            : hasExistingDeployment
                              ? `Deploy v${version.sequence} or create an A/B test against the current deployment.`
                              : `Deploy v${version.sequence} to production.`}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {!abTesting ? (
                        <>
                            <div className="rounded-xl border bg-muted/20 p-4">
                                <div className="mb-4 text-sm font-medium">New Deployment</div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 text-sm font-medium">
                                        v{version.sequence}
                                    </div>

                                    <Slider value={[100]} disabled className="flex-1" />

                                    <div className="w-12 text-right text-sm text-muted-foreground">
                                        100%
                                    </div>
                                </div>
                            </div>

                            {hasExistingDeployment && (
                                <Button
                                    variant="outline"
                                    onClick={enableABTesting}
                                    disabled={isDeploying}
                                    className="w-full"
                                >
                                    Enable A/B Testing
                                </Button>
                            )}
                        </>
                    ) : (
                        <>
                            <div
                                className={cn(
                                    "space-y-5 transition-opacity",
                                    isDeploying && "pointer-events-none opacity-60",
                                )}
                            >
                                {config.map((item) => (
                                    <div key={item.versionId} className="flex items-center gap-3">
                                        <div className="w-10 shrink-0 text-sm font-medium">
                                            v{item.sequence}
                                        </div>

                                        <Slider
                                            value={[item.traffic]}
                                            min={0}
                                            max={100}
                                            step={1}
                                            disabled={isDeploying}
                                            onValueChange={([value]) =>
                                                handleTrafficChange(item.versionId, value)
                                            }
                                            className="flex-1"
                                        />

                                        <div className="w-12 text-right text-sm text-muted-foreground">
                                            {item.traffic}%
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between border-t pt-4">
                                <span className="text-xs text-muted-foreground">
                                    Remaining: {remainingTraffic}%
                                </span>

                                <span
                                    className={cn(
                                        "text-xs font-medium",
                                        totalTraffic === 100
                                            ? "text-emerald-600"
                                            : "text-amber-600",
                                    )}
                                >
                                    Total: {totalTraffic}%
                                </span>
                            </div>
                        </>
                    )}

                    <Button
                        onClick={handleDeploy}
                        disabled={isDeploying || (abTesting && totalTraffic !== 100)}
                        className="w-full"
                    >
                        {isDeploying ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Deploying...
                            </>
                        ) : (
                            `Deploy v${version.sequence}`
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
