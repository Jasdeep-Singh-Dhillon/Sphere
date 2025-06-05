import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function Layout({children}: {children: ReactNode}) {
  return (
    <SidebarProvider>
      <AppSidebar  />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <Separator/>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
