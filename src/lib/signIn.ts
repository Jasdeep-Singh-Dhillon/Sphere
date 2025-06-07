"use server";

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
    console.log(error);
    return { message: "Invalid Credentials" };
  }
}
