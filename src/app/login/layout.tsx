import { ConvexClientProvider } from "@/components/convexClientProvider";
import { auth } from "@/lib/auth";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  return <ConvexClientProvider session={session}>{children}</ConvexClientProvider>;
}