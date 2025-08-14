"use client";

import * as React from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

export function CreateChannelDialog({
  children,
  serverid,
  categoryid,
}: {
  children: React.ReactNode;
  serverid: Id<"servers">;
  categoryid: Id<"categories">;
}) {
  const [channelType, setChannelType] = useState<"text" | "voice">("text");
  const [open, setOpen] = useState(false);
  const createChannel = useMutation(api.servers.createChannel);
  const [channelName, setChannelName] = useState("");
  // const [isPrivate, setIsPrivate] = React.useState(false);

  const handleCreate = async () => {
    const result = await createChannel({
      serverid,
      categoryid,
      name: channelName,
      type: channelType,
    });
    if (!result) {
      toast("Error creating channel");
    }
    setChannelName("");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md rounded-2xl bg-background/80 shadow-2xl border border-accent/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-extrabold text-accent tracking-tight mb-2">
            Create a New Channel
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <AlertDialogDescription>
          Create a text or voice channel
        </AlertDialogDescription>

        <div className="space-y-6">
          <div>
            <Label className="mb-2 block text-base font-semibold text-accent">
              Channel Type
            </Label>
            {/* Button group with animated highlight */}
            <div className="relative flex gap-2 mt-2">
              {/* Animated highlight */}
              <div
                className="absolute top-0 left-0 h-full w-1/2 rounded-lg bg-accent z-0 transition-transform duration-300"
                style={{
                  transform:
                    channelType === "text"
                      ? "translateX(0%)"
                      : "translateX(100%)",
                }}
              />
              <Button
                type="button"
                variant="ghost"
                className={`w-1/2 z-10 transition-colors duration-300 ${
                  channelType === "text"
                    ? "text-white font-bold"
                    : "text-accent"
                }`}
                onClick={() => setChannelType("text")}
                style={{ background: "none" }}
              >
                Text
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={`w-1/2 z-10 transition-colors duration-300 ${
                  channelType === "voice"
                    ? "text-white font-bold"
                    : "text-accent"
                }`}
                onClick={() => setChannelType("voice")}
                style={{ background: "none" }}
              >
                Voice
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {channelType === "text"
                ? "Send messages, images, GIFs, emoji and files"
                : "Hang out together with voice, video and screen sharing"}
            </div>
          </div>

          <div>
            <Label
              htmlFor="channelName"
              className="text-base font-semibold text-accent"
            >
              Channel Name
            </Label>
            <Input
              id="channelName"
              placeholder="# new-channel"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="mt-2 rounded-lg border-accent/30 focus:border-accent focus:ring-accent/30 transition"
            />
          </div>
        </div>

        <AlertDialogFooter className="mt-6 flex gap-2">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="rounded-lg px-6">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCreate}
            className="bg-accent text-white font-semibold rounded-lg px-6 shadow hover:bg-accent/90 transition"
            disabled={!channelName.trim()}
          >
            Create Channel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
