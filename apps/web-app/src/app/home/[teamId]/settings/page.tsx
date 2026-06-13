"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EditIcon, TrashIcon } from "@/components/ui/icons";

import { useTeams } from "@/hooks/use-team";

import { useTeamDialogStore } from "@/stores/team-dialog-store";

export default function SettingsPage() {
    const { team, deleteTeam } = useTeams();

    const { openEdit } = useTeamDialogStore();

    if (!team) {
        return null;
    }

    return (
        <div className="h-full flex-1 space-y-7 overflow-y-auto no-scrollbar px-6 py-20 md:px-10 lg:px-16 transition-all duration-300 ease-in-out">
            <div className="mb-8">
                <h1 className="text-xl font-semibold">Team Settings</h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage team details and lifecycle.
                </p>
            </div>

            <div className="space-y-6">
                <section className="overflow-hidden rounded-4xl border">
                    <div className="space-y-5 p-5">
                        <div>
                            <div className="flex w-full items-center justify-between">
                                <div className="text-md ">{team.name}</div>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openEdit(team._id, team.name)}
                                >
                                    <EditIcon />
                                    Rename
                                </Button>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-muted-foreground">Members</div>

                            <p className="mt-1 text-sm font-medium">{team.meta.memberCount}</p>
                        </div>

                        <div>
                            <div className="text-xs text-muted-foreground">Prompts</div>

                            <p className="mt-1 text-sm font-medium">{team.meta.promptCount}</p>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-4xl space-y-4 border border-destructive/15 p-5">
                    <div>
                        <h2 className="text-sm font-medium text-destructive">Danger Zone</h2>
                    </div>

                    <div className="flex flex-col gap-4  md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium">Delete Team</p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Permanently remove this team, all prompts, versions, deployments,
                                members, invites, and associated history.
                            </p>
                        </div>

                        <Button
                            variant="destructive"
                            onClick={async () => {
                                const confirmed = confirm("Delete this team permanently?");

                                if (!confirmed) {
                                    return;
                                }

                                await deleteTeam({
                                    teamId: team._id,
                                });
                            }}
                        >
                            <TrashIcon />
                            Delete Team
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
