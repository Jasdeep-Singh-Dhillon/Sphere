import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "~/auth";
import { Button } from "../ui/button";

export default async function Authenticated() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <Button variant="accent" asChild>
      {data ? (
        <Link href={"/channels"}>Open Sphere</Link>
      ) : (
        <Link href={"/login"}>Login</Link>
      )}
    </Button>
  );
}
