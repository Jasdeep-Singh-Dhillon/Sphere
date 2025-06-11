"use server";
import * as argon2 from "argon2";
import { env } from "./env";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { redirect } from "next/navigation";

export default async function signUp(value: {
  name: string;
  username: string;
  email: string;
  password: string;
  dateofbirth: number;
  monthofbirth: number;
  yearofbirth: number;
}) {
  const hashedPassword = await argon2.hash(value.password, { hashLength: 50 });
  const result = await new ConvexHttpClient(env.CONVEX_DEPLOYMENT_URL).mutation(
    api.authAdapter.createUser,
    {
      user: {
        username: value.username,
        email: value.email,
        name: value.name,
        password: hashedPassword,
      },
      secret: env.CONVEX_AUTH_ADAPTER_SECRET,
    },
  );
  
  if (result) {
    redirect("/login");
  }
  return false;
}
