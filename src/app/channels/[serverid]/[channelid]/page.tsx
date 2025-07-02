"use client";
import { useMutation, useQuery } from "convex/react";
import MessageSkeleton from "~/components/channel/message-skeleton";
import { api } from "../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { FormEvent, KeyboardEvent } from "react";
import useAppForm from "~/lib/app-form";
import { z } from "zod/v4";
import { SendHorizontal } from "lucide-react";
import { getSession } from "~/lib/auth-client";
import { toast } from "sonner";
import { FileUpload } from "~/components/channel/file-upload";
import Image from "next/image";

export default function Channel() {
  const params = useParams();
  const channelid = params.channelid as Id<"channels">;
  const messages = useQuery(api.query.getMessages, { id: channelid });

  const sendMessage = useMutation(api.mutation.sendMessage);
  const messageForm = useAppForm({
    defaultValues: {
      message: "",
    },
    validators: {
      onSubmit: z.object({
        message: z.string().min(1, { error: "" }),
      }),
    },
    onSubmit: async function ({ value }: { value: { message: string } }) {
      const content = value.message.trim();
      const { data } = await getSession();
      console.log(content);
      if (!data?.user) {
        toast("Error sending message");
        return;
      }
      const result = await sendMessage({
        userid: data.user.id,
        content,
        channelid,
      });

      if (result === null) {
        toast("Could not send message");
      } else {
        messageForm.setFieldValue("message", "");
      }
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    messageForm.handleSubmit();
  }

  function keySubmit(e: KeyboardEvent) {
    if (e.ctrlKey && e.key == "Enter") {
      messageForm.handleSubmit();
    }
  }
  return (
    <div className="m-4">
      <div className="absolute bottom-0 w-11/12 m-4">
        <div>
          {messages ? (
            messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 items-center p-2 text-sm `}
                >
                  <div>
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={message?.image} />
                      <AvatarFallback className="rounded-lg"></AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <div className="font-semibold">{message.username}</div>
                      <div>{new Date(message.time).toDateString()}</div>
                    </div>
                    <div className="whitespace-pre-wrap">
                      {message.type ? (
                        <Image src={message.content ?? ""} width="300" height={"300"} alt={"Image"} />
                      ) : (
                        <span>{message.content}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full">Send message to get started</div>
            )
          ) : (
            <MessageSkeleton />
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          onKeyDown={keySubmit}
          className="flex items-end gap-2 field-sizing-content"
        >
          <messageForm.AppField name="message">
            {(field) => (
              <field.Textarea
                id="message"
                name="message"
                onBlur={field.handleBlur}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full min-h-22 mt-4 max-h-[300]"
                placeholder="Enter your message"
              />
            )}
          </messageForm.AppField>
          <div className="flex flex-col gap-2">
            <FileUpload channelid={channelid} />
            <messageForm.Button
              type="submit"
              variant={"accent"}
              className="aspect-square"
            >
              <SendHorizontal />
            </messageForm.Button>
          </div>
        </form>
      </div>
    </div>
  );
}
