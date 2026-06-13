"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ArrowUpIcon, CloseIcon } from "@/components/ui/icons";

import { useDocsNavigationStore } from "@/stores/docs-navigation-store";

import { docsConfig } from "./config";

export function DocsLeftSidebar() {
  const pathname = usePathname();

  const desktop = useDocsNavigationStore((state) => state.desktop);
  const leftSidebarOpen = useDocsNavigationStore((state) => state.leftSidebarOpen);
  const navigate = useDocsNavigationStore((state) => state.navigate);

  const sidebarClasses = desktop
    ? "relative w-72 shrink-0"
    : `fixed inset-y-0 left-0 z-50 w-72 bg-background transition-transform duration-300 ${
        leftSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`;

  return (
    <>
      {!desktop && leftSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() =>
            navigate({
              leftSidebarOpen: false,
            })
          }
        />
      )}

      <aside className={sidebarClasses}>
        {!desktop && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 top-4 z-[120]"
            onClick={() =>
              navigate({
                leftSidebarOpen: false,
              })
            }
          >
            <CloseIcon />
          </Button>
        )}

        <div className="absolute bottom-[20vh] right-0 top-[20vh] w-px bg-gradient-to-b from-transparent via-border to-transparent" />

        <div className="flex h-screen flex-col px-10">
          <div
            className="flex-1 overflow-y-auto no-scrollbar"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
          >
            <nav className="flex flex-col pb-24 pt-24">
              {docsConfig.sections.map((section, sectionIndex) => (
                <div
                  key={section.items[0]?.href ?? sectionIndex}
                  className={sectionIndex > 0 ? "mt-6" : ""}
                >
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          if (!desktop) {
                            navigate({
                              leftSidebarOpen: false,
                            });
                          }
                        }}
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
      </aside>
    </>
  );
}
