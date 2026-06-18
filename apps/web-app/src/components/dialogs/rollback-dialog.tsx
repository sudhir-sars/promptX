"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Id } from "@/convex/_generated/dataModel";
import { useDeployments } from "@/hooks/use-deployments";
import { getRelativeTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useRollbackDialogStore } from "@/stores/rollback-dialog-store";

export function RollbackDialog() {
	const { deployments, rollbackDeployment } = useDeployments();

	const { isOpen, close } = useRollbackDialogStore();

	const [selectedId, setSelectedId] = useState<Id<"deployments"> | null>(null);
	const [isRollingBack, setIsRollingBack] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setSelectedId(null);
		}
	}, [isOpen]);

	// Previous (non-active) deployments that can be restored.
	const candidates = useMemo(() => deployments.filter((deployment) => !deployment.active), [deployments]);

	const hasActive = useMemo(() => deployments.some((deployment) => deployment.active), [deployments]);

	const handleRollback = async () => {
		if (!selectedId || isRollingBack) {
			return;
		}

		try {
			setIsRollingBack(true);

			const ok = await rollbackDeployment(selectedId);

			if (ok) {
				toast.success("Deployment rolled back");
				close();
			}
		} finally {
			setIsRollingBack(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && !isRollingBack && close()}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Rollback Deployment</DialogTitle>

					<DialogDescription>
						Restore a previously deployed version. This replaces the current active deployment.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-5">
					<div className="max-h-72 space-y-2 overflow-y-auto no-scrollbar">
						{candidates.length === 0 ? (
							<div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
								No previous deployments to roll back to.
							</div>
						) : (
							candidates.map((deployment) => {
								const isSelected = deployment._id === selectedId;

								return (
									<button
										key={deployment._id}
										type="button"
										onClick={() => setSelectedId(deployment._id)}
										disabled={isRollingBack}
										className={cn(
											"flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors",
											isSelected ? "border-foreground bg-muted/40" : "hover:bg-muted/30 disabled:hover:bg-transparent",
										)}
									>
										<div className="flex flex-wrap gap-1.5">
											{deployment.config.map((variant) => (
												<span
													key={variant.versionId}
													className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium"
												>
													v{variant.sequence}
													<span className="ml-1 text-muted-foreground">{variant.traffic}%</span>
												</span>
											))}
										</div>

										<span className="shrink-0 text-xs text-muted-foreground">
											{getRelativeTime(deployment._creationTime)}
										</span>
									</button>
								);
							})
						)}
					</div>

					{!hasActive && candidates.length > 0 && (
						<p className="text-xs text-amber-600">There is no active deployment to replace.</p>
					)}

					<Button onClick={handleRollback} disabled={!selectedId || isRollingBack || !hasActive} className="w-full">
						{isRollingBack ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Rolling back...
							</>
						) : (
							"Confirm Rollback"
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
