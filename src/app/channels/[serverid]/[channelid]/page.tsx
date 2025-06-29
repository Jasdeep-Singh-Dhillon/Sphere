import { Icons } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";

export default function Channel() {
  const messages = [
    {
      messageId: "1",
      userId: "123",
      channelId: "1",
      content: "Message 1",
    },
    {
      messageId: "2",
      userId: "124",
      channelId: "1",
      content: "Message 2",
    },
    {
      messageId: "3",
      userId: "123",
      channelId: "1",
      content: "Message 3",
    },
  ];
  return (
    <div className="m-4">
      Chat Page
      <br />
      <div className="absolute bottom-0 w-11/12 m-4">
        {messages.map((message) => (
          <div className="flex items-center" key={message.messageId}>
            {<Icons.sphere className="w-8 h-8" />}
            <div className="bg-secondary m-2 p-2 ps-4 pe-6 rounded w-fit">
              {message.content}
            </div>
          </div>
        ))}
        <Input className="w-full" />
      </div>
    </div>
  );
}
