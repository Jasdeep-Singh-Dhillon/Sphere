import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Video, MonitorCog, Gauge, Images, ShieldUser } from "lucide-react";

export default function Features() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
      <Card className="hover:bg-foreground/10 backdrop-blur-sm rounded-[4vw] p-8">
        <CardHeader>
          <CardTitle className="flex gap-4 items-center">
            <Video />
            {"HD Voice & Video"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {
              "Crystal-clear audio and high-definition video calls with noise suppression technology."
            }
          </p>
        </CardContent>
      </Card>
      <Card className="hover:bg-foreground/10 backdrop-blur-sm rounded-[4vw] p-8">
        <CardHeader>
          <CardTitle className="flex gap-4 items-center">
            <MonitorCog />
            {"Cross Platform"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {
              "Accessible on every platform with seamless sync."
            }
          </p>
        </CardContent>
      </Card>
      <Card className="hover:bg-foreground/10 backdrop-blur-sm rounded-[4vw] p-8">
        <CardHeader>
          <CardTitle className="flex gap-4 items-center">
            <Gauge />
            {"Lightining Fast"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {
              "Optimized performance with instant message delivery and minimal latency."
            }
          </p>
        </CardContent>
      </Card>
      <Card className="hover:bg-foreground/10 backdrop-blur-sm rounded-[4vw] p-8">
        <CardHeader>
          <CardTitle className="flex gap-4 items-center">
            <Images />
            {"Rich Media"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {
              "Share files, images, GIFs, and stream your screen with friends or teams effortlessly."
            }
          </p>
        </CardContent>
      </Card>
      <Card className="hover:bg-foreground/10 backdrop-blur-sm rounded-[4vw] p-8">
        <CardHeader>
          <CardTitle className="flex gap-4 items-center">
            <ShieldUser />
            {"Moderation Tools"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {
              "Track server actions, set up rules to automatically detect and act on spam, offensive language, or problematic content."
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
