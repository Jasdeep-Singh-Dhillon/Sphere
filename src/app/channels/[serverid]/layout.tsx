"use client";
import { AppSidebar } from "~/components/server/app-sidebar";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { ReactNode } from "react";
import { UsersRound } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { redirect } from "next/navigation";
import { useSession } from "~/lib/auth-client";

export default function Layout({ children }: { children: ReactNode }) {
  const { data, isPending } = useSession();
  if (!data?.user && !isPending) {
    redirect("/login");
  }
  const user = data?.user && !isPending ? {
    name: data.user.name,
    email: data.user.email,
    image: data.user.image ? data.user.image : undefined,
  } : undefined  ;
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="ghost"
            size="icon"
            className={cn("size-7")}
          >
            <UsersRound />
            <span className="sr-only">Toggle Member List</span>
          </Button>
        </header>
        <Separator />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
