import { ConvexClientProvider } from "@/components/convexClientProvider";
import { ReactNode } from "react";

export default function Layout({children}:{children: ReactNode}) {
  return (<ConvexClientProvider>
    {children}
  </ConvexClientProvider>)
}