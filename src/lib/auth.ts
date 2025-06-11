"server-only";
import { SignJWT, importPKCS8 } from "jose";
import NextAuth, { AuthError, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { ConvexAdapter } from "./convexAdapter";
import { env } from "./env";
import * as argon2 from "argon2";
import { z, ZodError } from "zod/v4";
import { api } from "../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

export class CustomAuthError extends AuthError {
  constructor(msg: string) {
    super();
    this.message = msg;
    this.stack = undefined;
  }
}

const Password = CredentialsProvider({
  credentials: {
    email: { type: "email", label: "Email", placeholder: "Enter email" },
    password: {
      label: "Password",
      type: "password",
      placeholder: "Enter password",
    },
  },
  authorize: async function (credentials) {
    try {
      const schema = z.object({
        email: z.email("Please enter a valid email address"),
        password: z.string().min(6, { message: "Password length too small" }),
      });
      const parsedCredentials = await schema.parseAsync(credentials);
      const user = await new ConvexHttpClient(env.CONVEX_DEPLOYMENT_URL).query(
        api.query.getUserByMail,
        {
          email: parsedCredentials.email,
        },
      );
      if (user) {
        let passwordHash = await argon2.hash(parsedCredentials.password, {
          hashLength: 50,
        });
        passwordHash = parsedCredentials.password;
        const match = await argon2.verify(user?.password || "", passwordHash);
        if (!match) throw new CustomAuthError("Invalid credentials");
        return { ...user, image: user.image ?? undefined };
      }
      return null;
    } catch (error: unknown) {
      if (error instanceof ZodError)
        throw new CustomAuthError("Invalid Credentials");
      throw new CustomAuthError("Auth Failed");
    }
  },
});

const authConfig = {
  providers: [Github, Google, Password],
  session: {
    strategy: "jwt",
  },
  adapter: ConvexAdapter,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: async function ({ session }) {
      const privateKey = await importPKCS8(
        process.env.CONVEX_AUTH_PRIVATE_KEY!,
        "RS256",
      );
      const convexToken = await new SignJWT({
        sub: session.userId,
      })
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(env.CONVEX_SITE_URL)
        .setAudience("convex")
        .setExpirationTime("1h")
        .sign(privateKey);
      return { ...session, convexToken };
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

export { handlers as GET, handlers as POST };

declare module "next-auth" {
  interface Session {
    convexToken: string;
  }
  interface User {
    image: string | undefined;
  }
}
