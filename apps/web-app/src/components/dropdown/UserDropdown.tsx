"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogoutIcon } from "@/components/ui/icons";

export function UserDropdown() {
    const { user } = useUser();
    const { signOut } = useClerk();

    if (!user) return null;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="group flex h-9 w-full items-center justify-start rounded-full border border-border bg-background/80 p-1.5 font-normal backdrop-blur-2xl hover:bg-foreground/10"
                >
                    <div className="relative h-7 w-7 overflow-hidden rounded-full border border-border">
                        <Image
                            src={user.imageUrl}
                            alt={user.fullName?.charAt(0).toUpperCase() || "U"}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="min-w-0 text-left">
                        <p className="truncate text-[12.5px] font-normal">{user.fullName}</p>
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                sideOffset={12}
                className="z-10 w-64 overflow-hidden rounded-[22px] bg-background/80 p-0 backdrop-blur-2xl"
            >
                <div className="p-1">
                    <Button
                        variant="destructive"
                        onClick={() => signOut({ redirectUrl: "/" })}
                        className="h-9 w-full justify-start rounded-full border border-transparent text-[12.5px] font-normal text-destructive hover:border-destructive/20 hover:bg-destructive/15 hover:text-destructive"
                    >
                        <LogoutIcon className="size-4" />
                        <span>Logout</span>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
