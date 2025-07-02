import type { NextConfig } from "next";
import { env } from "~/env";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL(`${env.NEXT_PUBLIC_CONVEX_URL}/**`)]
  }
};

export default nextConfig;
