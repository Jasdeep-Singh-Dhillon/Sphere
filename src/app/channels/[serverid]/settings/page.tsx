"use client";
import { useState } from "react";
import { ServerProfileSection } from "~/components/dialogs/server-profile";
import { CreateRoleSection } from "~/components/dialogs/create-role";
import { MemberListSection } from "~/components/dialogs/member-list";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { EditRolesSection } from "~/components/dialogs/edit-roles-section";

const sidebarItems = [
  { key: "profile", label: "Server Profile" },
  { key: "members", label: "Members" },
  { key: "roles", label: "Roles" },
  { key: "edit-roles", label: "Edit Roles" },
];

export default function ServerSettingsPage() {
  const [active, setActive] = useState("profile");
  const { serverid } = useParams();
  const serverInfo = useQuery(api.query.getServerInfo, {serverid: serverid as Id<"servers">});
  let content = null;
  if (active === "profile") {
    content = (
      <ServerProfileSection serverName={serverInfo?.name} serverIcon={serverInfo?.serverIcon} />
    );
  } else if (active === "members") {
    content = <MemberListSection />;
  } else if (active === "roles") {
    content = <CreateRoleSection />;
  }else if (active === "edit-roles") {
    content = <EditRolesSection />;
  }

  return (
    <div className="row-span-2 flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-background/80 border-r border-accent/10 py-8 px-4 flex flex-col gap-2">
        <div className="mb-6 text-lg font-bold text-accent tracking-wide px-2">
          {serverInfo?.name}
        </div>
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            className={`text-left px-3 py-2 rounded-lg font-medium transition text-accent/80 hover:bg-accent/10 ${
              active === item.key ? "bg-accent/20 text-accent font-bold" : ""
            }`}
            onClick={() => setActive(item.key)}
          >
            {item.label}
          </button>
        ))}
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center p-12">
        <div className="w-full max-w-3xl">{content}</div>
      </main>
    </div>
  );
}
