"use client";
import { Icons } from "~/components/ui/icons";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import useAppForm from "~/lib/app-form";
import Link from "next/link";

import { ChangeEvent, FormEvent } from "react";
import z from "zod/v4";

export default function Login() {
  const loginForm = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: z.object({
        email: z
          .email({
            message: "Enter a valid email address",
          })
          .min(1, {
            message: "Email is required",
          }),
        password: z.string().min(1, {
          message: "Password is required",
        }),
      }),
    },
    onSubmit: async function ({ value }) {
      console.log(value);
    },
  });

  function formSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginForm.handleSubmit();
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
            onClick={() => {
              console.log("Google Sign In Clicked");
            }}
          >
            <Icons.google className="w-5 h-5" />
            Continue with Google
          </Button>
          <Button
            type="button"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg shadow-primary shadow-2xl/30"
            onClick={() => {
              console.log("Apple Sign In Clicked");
            }}
          >
            <Icons.apple className="w-5 h-5" />
            Continue with Apple
          </Button>

          <Button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg shadow-primary shadow-2xl/30"
            onClick={() => {
              console.log("GitHub Sign In Clicked");
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
          className="w-full flex flex-col justify-center items-center gap-4"
          onSubmit={formSubmit}
        >
          <loginForm.AppField name="email">
            {(field) => (
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="email">Email</Label>
                <field.Input
                  placeholder="Enter Email"
                  id="email"
                  name="email"
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                  type="text"
                  className="border-primary/40"
                />
                {!field.state.meta.isValid ? (
                  <em role="alert" className="text-red-400">
                    {field.state.meta.errors[0]?.message}
                  </em>
                ) : (
                  ""
                )}
              </div>
            )}
          </loginForm.AppField>
          <loginForm.AppField name="password">
            {(field) => (
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="password">Password</Label>
                <field.Input
                  placeholder="Enter password"
                  id="password"
                  name="password"
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                  type="password"
                  className="border-primary/40"
                />
                {!field.state.meta.isValid ? (
                  <em role="alert" className="text-red-400">
                    {field.state.meta.errors[0]?.message}
                  </em>
                ) : (
                  ""
                )}
              </div>
            )}
          </loginForm.AppField>

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
