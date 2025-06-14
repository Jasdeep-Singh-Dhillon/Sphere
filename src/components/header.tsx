import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Pacifico } from "next/font/google";
import Link from "next/link";

const pacifico = Pacifico({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export default function Header() {
  return (
    <header className="flex items-center gap-4 justify-between w-full p-6 row-span-2 backdrop-blur-xs bg-background/60 z-40 sticky top-0">
      <div className="flex items-center gap-4">
        <Icons.sphere className="h-16 w-16" />
        <span className={`text-4xl ${pacifico.className}`}>Sphere</span>
      </div>
      <Button variant="accent" asChild>
        <Link href={"/login"}>Login</Link>
      </Button>
    </header>
  );
}
