"use client";
import { ReactNode } from "react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { env } from "~/env";
import { redirect } from "next/navigation";
import { AuthContext } from "~/components/auth/auth-context";
import { useSession } from "~/lib/auth-client";
import { AppSidebar } from "~/components/server/app-sidebar";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { UsersRound } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export default function ChannelLayout({ children }: { children: ReactNode }) {
  const { data, isPending } = useSession();
  if (!isPending && !data?.user) {
    redirect("/login");
  }
  if (data?.user && !isPending) {
    const user = {
      ...data.user,
      image: data.user.image ? data.user.image : undefined,
    };
    return (
      <ConvexProvider client={convex}>
        <AuthContext value={user}>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="h-dvh grid grid-rows-[65px_1fr_200px]">
              <header className="row-span-1 flex h-16 shrink-0 items-center gap-2 px-4 border-b">
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
              {/* <Separator /> */}
              {children}
            </SidebarInset>
          </SidebarProvider>
        </AuthContext>
      </ConvexProvider>
    );
  }
}
