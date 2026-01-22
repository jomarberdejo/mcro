"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, User, ShieldCheck, Copyright } from "lucide-react";
import { Suspense, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/constants/schema";
import Image from "next/image";
import { toast } from "sonner";
import { Separator } from "../ui/separator";

function LoginFormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Login successful");

        const redirectTo = searchParams.get("redirect");

        if (redirectTo && redirectTo.startsWith("/admin")) {
          router.push(redirectTo);
        } else {
          router.push("/admin/dashboard");
        }
      } else {
        const errorData = await res.json();
        toast.error("Login failed", {
          description: errorData.error || "Login failed, try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full overflow-hidden max-w-sm mx-auto border-0 shadow-2xl p-0">
        <CardContent>
          <div className="py-4
          ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-center p-2"
            >
              <div className="mx-auto space-y-2 max-w-[400px] w-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-lg bg-white/10 backdrop-blur-sm">
                    <Image
                      src="/logos/mcro.png"
                      alt="Municipal Civil Registrar Office Logo"
                      className="mx-auto object-contain"
                      width={150}
                      height={150}
                      priority
                    />
                  </div>
                </div>

                <div className="space-y-2 text-center md:text-left">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Welcome Back
                  </h1>
                  <p className="text-base text-gray-600">
                    Please sign in to continue.
                  </p>
                </div>

                <Separator className="my-4"/>

                <FieldGroup>
                  <div className="space-y-5">
                    <Controller
                      name="username"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel
                            htmlFor="username"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Username
                          </FieldLabel>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              id="username"
                              type="text"
                              placeholder="Enter your username"
                              className={cn(
                                "h-12 pl-10 text-base transition-all",
                                fieldState.invalid &&
                                "border-red-500 focus-visible:ring-red-500"
                              )}
                              {...field}
                              aria-invalid={fieldState.invalid}
                            />
                          </div>
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="password"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel
                            htmlFor="password"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Password
                          </FieldLabel>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className={cn(
                                "h-12 pl-10 pr-10 text-base transition-all",
                                fieldState.invalid &&
                                "border-red-500 focus-visible:ring-red-500"
                              )}
                              {...field}
                              aria-invalid={fieldState.invalid}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Button
                      type="submit"
                      className="h-12 w-full text-base font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Signing in...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </FieldGroup>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}