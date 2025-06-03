import Features from "@/components/ui/features";
import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { CirclePlay, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="gradient">
        <Header />
        <div className="flex flex-col justify-center h-full items-center gap-8 mx-20 py-20">
          <section className="text-7xl font-extrabold text-center">
            <span className="bg-clip-text text-black/60">Connect</span> in your
            digital sphere
          </section>
          <section className="text-2xl my-6 text-center font-semibold">
            Experience seamless communication with crystal clear voice, instant
            messaging and immersive communities. Built for everyone.
          </section>
          <section className="flex flex-col gap-2">
            <Button variant="default">
              Get started now
              <ChevronRight />
            </Button>
            <Button variant="outline">
              Demo
              <CirclePlay />
            </Button>
          </section>
        </div>
      </div>
      <main className="flex flex-col gap-8 row-start-2 items-center my-6">
        <section>
          <Image
            src="/images/homepage_placeholder.png"
            width={500}
            height={200}
            alt="Homepage of the chats tab"
            className="md:hidden"
          />
          <Image
            src="/images/homepage_placeholder.png"
            width={900}
            height={400}
            alt="Homepage of the chats tab"
            className="hidden md:block m-4 "
          />
        </section>
        <section className="p-8 text-center flex gap-2 flex-col">
          <div className="text-4xl font-bold my-4">Why Choose Sphere?</div>
          <span className="mb-6">
            Packed with features that make communication effortless and
            enjoyable
          </span>
          <Features />
        </section>
      </main>
      <Footer />
    </>
  );
}
