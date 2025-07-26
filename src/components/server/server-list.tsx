import { useContext, useState } from "react";
import { AuthContext } from "../auth/auth-context";
import { redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { SidebarGroup } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import InputIcon from "../ui/input-icon";
import { Search } from "lucide-react";
import { Label } from "../ui/label";

export default function ServerList() {
  const user = useContext(AuthContext);
  if (!user) redirect("/login");
  const [filter, setFilter] = useState("");
  const joined = useQuery(api.users.getJoined, { userid: user.id });
  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <div className="relative">
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            id="search"
            type="search"
            placeholder={"Search..."}
            defaultValue={filter}
            onChange={(e) => setFilter(e.currentTarget.value.toLowerCase())}
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
      </div>

      {(joined ?? []).map((server) =>
        server && server.name.toLowerCase().includes(filter) ? (
          <ServerListItem key={server?._id} server={server} />
        ) : (
          <></>
        ),
      )}
    </>
  );
}

export function ServerListItem({
  server,
}: {
  server: {
    _id: Id<"servers">;
    name: string;
    serverIcon: string;
    description: string;
  };
}) {
  return (
    <SidebarGroup className="p-0 my-2">
      <Link href={`/channels/${server._id}`}>
        <Card className="p-2 bg-secondary">
          <div className="grid grid-cols-[50px_1fr]">
            <Avatar className="place-self-center">
              <AvatarImage src={server.serverIcon} />
              <AvatarFallback />
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold">{server.name}</span>
              <span className="text-muted-foreground">
                {server.description}
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </SidebarGroup>
  );
}
