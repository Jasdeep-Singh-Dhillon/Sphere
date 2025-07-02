"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "~/lib/auth-client";
import { redirect } from "next/navigation";

function ServerCards({ userid }: { userid: string }) {
  const servers = useQuery(api.query.getJoinedServers, { userid });
  if (servers?.length) {
    return (
      <div className="grid grid-flow-col gap-4 auto-cols-max m-4">
        {servers?.map((server) => (
          <Link
            href={`/channels/${server?._id}`}
            key={server?._id}
            className="w-80 "
          >
            <Card className="h-full hover:shadow-2xl hover:shadow-primary/10 transition delay-100">
              {
                <Image
                  width={400}
                  height={200}
                  src={"/images/server_image_placeholder.svg"}
                  alt={`${server?.name}`}
                  className="w-full h-[200] object-cover rounded-tl-lg rounded-tr-lg "
                />
              }
              <CardHeader>
                <CardTitle>{server?.name}</CardTitle>
              </CardHeader>
              <CardContent>{server?.description}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  } else {
    return (
      <div className="grid place-content-center p-12">No Joined Servers</div>
    );
  }
}

export default function Servers() {
  const { data, isPending } = useSession();
  if (!isPending && !data) {
    redirect("/login");
  }
  return (
    <div className="w-full h-full">
      {isPending ? (
        <>Loading...</>
      ) : data?.user ? (
        <ServerCards userid={data.user.id} />
      ) : (
        ""
      )}
    </div>
  );
}
