import { Icons } from "~/components/ui/icons";
import { Button } from "~/components/ui/button";
import { Pacifico } from "next/font/google";
import Link from "next/link";

const pacifico = Pacifico({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export default function Header({className}: {className?: string}) {
  return (
    <header className={`flex items-center gap-4 justify-between w-full p-6 row-span-2 backdrop-blur-xs bg-background/60 z-40 sticky top-0 ${className}`}>
      <Link href="/" className="flex items-center gap-4 hover:scale-105 transition-all delay-75">
        <Icons.sphere className="h-16 w-16" />
        <span className={`text-4xl ${pacifico.className}`}>Sphere</span>
      </Link>
      <Button variant="accent" asChild>
        <Link href={"/login"}>Login</Link>
      </Button>
    </header>
  );
}
