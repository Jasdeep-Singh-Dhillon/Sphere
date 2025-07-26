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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ServerList from "./server-list";
import { Button } from "../ui/button";
import { CreateServerDialog } from "../dialogs/create-server";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";

export function AppSidebar() {
  const params = useParams();

  return (
    <Sidebar>
      <Tabs
        defaultValue={`${params.serverid ? "channels" : "servers"}`}
        className="w-full h-full gap-0"
      >
        <SidebarHeader>
          <TabsList className="w-full">
            <TabsTrigger value="servers">Servers</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
          </TabsList>
        </SidebarHeader>

        <SidebarContent>
          <TabsContent value="servers" className="flex flex-col h-full m-2">
            <ServerList />
            <CreateServerDialog>
              <Button variant={"ghost"} className="hover:bg-secondary">
                <Plus /> Create Server
              </Button>
            </CreateServerDialog>
          </TabsContent>
          <TabsContent value="channels" className="m-2">
            {params.serverid ? (
              <>
                <ServerOptions />
                <Categories />
              </>
            ) : (
              <div className="h-full content-center w-full text-center">Select a server</div>
            )}
          </TabsContent>
        </SidebarContent>
        <SidebarFooter>
          <SidebarUser />
        </SidebarFooter>
        <SidebarRail />
      </Tabs>
    </Sidebar>
  );
}
