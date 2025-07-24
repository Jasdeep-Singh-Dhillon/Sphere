"use client";
import * as React from "react";
import { ServerProfileSection } from "~/components/dialogs/server-profile";
import { CreateRoleSection } from "~/components/dialogs/create-role";
import { MemberListSection } from "~/components/dialogs/member-list";

const sidebarItems = [
  { key: "profile", label: "Server Profile" },
  { key: "members", label: "Members" },
  { key: "roles", label: "Roles" },
];

export default function ServerSettingsPage() {
  const [active, setActive] = React.useState("profile");

  let content = null;
  if (active === "profile") {
    content = <ServerProfileSection serverName="krishlavani" serverIcon={null} />;
  } else if (active === "members") {
    content = <MemberListSection />;
  } else if (active === "roles") {
    content = <CreateRoleSection />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-background/80 border-r border-accent/10 py-8 px-4 flex flex-col gap-2">
        <div className="mb-6 text-lg font-bold text-accent tracking-wide px-2">KRISHLAVANI</div>
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
        <div className="w-full max-w-3xl">
          {content}
        </div>
      </main>
    </div>
  );
}
