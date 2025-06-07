import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth} from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  console.log("Hub layout",session);
  if (!session?.user) {
    redirect("/login");
  }
  
  return (
    <SidebarProvider>
      <AppSidebar session={session}  />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <Separator />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
