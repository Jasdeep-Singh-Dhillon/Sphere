"use client";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "convex/_generated/dataModel";

import Chat from "~/components/channel/chat";
import Voice from "~/components/channel/voice";
import { Skeleton } from "~/components/ui/skeleton";

export default function Channel() {
  const params = useParams();
  const channelid = params.channelid as Id<"channels">;
  const channel = useQuery(api.channels.getInfo, { channelid });
  if(!channel) return <Skeleton className="m-4" />
  return channel?.type === "text" ? <Chat channel={channel} /> : <Voice channel={channel} />;
}
