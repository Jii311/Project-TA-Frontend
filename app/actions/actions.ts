"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function credentialsSignin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    await signIn("credentials", {
      email: email,
      password: password,
      redirectTo: "/admin",
      type: "CredentialsSignin",
    });
  } catch (error) {
    console.log("Login error:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Login Failed, Email or Password is incorrect",
            status: "error",
          };
        default:
          return {
            message: "Something went wrong. Please try again later.",
            status: "error",
          };
      }
    }
    throw error;
  }
}

export async function handleSignOut() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  
  redirect("/login");
}
