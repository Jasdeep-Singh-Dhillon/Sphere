"use client";

import {
  CirclePlus,
  DoorOpen,
  FolderPlus,
  MailPlus,
  Settings,
} from "lucide-react";

import { Categories } from "~/components/server/categories";
import { SidebarUser } from "~/components/server/sidebar-user";
import { ServerOptions } from "~/components/server/server-options";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";

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

export function AppSidebar({
  user,
}: {
  user: {
    name: string;
    email: string;
    image?: string;
  } | undefined;
}) {

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <ServerOptions serverOptions={serverOptions} />
      </SidebarHeader>

      {/* <Suspense fallback="Loading..."> */}
      <SidebarContent>
        <Categories />
      </SidebarContent>
      {/* </Suspense> */}

      <SidebarFooter>
        <SidebarUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
