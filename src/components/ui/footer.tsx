import { Icons } from "../icons";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export default function Footer() {
  return (
    <footer className="px-16 bg-card py-6 grid md:grid-cols-[200px_minmax(900px, 1fr)] grid-cols-1">
      <div className="flex items-center gap-4">
        <Icons.sphere className="w-12 h-12" />
        <span className={`${pacifico.className} text-3xl`}>Sphere</span>
      </div>

      <div className="py-6 ">
        {/* <span className="text-lg py-4 me-4">Made by</span> */}
        <ul className="flex flex-wrap list-none gap-2 items-center">
          <li className="bg-background px-4 py-2 rounded-[4vw]">
            Jasdeep Singh Dhillon
          </li>
          <li className="bg-background px-4 py-2 rounded-[4vw]">
            Diksha Smotra
          </li>
          <li className="bg-background px-4 py-2 rounded-[4vw]">
            Krish Lavani
          </li>
        </ul>
      </div>
    </footer>
  );
}
