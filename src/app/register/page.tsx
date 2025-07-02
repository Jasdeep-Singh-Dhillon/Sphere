"use client";
import { Label } from "~/components/ui/label";
import { FormEvent, useState } from "react";
import { z } from "zod/v4";
import useAppForm from "~/lib/app-form";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Icons } from "~/components/ui/icons";
import { signUp } from "~/lib/auth-client";
import { Loader2Icon } from "lucide-react";
import { redirect } from "next/navigation";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | undefined>();
  const registerForm = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1, { error: "Name is required" }),
        email: z.string({ error: "Email is required" }),
        password: z.string({ error: "Password is required" }),
        confirmpassword: z.string(),
      }),
      onSubmit: z.object({
        email: z.email({ error: "Enter a valid email address" }),
        password: z
          .string()
          .min(6, { error: "Password must be at least 6 characters" }),
        name: z
          .string()
          .min(3, { error: "Name must be at least 3 characters" }),
        confirmpassword: z.string(),
      }),
    },
    onSubmit: async function ({
      value,
    }: {
      value: {
        email: string;
        password: string;
        name: string;
        confirmpassword: string;
      };
    }) {
      try {
        signUp
          .email(
            {
              email: value.email,
              password: value.password,
              name: value.name,
            },
            {
              onRequest: () => {
                setLoading(true);
              },
              onSuccess: () => {
                setLoading(false);
                redirect("/channels");
              },
              onError: (ctx) => {
                setLoading(false);
                setRegisterError(ctx.error.message);
              },
            },
          )
          .then(({ data, error }) => {
            console.log(data, error);
          });
      } catch (error) {
        console.log(error);
      }
    },
  });
  function formSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    registerForm.handleSubmit();
  }
  return (
    <div className="gradient w-full h-dvh flex justify-center items-center min-h-screen ">
      <form
        onSubmit={formSubmit}
        className="bg-background/60 backdrop-saturate-100 flex flex-col items-center gap-4 p-8 mx-8 backdrop-blur-xs rounded-2xl shadow w-full max-w-md"
      >
        {/* Logo with link, hover pull-up animation (no shadow) */}
        <Link href="/" aria-label="Go to homepage" className="group">
          <Icons.sphere className="w-16 h-16 mb-2 transition-transform duration-300 group-hover:-translate-y-4" />
        </Link>

        <h2 className="text-3xl font-bold">Create Account</h2>

        <registerForm.AppField name="name">
          {(field) => (
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="name">Name</Label>
              <field.Input
                placeholder="Enter name"
                id="name"
                name="name"
                onBlur={field.handleBlur}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
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
        </registerForm.AppField>

        <registerForm.AppField name="email">
          {(field) => (
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="email">Email</Label>
              <field.Input
                placeholder="Enter email"
                id="email"
                name="email"
                onBlur={field.handleBlur}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
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
        </registerForm.AppField>

        <registerForm.AppField name="password">
          {(field) => (
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="password">Password</Label>
              <field.Input
                placeholder="Enter password"
                id="password"
                name="password"
                type="password"
                onBlur={field.handleBlur}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
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
        </registerForm.AppField>

        <registerForm.AppField name="confirmpassword">
          {(field) => (
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="confirmpassword">Confirm Password</Label>
              <field.Input
                placeholder="Enter username"
                id="confirmpassword"
                name="confirmpassword"
                onBlur={field.handleBlur}
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  if (
                    e.target.value.length > 0 &&
                    registerForm.getFieldValue("password") !== e.target.value
                  ) {
                    field.state.meta.errors.push({
                      message: "Passwords do not match",
                    });
                  }
                }}
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
        </registerForm.AppField>

        {/* TODO: Implement better date picker */}
        {/* <registerForm.AppField name="dateofbirth">
          {(field) => (
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="dateofbirth">Date of Birth</Label>
              <field.Select>
                <SelectTrigger className="border-primary/40">
                  <SelectValue
                    placeholder="Select Date"
                    defaultValue={field.state.value}
                  />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => 1 + i).map(
                    (date, index) => (
                      <SelectItem key={index} value={`${date}`}>
                        {date}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </field.Select>
              {!field.state.meta.isValid ? (
                <em role="alert" className="text-red-400">
                  {field.state.meta.errors[0]?.message}
                </em>
              ) : (
                ""
              )}
            </div>
          )}
        </registerForm.AppField> */}

        <registerForm.AppForm>
          <registerForm.Button
            type="submit"
            variant={"secondary"}
            className="bg-accent flex w-full max-w-sm items-center hover:bg-accent/50"
            disabled={loading}
          >
            Continue
            {loading ? <Loader2Icon className="animate-spin" /> : ""}
          </registerForm.Button>
        </registerForm.AppForm>

        {registerError ? (
          <em role="alert" className="text-red-400">
            {registerError}
          </em>
        ) : (
          ""
        )}

        <Button
          className="grid w-full max-w-sm items-center gap-3"
          formNoValidate
          type="button"
        >
          <Link href="/login">Already have an account?</Link>
        </Button>
      </form>
    </div>
  );
}
