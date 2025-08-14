"use client";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { api } from "convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { env } from "~/env";
import { redirect } from "next/navigation";

const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

export function SetUsernameDialog({
  children,
  userid,
}: {
  children: React.ReactNode;
  userid: string;
}) {
  const [username, setUsername] = React.useState("");
  const [checking, setChecking] = useState(false);
  const [taken, setTaken] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [open, setOpen] = useState(true);

  // Only allow a-z, 0-9, _ and . (no spaces, no other special chars)

  useEffect(() => {
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!username) {
      setTaken(false);
      setInvalid(false);
      return;
    }
    if (!usernameRegex.test(username)) {
      setInvalid(true);
      setTaken(false);
      return;
    } else {
      setInvalid(false);
    }
    setChecking(true);
    convex
      .query(api.users.isUsernameAvailable, { username })
      .then((res) => {
        setTaken(res);
      })
      .finally(() => setChecking(false));
  }, [username]);

  const handleSet = async () => {
    // Handle set username logic here
    console.log({ username });
    const result = await convex.mutation(api.users.setUsername, {
      username,
      userid,
    });
    if (result) {
      redirect("/channels");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md rounded-2xl bg-background/80 shadow-2xl border border-accent/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-extrabold text-accent tracking-tight mb-2 text-center">
            Set Your Username
          </AlertDialogTitle>
          <div className="text-muted-foreground text-center mb-4 text-base">
            Choose a unique username for your account.
          </div>
        </AlertDialogHeader>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-base font-semibold text-accent"
            >
              USERNAME
            </label>
            <Input
              id="username"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
              className="mt-2 rounded-lg border-accent/30 focus:border-accent focus:ring-accent/30 transition"
            />
            {username && (
              <div className="mt-1 text-xs h-5">
                {invalid ? (
                  <span className="text-red-500">
                    {"Only letters, numbers, '_' and '.' allowed"}
                  </span>
                ) : checking ? (
                  <span className="text-muted-foreground">Checking...</span>
                ) : taken ? (
                  <span className="text-red-500">
                    Username is already taken
                  </span>
                ) : (
                  <span className="text-green-500">Username is available</span>
                )}
              </div>
            )}
          </div>
        </div>
        <AlertDialogFooter className="mt-6 flex gap-2">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="rounded-lg px-6">
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            onClick={handleSet}
            className="bg-accent text-white font-semibold rounded-lg px-6 shadow transition"
            disabled={!username.trim() || taken || checking || invalid}
          >
            Set Username
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
