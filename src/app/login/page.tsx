"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { credentialSignIn, githubSignIn, googleSignIn } from "@/lib/signIn";
import Link from "next/link";

import { FormEvent, useState } from "react";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  async function signWithPassword(event: FormEvent) {
    event.preventDefault();

    const { message } = await credentialSignIn(
      event.target[0].value,
      event.target[1].value,
    );
    setErrorMessage(message);
  }
  return (
    <div className="gradient h-dvh min-h-screen w-full flex items-center justify-center ">
      <div className=" p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center bg-background/60 ">
        {/* Logo with link and hover pull-up animation */}
        <Link href="/" aria-label="Go to homepage" className="group">
          <Icons.sphere className="w-16 h-16 mb-4 transition-transform duration-300 group-hover:-translate-y-2" />
        </Link>
        <h1 className="text-3xl font-extrabold text-accent mb-2">Login</h1>
        <p className="mb-6 text-center w-full">
          Welcome back! Please enter your credentials.
        </p>
        {/* Social Login Buttons with Icons */}
        <div className="w-full flex flex-col gap-3 mb-6">
          <Button
            type="button"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg shadow-primary shadow-2xl/30"
            onClick={async () => {
              await googleSignIn();
            }}
          >
            <Icons.google className="w-5 h-5" />
            Continue with Google
          </Button>
          <Button
            type="button"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg shadow-primary shadow-2xl/30"
          >
            <Icons.apple className="w-5 h-5" />
            Continue with Apple
          </Button>

          <Button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg shadow-primary shadow-2xl/30"
            onClick={async () => {
              await githubSignIn();
            }}
          >
            <Icons.gitHub className="w-5 h-5" />
            Continue with GitHub
          </Button>
        </div>

        <div className="flex items-center w-full mb-6">
          <div className="flex-grow h-px "></div>
          <span className="mx-3 text-sm">or</span>
          <div className="flex-grow h-px"></div>
        </div>

        <form
          className="w-full flex flex-col justify-center items-center"
          onSubmit={signWithPassword}
        >
          <div className="mb-5 w-full">
            <label htmlFor="email" className="block font-semibold mb-2 ">
              Email
            </label>
            <Input
              type="text"
              name="email"
              id="email"
              className="w-full px-4 py-2 border-primary/40 rounded-lg focus:outline-none focus:ring-2"
              required
            />
          </div>
          <div className="mb-2 w-full">
            <label htmlFor="password" className="block font-semibold mb-2 ">
              Password
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 border-primary/40 "
              required
            />
          </div>

          <div className="mb-4">
            {errorMessage ? (
              <em role="alert" className="text-red-400">
                {errorMessage}
              </em>
            ) : (
              ""
            )}
          </div>

          <Button
            variant={"accent"}
            type="submit"
            className="w-full text-white py-3 rounded-lg font-bold"
          >
            Login
          </Button>
          <div className="flex w-full justify-between items-center text-sm mt-4">
            <Link href="#" className="hover:underline">
              Forgot Password?
            </Link>

            <Link href="/register" className="hover:underline">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
