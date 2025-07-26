"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { CreateServerDialog } from "~/components/dialogs/create-server";
import { useContext } from "react";
import { AuthContext } from "~/components/auth/auth-context";

function ServerCards({ userid }: { userid: string }) {
  const servers = useQuery(api.query.getJoinedServers, { userid });
  const username = useQuery(api.query.getUsername, { userid });
  if (username === "") {
    redirect("/onboarding");
  }
  if (servers?.length) {
    return (
      <div className="flex flex-wrap justify-center gap-2 m-4">
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
                  src={
                    // server?.serverIcon ||
                    "/images/server_image_placeholder.svg"
                  }
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
  const user = useContext(AuthContext);
  console.log(user);
  return (
    <div className="w-full h-full">
      {user ? (
        <>
          <ServerCards userid={user.id} />
          <CreateServerDialog>
            <Button
              variant={"accent"}
              className="absolute bottom-0 right-0 m-2"
            >
              <Plus /> Create Server
            </Button>
          </CreateServerDialog>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
