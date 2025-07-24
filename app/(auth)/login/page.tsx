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
import { credentialsSignin } from "@/app/actions/actions";
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
      const result = await credentialsSignin(values);

      if (result?.message) {
        setGlobalError({ message: result.message });
      }

      router.push("/admin");
    } catch (error) {
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
