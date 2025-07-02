"use client";
import { ReactNode } from "react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { env } from "~/env";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export default function ChannelLayout({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
