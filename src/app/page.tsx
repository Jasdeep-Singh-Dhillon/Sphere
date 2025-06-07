import Features from "@/components/features";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { CirclePlay, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
        <Header />
        <div className="flex flex-col justify-center h-full items-center gap-8 mx-20 py-20">
          <section className="text-7xl font-extrabold text-center mb-2 mt-16">
            <span className="bg-clip-text text-black/60">Connect</span> in your
            digital sphere
          </section>
          <section className="text-2xl text-center w-7/10 mb-16">
            Experience seamless communication with crystal clear voice, instant
            messaging and immersive communities. Built for everyone.
          </section>
          <section className="flex flex-col gap-2 justify-center items-center">
            <Button variant="default" >
              Get started now
              <ChevronRight />
            </Button>
            <Button variant="outline" className="w-full">
              Demo
              <CirclePlay />
            </Button>
          </section>
        </div>
      <div className="gradient absolute top-0 h-[800] w-full -z-10">
      </div>

      <main className="flex flex-col gap-8 row-start-2 items-center my-6">
        <section>
          <Image
            src="/images/homepage_placeholder.png"
            width={500}
            height={200}
            alt="Homepage of the chats tab"
            className="md:hidden shadow-2xl/30 shadow-primary rounded-lg"
          />
          <Image
            src="/images/homepage_placeholder.png"
            width={900}
            height={400}
            alt="Homepage of the chats tab"
            className="hidden md:block m-4 shadow-2xl/30 shadow-primary rounded-lg"
          />
        </section>
        <section className="p-8 text-center flex gap-2 flex-col">
          <div className="text-4xl font-bold mt-4 mb-2">Why Choose Sphere?</div>
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
