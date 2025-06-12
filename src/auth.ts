import { betterAuth } from "better-auth";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { env } from "~/env";
import { toast } from "sonner";

const dialect = new LibsqlDialect({
  url: env.TURSO_DB_URL,
  authToken: env.TURSO_DB_TOKEN,
});

console.log(env.TURSO_DB_URL);

export const auth = betterAuth({
  database: {
    dialect,
    type: "sqlite",
  },
  
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
   
  },
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  onAPIError: {
    throw: true,
    onError: (error) => {
      toast(JSON.stringify(error));
    },
  },
});
