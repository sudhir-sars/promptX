"use client";

import Link from "next/link";

import { TeamSwitcher } from "@/components/dropdown/teams";
import { UserDropdown } from "@/components/dropdown/UserDropdown";

import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ChevronLeftIcon, CloseIcon } from "@/components/ui/icons";

import { useNavigationStore } from "@/stores/navigation-store";

import { getSidebarConfig } from "./config";

export function LeftSidebar() {
  const desktop = useNavigationStore((state) => state.desktop);
  const leftSidebarOpen = useNavigationStore((state) => state.leftSidebarOpen);
  const navigate = useNavigationStore((state) => state.navigate);
  const teamId = useNavigationStore((state) => state.teamId);
  const promptId = useNavigationStore((state) => state.promptId);
  const tab = useNavigationStore((state) => state.tab);

  const config = getSidebarConfig(teamId, promptId);

  const sidebarClasses = desktop
    ? "relative shrink-0 w-72"
    : `fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ${
        leftSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`;

  return (
    <>
      {!desktop && leftSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => navigate({ leftSidebarOpen: false })}
        />
      )}

      <aside className={`${sidebarClasses} overflow-hidden bg-background`}>
        {!desktop && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 top-4 z-[120]"
            onClick={() => navigate({ leftSidebarOpen: false })}
          >
            <CloseIcon />
          </Button>
        )}

        <div className="absolute right-0 top-[20vh] bottom-[20vh] w-px bg-gradient-to-b from-transparent via-border to-transparent" />

        <div className="flex h-screen flex-col px-10 py-8">
          <div
            className="flex flex-1 items-center"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
          >
            <div className="w-full -mt-28">
              <div className="mb-8 h-9">
                {config.backLink && (
                  <Link
                    href={config.backLink.href}
                    className="group flex items-center gap-3 rounded-full border border-transparent px-5 py-2 text-[12.5px] text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted hover:text-foreground"
                  >
                    <ChevronLeftIcon
                      animate={false}
                      className="transition-transform duration-200 group-hover:-translate-x-1"
                    />
                    <span className="truncate">{config.backLink.label}</span>
                  </Link>
                )}
              </div>

              <nav className="flex w-full flex-col">
                {config.sections.map((section, sectionIndex) => (
                  <div
                    key={section.items[0]?.href ?? sectionIndex}
                    className={sectionIndex > 0 ? "mt-6" : ""}
                  >
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = tab === item.label;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group mb-1 flex items-center justify-between gap-3 rounded-full border px-5 py-2 text-[12.5px] transition-all duration-200 ${
                            active
                              ? "border-border bg-muted text-foreground"
                              : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon
                              size={20}
                              strokeWidth={1.9}
                              className={`shrink-0 transition-all duration-200 ${
                                active ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </span>

                          {item.shortcut && (
                            <ArrowUpIcon
                              size={16}
                              animate={false}
                              className={`shrink-0 rotate-45 transition-all duration-200 ${
                                active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              }`}
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          <div className="space-y-3 pt-4 ">
            <span className="lg:hidden">
              <TeamSwitcher />
            </span>
            <UserDropdown />
          </div>
        </div>
      </aside>
    </>
  );
}
