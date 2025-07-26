"use client";
import { ReactNode } from "react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { env } from "~/env";
import { redirect } from "next/navigation";
import { AuthContext } from "~/components/auth/auth-context";
import { useSession } from "~/lib/auth-client";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export default function ChannelLayout({ children }: { children: ReactNode }) {
  const { data, isPending } = useSession();
  if (!isPending && !data?.user) {
    redirect("/login");
  }
  if (data?.user) {
    return (
      <AuthContext value={data.user}>
        <ConvexProvider client={convex}>{children}</ConvexProvider>;
      </AuthContext>
    );
  }
}
