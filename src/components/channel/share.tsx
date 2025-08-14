/* eslint-disable @typescript-eslint/no-explicit-any */
import { Id } from "convex/_generated/dataModel";
import { Device } from "mediasoup-client";
import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { env } from "~/env";
import { AuthContext } from "../auth/auth-context";
import { redirect } from "next/navigation";
import {
  Transport,
  type AppData,
  type RtpCapabilities,
} from "mediasoup-client/types";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Video from "./video";
import { ScrollArea } from "../ui/scroll-area";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Headset, Merge, Play, Square } from "lucide-react";

const ScreenShare = ({
  channel,
  stream,
}: {
  channel: {
    _id: Id<"channels">;
    _creationTime: number;
    type: "text" | "voice";
    name: string;
    categoryid: Id<"categories">;
    serverid: Id<"servers">;
  };
  stream: RefObject<MediaStream>;
}) => {
  console.log(channel);
  const socket = useRef<WebSocket | null>(null);
  const user = useContext(AuthContext);
  const device = useRef<Device | null>(null);
  const producerTransport = useRef<Transport<AppData> | null>(null);
  const consumerTransport = useRef<Transport<AppData> | null>(null);
  const remoteStream = useRef<MediaStream>(new MediaStream());

  const [connectionState, setConnectionState] = useState("Closed");
  const [joinDisabled, setJoinDisabled] = useState(true);
  const [connectDisabled, setConnectDisabled] = useState(false);
  const [recording, setRecording] = useState(false);

  const recorder = useRef<MediaRecorder>(null);
  let produceCallback: (({ id }: { id: string }) => void) | null = null;
  if (!user) redirect("/login");

  const [remoteTracks, setRemoteTracks] = useState<MediaStreamTrack[]>([]);
  const isSubscribed = useQuery(api.users.getCustomerId, {
    userid: user.id,
  });

  function send(data: any) {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(data));
    }
  }

  function setupProducerTransport(params: any) {
    if (!device.current) return;
    producerTransport.current = device.current.createSendTransport(params);

    producerTransport.current.on("connect", ({ dtlsParameters }, callback) => {
      send({
        type: "connectProducerTransport",
        transportId: producerTransport.current?.id,
        dtlsParameters,
      });
      callback();
    });

    producerTransport.current.on(
      "produce",
      ({ rtpParameters, kind }, callback) => {
        produceCallback = callback;
        send({
          type: "produce",
          transportId: producerTransport.current?.id,
          kind,
          rtpParameters,
        });
      },
    );

    producerTransport.current.on("connectionstatechange", (state) => {
      console.log("Producer transport state:", state);
      setConnectionState(state);
    });
  }

  function setupConsumerTransport(params: any) {
    if (!device.current) return;
    consumerTransport.current = device.current.createRecvTransport(params);
    consumerTransport.current.on("connect", ({ dtlsParameters }, callback) => {
      send({
        type: "connectConsumerTransport",
        transportId: consumerTransport.current?.id,
        dtlsParameters,
      });
      callback();
    });

    consumerTransport.current.on("connectionstatechange", (state) => {
      console.log("Consumer transport state:", state);
      setConnectionState(state);
      if (state === "connected") {
        send({ type: "resume" });
      }
    });

    // Once consumer transport is ready, request to consume
    send({
      type: "consume",
      rtpCapabilities: device.current.rtpCapabilities,
    });
  }

  async function handleSubscribed({
    producerId,
    id,
    kind,
    rtpParameters,
  }: any) {
    if (!consumerTransport.current) return;
    const consumer = await consumerTransport.current.consume({
      id,
      producerId,
      kind,
      rtpParameters,
    });
    remoteStream.current.addTrack(consumer.track);
    console.log("Consumer track ", consumer.track);
    setRemoteTracks(remoteStream.current.getTracks());
  }

  useEffect(() => {
    socket.current = new WebSocket(`${env.NEXT_PUBLIC_SFU_URL}/room`);
    socket.current.onopen = () => {
      console.log("Connecting to signaling server");
      send({ type: "getRouterRtpCapabilities" });
    };

    socket.current.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log(message.type);
        switch (message.type) {
          case "routerCapabilities": {
            await loadDevice(message.data);

            send({
              type: "createProducerTransport",
              forceTcp: false,
              rtpCapabilities: device.current?.rtpCapabilities,
            });
            break;
          }
          case "producerTransportCreated": {
            setupProducerTransport(message.data);
            break;
          }
          case "produced": {
            if (produceCallback) {
              produceCallback({ id: message.data.id });
              produceCallback = null;
            }
            break;
          }
          case "subTransportCreated": {
            setupConsumerTransport(message.data);
            break;
          }
          case "resumed": {
            console.log("Consumer resumed");
            break;
          }
          case "subscribed": {
            await handleSubscribed(message.data);
            break;
          }
          case "newProducer": {
            if (message.data.producerId !== producerTransport.current?.id) {
            }
            break;
          }
          case "error": {
            toast("Error during connection");
            break;
          }
          default:
            break;
        }
      } catch (error) {
        console.error(error);
      }
    };

    socket.current.onclose = () => {
      console.log("Disconnected from Mediasoup signaling server");
      setTimeout(() => {
        console.log("Attempting to reconnect");
        socket.current = new WebSocket(`${env.NEXT_PUBLIC_SFU_URL}/room`);
      }, 1000);
    };

    socket.current.onerror = (error) => {
      console.error("Websocket error: ", error);
    };
  }, []);

  async function loadDevice(routerRtpCapabilities: RtpCapabilities) {
    try {
      device.current = new Device();
    } catch (error) {
      if ((error as Error).name === "UnsupportedError") {
        console.log("Browser not supported");
      }
    }
    await device.current?.load({ routerRtpCapabilities });
  }
  const trackLength = stream.current.getTracks().length;
  useEffect(() => {
    if (stream.current.getTracks().length > 0) {
      setJoinDisabled(false);
    } else {
      setJoinDisabled(true);
    }
  }, [stream, trackLength]);

  function join() {
    stream.current?.getTracks().forEach((track) => {
      if (producerTransport.current)
        producerTransport.current?.produce({ track });
    });

    if (consumerTransport.current) connect();
  }

  function connect() {
    setConnectDisabled(true);
    send({ type: "createConsumerTransport", forceTcp: false });
  }

  let status;
  if (connectionState === "Connected") {
    status = <div className="text-green-400">Connected</div>;
  } else if (connectionState === "Connecting") {
    status = <div className="text-yellow-300">Connecting</div>;
  } else if (connectionState === "Failed") {
    status = <div className="text-red-400">Failed</div>;
  }

  function handleRecord() {
    if (recording) {
      recorder.current?.stop();
      setRecording(false);
      return;
    }
    setRecording(true);
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
      ? "video/webm;codecs=vp8,opus"
      : "video/webm";
    recorder.current = new MediaRecorder(remoteStream.current, {
      mimeType: mime,
      bitsPerSecond: 3_000_000,
    });
    const chunks: BlobPart[] = [];
    recorder.current.ondataavailable = (e) => {
      if (e.data && e.data.size) chunks.push(e.data);
    };
    recorder.current.onstop = () => {
      const blob = new Blob(chunks, { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mediasoup-recording-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };
    recorder.current.start(1000);
  }

  return (
    <ScrollArea className="row-span-2 h-full w-full flex flex-col items p-4">
      {stream.current.getVideoTracks().map((video) => (
        <Video key={video.id} track={video} />
      ))}
      {remoteTracks.map((video) => (
        <Video key={video.id} track={video} />
      ))}
      <div className="flex justify-evenly">
        {status}
        <Button variant={"accent"} disabled={joinDisabled} onClick={join}>
          <Headset />
        </Button>
        <Button variant={"accent"} disabled={connectDisabled} onClick={connect}>
          <Merge />
        </Button>
        {isSubscribed ? (
          <Button
            variant={"accent"}
            onClick={handleRecord}
            disabled={recording}
          >
            {recording ? <Square /> : <Play />}
          </Button>
        ) : (
          <></>
        )}
      </div>
    </ScrollArea>
  );
};

export default ScreenShare;
