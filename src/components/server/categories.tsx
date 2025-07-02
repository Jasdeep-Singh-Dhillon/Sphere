"use client";

import { ChevronRight, Hash, Plus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { CreateChannelDialog } from "../dialogs/create-channel";

export function Categories() {
  const params = useParams();
  if (!params.serverid) {
    redirect("/channels");
  }
  const serverid = params.serverid as Id<"servers">;
  const categories = useQuery(api.query.getCategories, {
    id: serverid,
  });

  return (
    <>
      {categories?.map((category) => (
        <Collapsible
          defaultOpen={true}
          key={category._id}
          className="list-none group/collapsible"
        >
          <SidebarGroup>
            {category.channels ? (
              <>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="w-full">
                    <span className="flex items-center gap-2 [&>svg]:size-4 [&>svg]:shrink-0">
                      {category.name}
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </span>
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CreateChannelDialog
                  categoryid={category._id}
                  serverid={serverid}
                >
                  <SidebarGroupAction title="Add Channel">
                    <Plus /> <span className="sr-only">Create Channel</span>
                  </SidebarGroupAction>
                </CreateChannelDialog>

                <CollapsibleContent className="mb-2">
                  <SidebarGroupContent>
                    {category?.channels.map((channel) => (
                      <SidebarMenuSubItem key={channel.id}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={`/channels/${params.serverid}/${channel.id}`}
                          >
                            <Hash />
                            {channel.name}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarGroupContent>
                </CollapsibleContent>
              </>
            ) : null}
          </SidebarGroup>
        </Collapsible>
      ))}
    </>
  );
}
