"use server";
import { redirect } from "next/navigation";
import * as argon2 from "argon2";
import { env } from "./env";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

export default async function signUp(value: {
  username: string;
  displayName: string;
  email: string;
  password: string;
  dateofbirth: number;
  monthofbirth: number;
  yearofbirth: number;
}) {
  console.log(value);
  const hashedPassword = await argon2.hash(value.password, { hashLength: 50 });
  const result = await new ConvexHttpClient(env.CONVEX_DEPLOYMENT_URL).mutation(
    api.mutation.registerUser,
    {
      username: value.username,
      email: value.email,
      displayName: value.displayName,
      password: hashedPassword,
    },
  );
  console.log("signup", result);

  if (result) {
    redirect("/login");
  }
  return false;
}
