"use client";
import { Label } from "@/components/ui/label";
import { FormEvent } from "react";
import { z } from "zod/v4";
import useAppForm from "@/lib/appForm";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Register() {
  const registerUser = useMutation(api.register.registerUser);
  const registerForm = useAppForm({
    defaultValues: {
      email: "arc@mail.com",
      password: "arc123",
      username: "arc",
      displayName: "Arc",
      dateofbirth: 12,
      monthofbirth: 2,
      yearofbirth: 2020,
    },
    validators: {
      onChange: z
        .object({
          email: z.email({
            message: "Enter a valid email",
          }),
          password: z.string().min(6, {
            message: "Password must be at least 6 characters",
          }),
          username: z.string().min(3, {
            message: "Username must be at least 3 characters",
          }),
          displayName: z.string().min(3, {
            message: "Display Name must be at least 3 characters",
          }),
          dateofbirth: z.number().min(1).max(31),
          monthofbirth: z.number().min(0).max(11),
          yearofbirth: z.number().min(1925).max(new Date().getFullYear()),
        })
        .readonly(),
    },
    onSubmit: function ({ value }) {
      console.log("Submitting", value);
      alert(JSON.stringify(value, null, 2));

      registerUser({
        username: value.username,
        displayName: value.displayName,
        email: value.email,
        password: value.password,
      });
    },
  });
  function formSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // console.log(registerForm.getFieldValue("email"));
    // console.log(registerForm.getFieldValue("displayName"));
    // console.log(registerForm.getFieldValue("username"));
    console.log(typeof registerForm.getFieldValue("dateofbirth"));
    if (registerForm.validate("submit")) {
      console.log(registerForm.getAllErrors());
    }
    registerForm.handleSubmit();
  }
  return (
    <div className="gradient w-full h-dvh  ">
      <form
        onSubmit={formSubmit}
        className="bg-background/70 backdrop-saturate-100 flex flex-col items-center gap-4 justify-center p-8 m-auto"
      >
        <registerForm.AppField name="username">
          {(field) => (
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="username">Username</Label>
              <field.Input
                placeholder="Enter username"
                id="username"
                name="username"
                onBlur={field.handleBlur}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </registerForm.AppField>

        <registerForm.AppField name="displayName">
          {(field) => (
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="displayname">Display Name</Label>
              <field.Input
                placeholder="Enter displayname"
                id="displayname"
                name="displayName"
                onBlur={field.handleBlur}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
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
              />
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
                onBlur={field.handleBlur}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </registerForm.AppField>

        {/* TODO: Implement better date picker */}
        <registerForm.AppField name="dateofbirth">
          {(field) => (
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="dateofbirth">Date of Birth</Label>
              <field.Input
                placeholder="Enter dateofbirth"
                id="dateofbirth"
                name="dateofbirth"
                onBlur={field.handleBlur}
                value={field.state.value}
                type="number"
                onChange={(e) => {
                  console.log(e.target.value);
                  field.handleChange(parseInt(e.target.value));
                }}
              />
            </div>
          )}
        </registerForm.AppField>

        <registerForm.AppForm>
          <registerForm.Button>Register</registerForm.Button>
        </registerForm.AppForm>
      </form>
    </div>
  );
}
