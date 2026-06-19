"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { CreateDeployConfig } from "@/convex/types";
import { useDeployments } from "@/hooks/use-deployments";
import { cn } from "@/lib/utils";
import { useDeployDialogStore } from "@/stores/deploy-dialog-store";

type DeployDialogItem = CreateDeployConfig[number] & {
	isNew: boolean;
};

export function DeployDialog() {
	const { deployments, deployVersion } = useDeployments();

	const { isOpen, version, close } = useDeployDialogStore();

	const [isDeploying, setIsDeploying] = useState(false);
	const [abTesting, setAbTesting] = useState(false);

	const activeDeployment = useMemo(() => deployments.find((deployment) => deployment?.active) ?? null, [deployments]);

	const hasExistingDeployment =
		!!activeDeployment &&
		!(activeDeployment.config.length === 1 && activeDeployment.config[0]?.versionId === version?._id);

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

	// Reset A/B state + config when the dialog opens or the version changes.
	useEffect(() => {
		if (!isOpen || !version) {
			return;
		}

		setAbTesting(false);
		setConfig(simpleConfig);
	}, [isOpen, version, simpleConfig]);

	const totalTraffic = useMemo(() => config.reduce((sum, item) => sum + item.traffic, 0), [config]);

	const remainingTraffic = Math.max(0, 100 - totalTraffic);

	const enableABTesting = (enabled: boolean) => {
		if (!activeDeployment || !version) {
			return;
		}

		if (!enabled) {
			setAbTesting(false);
			setConfig(simpleConfig);
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
				config: abTesting ? config.map(({ isNew, ...item }) => item) : simpleConfig.map(({ isNew, ...item }) => item),
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
						{abTesting ? "Split traffic between deployed versions." : `Deploy v${version.sequence}.`}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{!abTesting ? (
						<>
							<div className="rounded-xl border bg-muted/20 p-4">
								<div className="mb-3 text-sm font-medium">New Deployment</div>

								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Version</span>
									<span className="font-medium">v{version.sequence}</span>
								</div>
							</div>

							{hasExistingDeployment && (
								<div className="flex items-center justify-between rounded-xl border p-4">
									<div>
										<div className="text-sm font-medium">Enable A/B Testing</div>
										<div className="text-xs text-muted-foreground">
											Split traffic with the current deployment instead of replacing it.
										</div>
									</div>

									<Switch checked={abTesting} onCheckedChange={enableABTesting} disabled={isDeploying} />
								</div>
							)}
						</>
					) : (
						<>
							<div className="flex items-center justify-between rounded-xl border p-4">
								<div>
									<div className="text-sm font-medium">Enable A/B Testing</div>
									<div className="text-xs text-muted-foreground">Split traffic between deployed versions.</div>
								</div>

								<Switch checked={abTesting} onCheckedChange={enableABTesting} disabled={isDeploying} />
							</div>

							<div className={cn("space-y-5 transition-opacity", isDeploying && "pointer-events-none opacity-60")}>
								{config.map((item) => (
									<div key={item.versionId} className="flex items-center gap-3">
										<div className="w-10 shrink-0 text-sm font-medium">v{item.sequence}</div>

										<Slider
											value={[item.traffic]}
											min={0}
											max={100}
											step={1}
											disabled={isDeploying}
											onValueChange={([value]) => {
												if (value !== undefined) {
													handleTrafficChange(item.versionId, value);
												}
											}}
											className="flex-1"
										/>

										<div className="w-12 text-right text-sm text-muted-foreground">{item.traffic}%</div>
									</div>
								))}
							</div>

							<div className="flex items-center justify-between border-t pt-4">
								<span className="text-xs text-muted-foreground">Remaining: {remainingTraffic}%</span>

								<span
									className={cn("text-xs font-medium", totalTraffic === 100 ? "text-emerald-600" : "text-amber-600")}
								>
									Total: {totalTraffic}%
								</span>
							</div>
						</>
					)}

					<Button
						onClick={handleDeploy}
						loading={isDeploying}
						disabled={abTesting && totalTraffic !== 100}
						className="w-full"
					>
						{isDeploying ? "Deploying..." : `Deploy v${version.sequence}`}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
