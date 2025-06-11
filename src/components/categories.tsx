"use client";

import { ChevronRight, MessagesSquare, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function Categories({
  categories,
}: {
  categories: {
    id: string;
    title: string;
    icon: LucideIcon;
    isActive?: boolean;
    channels?: {
      id: string;
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      {categories.map((category) => (
        <Collapsible key={category.id} defaultOpen={true} >
          <SidebarMenuItem className="list-none">
            {category.channels?.length ? (
              <>
                <CollapsibleTrigger className="w-full">
                  <SidebarMenuButton asChild>
                    <span>{category.title}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {category?.channels.map((channel) => (
                      <SidebarMenuSubItem key={channel.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/hub/${channel.id}`}><MessagesSquare/>{channel.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </>
            ) : null}
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarGroup>
  );
}
