"use client";

import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { useMutation, useQuery } from "convex/react";
import { AuthContext } from "~/components/auth/auth-context";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { redirect, useParams } from "next/navigation";

export default function HomePage() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream>(null);
  const params = useParams();
  console.log(params);
  const channel = params.channelid;
  const [channelId, setChannelId] = useState<string>(channel);
  const parsedChannelId = channelId as Id<"channels">;
  const [isConnected, setIsConnected] = useState(false);

  const user = useContext(AuthContext);
  const currentUserId = user ? user.id : redirect("/login");

  const sendSignalingMessage = useMutation(api.webrtc.sendSignalingMessage);
  const messages = useQuery(api.webrtc.getSignalingMessages, {
    channelId: parsedChannelId,
  });
  const endCallSignal = useMutation(api.webrtc.endCall);
  const offer = useQuery(api.webrtc.getOffer, { channelid: parsedChannelId });

  // Initialize local media stream
  const initLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia();
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      localStream.current = stream;
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Please allow camera and microphone access.");
      return null;
    }
  }, []);

  // Set up RTCPeerConnection
  const createPeerConnection = useCallback(
    (stream: MediaStream) => {
      console.log("Creating peer connection");
      const pc = new RTCPeerConnection();

      // Add local stream tracks to peer connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Handle ICE candidates
      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          console.log("Sending ICE candidate:", event.candidate);
          await sendSignalingMessage({
            channelid: parsedChannelId,
            hostid: currentUserId,
            type: "candidate",
            payload: JSON.stringify(event.candidate),
          });
        }
      };

      // Handle remote tracks
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onconnectionstatechange = () => {
        console.log("RTCPeerConnection state:", pc.connectionState);
        if (pc.connectionState === "connected") {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      };

      peerConnectionRef.current = pc;
      return pc;
    },
    [parsedChannelId, currentUserId, sendSignalingMessage],
  );

  // End the call
  const endCall = useCallback(async () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setIsConnected(false);

    // Send a "call-ended" message
    if (channelId) {
      // Only send if there was an active call
      await endCallSignal({ channelId: parsedChannelId });
    }
    console.log("Call ended.");
  }, [parsedChannelId, localStream, endCallSignal, channelId]);

  // Handle incoming signaling messages
  useEffect(() => {
    if (!messages || !peerConnectionRef.current) return;
    console.log("Effect ran");
    messages.forEach(async (msg) => {
      if (msg.hostid === currentUserId) {
        return;
      }

      const payload = JSON.parse(msg.payload);

      try {
        if (msg.type === "offer") {
          console.log("Handling offer");
          await peerConnectionRef.current!.setRemoteDescription(
            new RTCSessionDescription(payload),
          );
          const answer = await peerConnectionRef.current!.createAnswer();
          await peerConnectionRef.current!.setLocalDescription(answer);
        } else if (msg.type === "answer") {
          console.log("Handling answer");
          await peerConnectionRef.current!.setRemoteDescription(
            new RTCSessionDescription(payload),
          );
        } else if (msg.type === "candidate") {
          console.log("Handling cadidate");
          await peerConnectionRef.current!.addIceCandidate(
            new RTCIceCandidate(payload),
          );
        }
      } catch (error) {
        console.error("Error processing signaling message:", msg.type, error);
      }
    });
  }, [messages, parsedChannelId, sendSignalingMessage, currentUserId, endCall]);
  console.log(currentUserId);
  // Handle call initiation
  const startCall = async () => {
    if (!currentUserId || !channelId) {
      alert("Please provide a Call ID and ensure you are logged in.");
      return;
    }

    const stream = await initLocalStream();
    if (!stream) return;

    const pc = createPeerConnection(stream);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await sendSignalingMessage({
      channelid: parsedChannelId,
      hostid: currentUserId,
      type: "offer",
      payload: JSON.stringify(offer),
    });

    console.log("Call initiated, offer sent.");
  };

  // Handle accepting a call
  const acceptCall = async (incomingCallId: string) => {
    setChannelId(incomingCallId);

    const stream = await initLocalStream();
    if (!stream) return;

    const pc = createPeerConnection(stream);

    peerConnectionRef.current = pc;

    if (offer) {
      const payload = JSON.parse(offer.payload);
      peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(payload),
      );
      const answer = await pc.createAnswer();
      peerConnectionRef.current.setLocalDescription(answer);
      await sendSignalingMessage({
        channelid: incomingCallId as Id<"channels">,
        hostid: currentUserId,
        type: "answer",
        payload: JSON.stringify(answer),
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 row-span-2">
      <div className="mb-6 w-full max-w-md">
        <div className="flex items-center space-x-2 mb-4 text-center">
          Channel ID: {channelId}
        </div>

        <div className="flex space-x-4 justify-center">
          <button
            onClick={startCall}
            disabled={isConnected || !channelId}
            className={`px-6 py-3 rounded-md ${
              isConnected || !channelId
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Start Call
          </button>
          <button
            onClick={() => acceptCall(channelId)}
            disabled={isConnected || !channelId}
            className={`px-6 py-3 rounded-md ${
              isConnected || !channelId
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Join
          </button>
          <button
            onClick={endCall}
            disabled={!isConnected && !channelId} // Can end if connected or just want to clear callId
            className={`px-6 py-3 rounded-md ${
              !isConnected && !channelId
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            End Call
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="rounded-lg shadow-md p-4 bg-secondary">
          <h2 className="text-xl font-semibold mb-4">
            Local Video ({currentUserId})
          </h2>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 bg-black rounded-md"
          />
        </div>
        <div className="bg-secondary rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Remote Video</h2>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-64 bg-black rounded-md"
          />
        </div>
      </div>
      {isConnected && (
        <p className="mt-4 text-green-600 font-semibold">
          Connection Status: Connected
        </p>
      )}
      {!isConnected && channelId && (
        <p className="mt-4 text-orange-600 font-semibold">
          Connection Status: Connecting...
        </p>
      )}
      {!isConnected && !channelId && (
        <p className="mt-4 text-gray-600 font-semibold">
          Connection Status: Idle
        </p>
      )}
    </div>
  );
}
