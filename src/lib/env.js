import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    CONVEX_DEPLOYMENT: z.string(),
    CONVEX_SITE_URL: z.url(),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.url(),
  },
  runtimeEnv: {
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    CONVEX_SITE_URL: process.env.CONVEX_SITE_URL,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  },
});
