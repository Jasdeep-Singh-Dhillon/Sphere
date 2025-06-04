"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  CirclePlus,
  DoorOpen,
  FolderPlus,
  MailPlus,
  Settings,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { Categories } from "@/components/categories";
import { SidebarUser } from "@/components/sidebar-user";
import { ServerOptions } from "@/components/server-options";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const user = {
  name: "Arc",
  email: "arc@mail.com",
  avatar: "link",
};
const serverOptions = [
  {
    name: "Invite People",
    logo: MailPlus,
  },
  {
    name: "Server Settings",
    logo: Settings,
  },
  {
    name: "Create Channel",
    logo: CirclePlus,
  },
  {
    name: "Create Category",
    logo: FolderPlus,
  },
  {
    name: "Leave Server",
    logo: DoorOpen,
  },
];
const categories = [
  {
    id: "1",
    title: "Playground",
    icon: SquareTerminal,
    isActive: true,
    channels: [
      {
        id: "1",
        title: "History",
        url: "#",
      },
      {
        id: "2",
        title: "Starred",
        url: "#",
      },
      {
        id: "3",
        title: "Settings",
        url: "#",
      },
    ],
  },
  {
    id: "2",
    title: "Models",
    icon: Bot,
    channels: [
      {
        id: "4",
        title: "Genesis",
        url: "#",
      },
      {
        id: "5",
        title: "Explorer",
        url: "#",
      },
      {
        id: "6",
        title: "Quantum",
        url: "#",
      },
    ],
  },
  {
    id: "3",
    title: "Documentation",
    icon: BookOpen,
    channels: [
      {
        id: "7",
        title: "Introduction",
        url: "#",
      },
      {
        id: "8",
        title: "Get Started",
        url: "#",
      },
      {
        id: "9",
        title: "Tutorials",
        url: "#",
      },
      {
        id: "10",
        title: "Changelog",
        url: "#",
      },
    ],
  },
  {
    id: "4",
    title: "Settings",
    icon: Settings2,
    channels: [
      {
        id: "11",
        title: "General",
        url: "#",
      },
      {
        id: "12",
        title: "Team",
        url: "#",
      },
      {
        id: "13",
        title: "Billing",
        url: "#",
      },
      {
        id: "14",
        title: "Limits",
        url: "#",
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar  {...props}>
      <SidebarHeader>
        <ServerOptions serverOptions={serverOptions} />
      </SidebarHeader>
      <SidebarContent>
        <Categories categories={categories} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
