import { Id } from "convex/_generated/dataModel";
import ScreenShare from "./share";
import {
  HeadphoneOff,
  Headphones,
  Mic,
  MicOff,
  MonitorOff,
  ScreenShareIcon,
  Video,
  VideoOff,
} from "lucide-react";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Voice({
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
  const [audio, setAudio] = useState("");
  const [deafen, setDeafen] = useState("");
  const [video, setVideo] = useState("");
  const [share, setShare] = useState("");
  const stream = useRef<MediaStream>(new MediaStream());

  return (
    <>
      <ScreenShare channel={channel} stream={stream} />
      <div className="row-span-3 flex justify-center gap-2 mb-2">
        <div>
          <Button
            variant={"outline"}
            className=" bg-secondary p-2 rounded"
            onClick={async () => {
              if (!audio) {
                try {
                  const audioTrack = (
                    await navigator.mediaDevices.getUserMedia({
                      audio: true,
                    })
                  ).getTracks()[0];
                  stream.current.addTrack(audioTrack);
                  setAudio(audioTrack.id);
                } catch (error) {
                  toast(
                    `Error getting microphone audio ${(error as Error).message}`,
                  );
                }
              } else {
                stream.current.getTracks().map((track) => {
                  if (track.id === audio) {
                    track.stop();
                    stream.current.removeTrack(track);
                  }
                });
                setAudio("");
              }
            }}
          >
            {!audio ? <MicOff /> : <Mic />}
          </Button>
        </div>
        <Button
          variant={"outline"}
          className=" bg-secondary p-2 rounded"
          onClick={() => {
            if (!deafen) {
              setDeafen("Value");
            }
            setDeafen("");
          }}
        >
          {!deafen ? <HeadphoneOff /> : <Headphones />}
        </Button>
        <Button
          variant={"outline"}
          className=" bg-secondary p-2 rounded"
          onClick={async () => {
            if (!video) {
              try {
                const videoTrack = (
                  await navigator.mediaDevices.getUserMedia({
                    video: true,
                  })
                ).getTracks()[0];
                stream.current.addTrack(videoTrack);
                setVideo(videoTrack.id);
              } catch (error) {
                toast(`Error getting video ${(error as Error).message}`);
              }
            } else {
              stream.current.getTracks().map((track) => {
                if (track.id === video) {
                  track.stop();
                  stream.current.removeTrack(track);
                }
              });
              setVideo("");
            }
          }}
        >
          {!video ? <VideoOff /> : <Video />}
        </Button>
        <Button
          variant={"outline"}
          className=" bg-secondary p-2 rounded"
          onClick={async () => {
            if (!share) {
              try {
                const screen = (
                  await navigator.mediaDevices.getDisplayMedia()
                ).getTracks()[0];
                stream.current.addTrack(screen);
                setShare(screen.id);
              } catch (error) {
                toast(
                  `Error getting screen or application ${(error as Error).message}`,
                );
              }
            } else {
              stream.current.getTracks().forEach((track) => {
                if (track.id === share) {
                  track.stop();
                  stream.current.removeTrack(track);
                }
              });
              setShare("");
            }
          }}
        >
          {!share ? <MonitorOff /> : <ScreenShareIcon />}
        </Button>
      </div>
    </>
  );
}
