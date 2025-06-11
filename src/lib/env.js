import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    CONVEX_DEPLOYMENT: z.string(),
    CONVEX_DEPLOYMENT_URL: z.url(),
    CONVEX_SITE_URL: z.url(),
    AUTH_SECRET: z.string(),
    CONVEX_AUTH_ADAPTER_SECRET: z.string(),
    AUTH_GITHUB_ID: z.string(),
    AUTH_GITHUB_SECRET: z.string(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
    CONVEX_AUTH_PRIVATE_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.url(),
  },
  runtimeEnv: {
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    CONVEX_SITE_URL: process.env.CONVEX_SITE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    CONVEX_AUTH_PRIVATE_KEY: process.env.CONVEX_AUTH_PRIVATE_KEY,
    CONVEX_DEPLOYMENT_URL: process.env.CONVEX_DEPLOYMENT_URL,
    CONVEX_AUTH_ADAPTER_SECRET: process.env.CONVEX_AUTH_ADAPTER_SECRET,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
