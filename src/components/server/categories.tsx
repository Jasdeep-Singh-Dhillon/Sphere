"use client";

import { AudioLines, ChevronRight, Hash, Plus } from "lucide-react";

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
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "convex/_generated/dataModel";
import { CreateChannelDialog } from "../dialogs/create-channel";
import { useContext } from "react";
import { AuthContext } from "../auth/auth-context";

export function Categories() {
  const params = useParams();
  if (!params.serverid) {
    redirect("/channels");
  }
  const user = useContext(AuthContext);
  const serverid = params.serverid as Id<"servers">;
  if (!user) redirect("/login");
  const categories = useQuery(api.servers.getCategories, {
    serverid: serverid,
    userid: user.id,
  });

  const channelid = params.channelid as Id<"channels">;

  return (
    <div>
      {categories?.map((category) => {
        if (category)
          return (
            <Collapsible
              defaultOpen={true}
              key={category?._id}
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
                          <SidebarMenuSubItem key={channel.id} className="my-1">
                            <SidebarMenuSubButton
                              asChild
                              className={`${channel.id === channelid ? "bg-accent hover:bg-accent/70" : ""} `}
                            >
                              <Link
                                href={
                                  channel.type === "text"
                                    ? `/channels/${params.serverid}/${channel.id}`
                                    : `/channels/${params.serverid}/${channel.id}`
                                }
                              >
                                {channel.type === "voice" ? (
                                  <AudioLines />
                                ) : (
                                  <Hash />
                                )}
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
          );
      })}
    </div>
  );
}
