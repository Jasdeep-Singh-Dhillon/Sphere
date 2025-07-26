"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import { CircleX } from "lucide-react";

export function MemberListSection() {
  const params = useParams();
  const serverid = params.serverid as Id<"servers">;
  const members = useQuery(api.servers.getMembers, {
    serverid: serverid,
  });
  const serverRoles = useQuery(api.servers.getRoles, {
    serverid: serverid,
  });
  const addRole = useMutation(api.users.addRole);
  const removeRole = useMutation(api.users.removeRole);
  return (
    <div className="max-w-[1200px] mx-auto w-full mt-10">
      <div className="text-2xl font-extrabold text-accent tracking-tight px-12 pt-8 pb-0">
        Server Members
      </div>
      <div className="text-lg font-semibold text-accent px-12 pb-2">
        Recent Members
      </div>
      {/* Members Table */}
      <div className="px-12 pb-12">
        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-accent/10">
                <th className="py-3 px-2 text-left font-semibold">NAME</th>
                <th className="py-3 px-2 text-left font-semibold">
                  MEMBER SINCE
                </th>
                <th className="py-3 px-2 text-left font-semibold">
                  JOINED DISCORD
                </th>
                {/* <th className="py-3 px-2 text-left font-semibold">
                  JOIN METHOD
                </th> */}
                <th className="py-3 px-2 text-left font-semibold">ROLES</th>
                {/* <th className="py-3 px-2 text-left font-semibold">SIGNALS</th> */}
              </tr>
            </thead>
            <tbody>
              {members ? (
                members.map((member) =>
                  member ? (
                    <tr
                      key={member._id}
                      className="border-b border-accent/10 hover:bg-accent/5 transition"
                    >
                      <td className="py-3  w-48 px-2 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.image} />
                          <AvatarFallback />
                        </Avatar>

                        <div>
                          <div className="text-xs text-muted-foreground">
                            {member.username}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-2">
                        {new Date(member.memberSince).toDateString()}
                      </td>
                      <td className="py-3 px-2">
                        {new Date(member._creationTime).toDateString()}
                      </td>

                      <td className="py-3 px-2">
                        {member.roles.map((role) =>
                          role ? (
                            <div
                              key={role._id}
                              className="flex gap-1 items-center bg-muted ps-2 pe-1 py-1 rounded text-xs text-white mr-1 group [&>svg]:size-3"
                              onClick={() => {
                                removeRole({
                                  roleid: role._id,
                                  userid: member._id,
                                });
                              }}
                            >
                              {role.name}
                              <CircleX className="group-hover:visible invisible" />
                            </div>
                          ) : (
                            <></>
                          ),
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {/* Signals: plus button for adding signals, like roles */}
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div
                              className="w-6 h-6 p-0"
                              aria-label="Add Signal"
                            >
                              +
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {serverRoles?.map((role) => (
                              <DropdownMenuItem
                                key={role._id}
                                onClick={async () => {
                                  const result = await addRole({
                                    serverid,
                                    userid: member._id,
                                    roleid: role._id,
                                  });
                                  if (result)
                                    toast(
                                      `Assigned ${role.name} to ${member.username}`,
                                    );
                                  else toast("Error assigning role");
                                }}
                              >
                                {role.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ) : (
                    <></>
                  ),
                )
              ) : (
                <></>
              )}
            </tbody>
          </table>
          <div className="p-3 text-xs text-muted-foreground">
            Showing {members?.length} member{members?.length !== 1 && "s"}
          </div>
        </div>
      </div>
    </div>
  );
}
