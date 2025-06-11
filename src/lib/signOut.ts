"use server";
import { signOut } from "./auth";

export default async function SignoutServer() {
  await signOut({ redirectTo: "/" });
}
