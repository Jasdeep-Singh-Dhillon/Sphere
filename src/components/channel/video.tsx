import { useRef } from "react";

export default function Video({ track }: { track: MediaStreamTrack }) {
  const localVideo = useRef<HTMLVideoElement>(null);
  if (localVideo.current)
    localVideo.current.srcObject = new MediaStream([track]);
  return (
    <div>
      <video
        ref={localVideo}
        autoPlay
        playsInline
        className="w-full rounded border-2 border-transparent hover:border-accent"
      ></video>
    </div>
  );
}
