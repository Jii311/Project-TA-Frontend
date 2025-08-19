"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { authFormSchema } from "@/lib/zod";
import LoginInput from "@/components/LoginInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Login() {
  const [globalError, setGlobalError] = useState<{
    message: string;
  } | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof authFormSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setGlobalError({ message: data.error || "Login gagal" });
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("roles", JSON.stringify(data.roles || []));
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("name", data.name);

      const roles: string[] = data.roles || [];
      if (roles.includes("admin")) {
        router.push("/admin");
        toast.success("Login berhasil, selamat datang!");
      } else {
        router.push("/login");
        toast.error("Anda tidak memiliki akses");
      }
    } catch (error) {
      console.error(error);
      setGlobalError({ message: "Email atau Password salah" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (globalError) {
      toast.error(globalError.message);
    }
  }, [globalError]);

  return (
    <div className="w-full h-screen flex items-center justify-center p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">
          <h1 className="login-header">Login</h1>
          <div className="flex flex-col gap-4">
            <LoginInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="Enter Email"
            />
            <LoginInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter Password"
            />
          </div>
          <Button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                &nbsp; Loading...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
