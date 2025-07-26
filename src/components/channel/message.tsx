import { Id } from "convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { AuthContext } from "../auth/auth-context";
import { useContext, useState } from "react";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import { CheckLine, Edit, Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

export default function Message({
  message,
  showUser,
}: {
  message: {
    id: Id<"messages">;
    username: string;
    image: string | undefined;
    content: string | null;
    replyMessageId: Id<"messages"> | undefined;
    time: number;
    type: "file" | undefined;
    userid: string;
  };
  showUser?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const user = useContext(AuthContext);
  if (!user) redirect("/login");
  const classes = user.id === message.userid ? "flex-row-reverse" : "";
  const date = new Date(message.time);
  const deleteMessage = useMutation(api.messages.remove);
  const editMessage = useMutation(api.messages.edit);
  return (
    <>
      {showUser ? (
        <div className={`flex ${classes} gap-2 items-center content-center`}>
          <Avatar className="h-12 w-12 rounded-lg">
            <AvatarImage src={message?.image} />
            <AvatarFallback className="rounded-lg "></AvatarFallback>
          </Avatar>
          <div className="font-semibold text-sm">{message.username}</div>
          <div className="text-muted-foreground font-light text-xs pt-0.75">
            {date.toDateString()}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className={` ${classes} flex group gap-2`}>
        <div className="w-10 h-10 invisible group-hover:visible text-xs text-muted-foreground content-center  ">
          {date.getHours()}:{date.getMinutes().toString().padStart(2, "0")}
        </div>
        <div
          className={`whitespace-pre-wrap bg-secondary p-2 px-4 rounded-lg `}
        >
          {message.type && message.content ? (
            <div className="relative">
              <Image
                src={message.content}
                width={"300"}
                height={"300"}
                alt={"Image"}
              />
              {classes ? (
                <Button
                  variant={"ghost"}
                  className="absolute group-hover:visible hover:bg-red-800 bg-red-500 invisible top-0 right-0"
                  onClick={() => {
                    deleteMessage({ messageid: message.id, userid: user.id });
                  }}
                >
                  <Trash2 />
                </Button>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <>
              {!editing ? (
                <div className="relative">
                  {message.content}
                  {classes ? (
                    <>
                      <Button
                        variant={"link"}
                        className={`absolute group-hover:visible hover:bg-red-800 bg-red-500 invisible top-0 p-2 h-fit [&>svg]:size-3 ${classes ? "-left-12" : "-right-12"}`}
                        onClick={() => {
                          deleteMessage({
                            messageid: message.id,
                            userid: user.id,
                          });
                        }}
                      >
                        <Trash2 />
                      </Button>
                      <Button
                        variant={"ghost"}
                        className={`absolute group-hover:visible invisible top-0 p-2 bg-secondary h-fit [&>svg]:size-3 ${classes ? "-left-20" : "-right-20"}`}
                        onClick={() => {
                          setEditing(true);
                        }}
                      >
                        <Edit />
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <form
                  className="relative"
                  action={(data) => {
                    const content = data.get("message");
                    const result = content
                      ? content.toString().trim().length > 0
                        ? editMessage({
                            userid: user.id,
                            content: content.toString(),
                            messageid: message.id,
                          })
                        : null
                      : null;
                    if (!result) toast("Error editing message");
                    setEditing(false);
                  }}
                >
                  <Textarea
                    name="message"
                    defaultValue={message.content ? message.content : ""}
                  />
                  <Button
                    type="submit"
                    className="h-fit p-2 absolute bottom-1 -left-16"
                  >
                    <CheckLine />
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
