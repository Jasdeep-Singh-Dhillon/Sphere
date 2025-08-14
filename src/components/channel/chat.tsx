import { api } from "convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { FormEvent, KeyboardEvent } from "react";
import { toast } from "sonner";
import z from "zod/v4";
import useAppForm from "~/lib/app-form";
import { getSession } from "~/lib/auth-client";
import { ScrollArea } from "../ui/scroll-area";
import Message from "./message";
import MessageSkeleton from "./message-skeleton";
import { FileUpload } from "./file-upload";
import { SendHorizontal } from "lucide-react";
import { Id } from "convex/_generated/dataModel";

export default function Chat({
  channel,
}: {
  channel: {
    _id: Id<"channels">;
    _creationTime: number;
    type: "text" | "voice";
    name: string;
    categoryid: Id<"categories">;
    serverid: Id<"servers">;
  };
}) {
  // if (!channel) return "Not found";
  const messages = useQuery(api.messages.get, { channelid: channel._id });

  const sendMessage = useMutation(api.messages.send);
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
        channelid: channel._id,
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
    <>
      <ScrollArea className="m-4 row-span-2 pe-4">
        <div className="flex flex-col gap-2">
          {messages ? (
            messages.length > 0 ? (
              messages.map((message, index) =>
                message ? (
                  index > 0 &&
                  message.username === messages[index - 1]?.username ? (
                    <Message
                      key={message.id}
                      message={message}
                      showUser={false}
                    />
                  ) : (
                    <Message
                      key={message.id}
                      message={message}
                      showUser={true}
                    ></Message>
                  )
                ) : (
                  <></>
                ),
              )
            ) : (
              <div className="absolute bottom-0">
                Send message to get started {channel?.name}
              </div>
            )
          ) : (
            <MessageSkeleton />
          )}
        </div>
      </ScrollArea>
      <form
        onSubmit={handleSubmit}
        onKeyDown={keySubmit}
        className="flex items-end gap-2 field-sizing-content row-span-3 m-4"
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
          <FileUpload channelid={channel._id} />
          <messageForm.Button
            type="submit"
            variant={"accent"}
            className="aspect-square"
          >
            <SendHorizontal />
          </messageForm.Button>
        </div>
      </form>
    </>
  );
}
