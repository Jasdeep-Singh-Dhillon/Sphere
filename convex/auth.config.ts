import { env } from "@/lib/env";

const config = {
  providers: [
    {
      domain: env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};

export default config;
