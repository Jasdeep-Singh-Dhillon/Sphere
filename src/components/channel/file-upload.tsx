"use client";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Label } from "../ui/label";
import { CloudUpload } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { getSession } from "~/lib/auth-client";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

export function FileUpload({ channelid }: { channelid: Id<"channels"> }) {
  const generateUploadUrl = useMutation(api.mutation.generateUploadUrl);
  const sendImage = useMutation(api.mutation.sendImage);

  async function uploadImage(file: File) {
    console.log("Name", file?.name);
    console.log("Type", file?.type);
    if (!file) return;

    const url = await generateUploadUrl();
    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });
    const { storageId } = await result.json();
    if (!storageId) {
      toast("Error uploading file");
      return;
    }
    const { data } = await getSession();
    const userid = data?.user.id ? data?.user.id : "";
    sendImage({ storageId, userid, channelid });
  }

  return (
    <Button variant="secondary" type="button" className="aspect-square">
      <Input
        type="file"
        id="fileUpload"
        accept="image/*"
        name="fileUpload"
        className="aspect-square hidden"
        onChange={async (event) => {
          console.log(event.target.files![0].name);
          uploadImage(event.target.files![0]);
        }}
      />
      <Label htmlFor="fileUpload">
        <CloudUpload className="relative" />
      </Label>
    </Button>
  );
}
