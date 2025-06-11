"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn } from "./auth";

export async function githubSignIn() {
  await signIn("github", { redirectTo: "/hub" });
}
export async function googleSignIn() {
  await signIn("google", { redirectTo: "/hub" });
}

export async function credentialSignIn(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/hub",
    });
  } catch (error) {
    if (isRedirectError(error)) return "Hub";
    console.log(error, "Returning Invalid");
    return "Invalid Credentials";
  } 
}
