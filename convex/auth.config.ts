import { env } from "@/lib/env";

const config = {
  providers: [
    {
      domain: env.CONVEX_SITE_URL,
      applicationID: "Sphere",
    },
  ],
};

export default config;
