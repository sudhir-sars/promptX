import type { ComponentType } from "react";

import {
  ActivityIcon,
  APIKeyIcon,
  DeployIcon,
  HomeIcon,
  MembersIcon,
  ObservabilityIcon,
  SettingsIcon,
  StudioIcon,
  VersionsIcon,
} from "@/components/ui/icons";

type SidebarItem = {
  label: string;
  href: string;
  shortcut?: boolean;
  icon: ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
};

type SidebarSection = {
  items: SidebarItem[];
};

type SidebarConfig = {
  backLink?: {
    href: string;
    label: string;
  };

  sections: SidebarSection[];
};

export function getSidebarConfig(teamId?: string, promptId?: string): SidebarConfig {
  if (teamId && promptId) {
    return {
      backLink: {
        href: `/home/${teamId}`,
        label: "Home",
      },

      sections: [
        {
          items: [
            {
              label: "Studio",
              href: `/home/${teamId}/${promptId}`,
              icon: StudioIcon,
            },
            {
              label: "Versions",
              href: `/home/${teamId}/${promptId}/versions`,
              icon: VersionsIcon,
            },
            {
              label: "Deployments",
              href: `/home/${teamId}/${promptId}/deployments`,
              icon: DeployIcon,
            },
            {
              label: "Analytics",
              href: `/home/${teamId}/${promptId}/analytics`,
              icon: ObservabilityIcon,
            },
            {
              label: "Settings",
              href: `/home/${teamId}/${promptId}/settings`,
              icon: SettingsIcon,
            },
          ],
        },
      ],
    };
  }

  return {
    sections: [
      {
        items: [
          {
            label: "Home",
            href: `/home/${teamId}`,
            icon: HomeIcon,
          },

          {
            label: "Members",
            href: `/home/${teamId}/members`,
            icon: MembersIcon,
          },
          {
            label: "Activity",
            href: `/home/${teamId}/activity`,
            icon: ActivityIcon,
          },
          {
            label: "API Keys",
            href: `/home/${teamId}/api-keys`,
            icon: APIKeyIcon,
          },
          {
            label: "Settings",
            href: `/home/${teamId}/settings`,
            icon: SettingsIcon,
          },
        ],
      },
    ],
  };
}
