"use client";
import { ConvexAuthNextProvider } from "@/components/convexClientProvider";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <ConvexAuthNextProvider>{children}</ConvexAuthNextProvider>;
}
