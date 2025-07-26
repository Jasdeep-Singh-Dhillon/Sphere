"use client";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function ServerProfileSection({
  serverName = "",
  serverIcon = null,
}: {
  serverName?: string;
  serverIcon?: string | null;
}) {
  const [name, setName] = useState(serverName);
  const [icon, setIcon] = useState<string | null>(serverIcon || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { serverid } = useParams();
  const changeServerName = useMutation(api.servers.editInfo);
  const handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setIcon(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full p-0">
      <div className="text-2xl font-extrabold text-accent tracking-tight mb-1">
        Server Profile
      </div>
      <div className="text-muted-foreground mb-6 text-base">
        Customise how your server appears in invite links and, if enabled, in
        Server Discovery and Announcement Channel messages
      </div>
      <div className="mb-6">
        <label
          htmlFor="serverName"
          className="block text-base font-semibold text-accent mb-2"
        >
          Name
        </label>
        <Input
          id="serverName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border-accent/30 focus:border-accent focus:ring-accent/30 transition text-lg px-4 py-3"
          placeholder="Server name"
        />
      </div>
      <div className="border-t border-accent/10 my-6" />
      <div className="mb-2 text-base font-semibold text-accent">Icon</div>
      <div className="mb-2 text-sm text-muted-foreground">
        We recommend an image of at least 512x512.
      </div>
      <Button
        type="button"
        className="bg-accent text-white font-semibold px-5 py-2 rounded-lg mt-2"
        onClick={() => fileInputRef.current?.click()}
      >
        Change Server Icon
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleIconChange}
      />
      {/* Add preview if needed */}
      <div className="mt-8">
        <Button
          className="bg-accent text-white font-semibold rounded-lg px-6 shadow transition w-32"
          disabled={!name.trim()}
          onClick={() => {
            changeServerName({
              serverid: serverid as Id<"servers">,
              servername: name,
            });
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
