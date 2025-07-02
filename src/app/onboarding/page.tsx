"use client";
import { redirect } from "next/navigation";
import { SetUsernameDialog } from "~/components/dialogs/set-username";
import { useSession } from "~/lib/auth-client";

export default function OnBoardingUser() {
  const { data, isPending } = useSession();
  if (!isPending && !data?.user) {
    redirect("/login");
  }
  return data?.user ?
    <SetUsernameDialog userid={data.user.id}>
      <div></div>
    </SetUsernameDialog> : "Loading...";
  ;
}
