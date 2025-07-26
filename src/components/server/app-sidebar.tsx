"use client";

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

export function AppSidebar({
  user,
}: {
  user:
    | {
        name: string;
        email: string;
        image?: string;
      }
    | undefined;
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <ServerOptions />
      </SidebarHeader>

      <SidebarContent>
        <Categories />
      </SidebarContent>

      <SidebarFooter>
        <SidebarUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
