"use client";

import * as React from "react";
import { EllipsisVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import {
  DoorOpen,
  FolderPlus,
  MailPlus,
  Settings,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CreateCategoryDialog } from "../dialogs/create-category";
import { Button } from "../ui/button";

export function ServerOptions() {
  const { isMobile } = useSidebar();
  const params = useParams();
  const serverid = params.serverid as Id<"servers">;
  const server = useQuery(api.query.getServerInfo, { serverid });

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
      name: "Create Category",
      logo: FolderPlus,
      component: CreateCategoryDialog,
    },
    {
      name: "Leave Server",
      logo: DoorOpen,
    },
  ];
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={server?.serverIcon} />
                <AvatarFallback className="rounded-lg"></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{server?.name}</span>
              </div>
              <EllipsisVertical className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <CreateCategoryDialog>
            <Button variant={"outline"} className="w-full mt-2">
              <FolderPlus /> Create Category
            </Button>
          </CreateCategoryDialog>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {serverOptions.map((option) => (
              <DropdownMenuItem key={option.name} className=" p-2">
                {option?.component ? (
                  <option.component>
                    <div className="flex gap-2 items-center justify-center">
                      <div className="flex size-6 items-center justify-center rounded-md border">
                        <option.logo className="size-3.5 shrink-0" />
                      </div>
                      {option.name}
                    </div>
                  </option.component>
                ) : (
                  <div className="flex gap-2 items-center justify-center">
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <option.logo className="size-3.5 shrink-0" />
                    </div>
                    {option.name}
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
