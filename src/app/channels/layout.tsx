"use client";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { useSession } from "~/lib/auth-client";

export default function ChannelLayout({ children }: { children: ReactNode }) {
  const { data, isPending } = useSession();
  if (!isPending && !data) {
    redirect("/login");
  }
  return <>{children}</>;
}
