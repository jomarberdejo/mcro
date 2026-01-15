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
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ShieldCheck, Copyright } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/constants/schema";
import Image from "next/image";
import { toast } from "sonner";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
      })
      if (res.ok) {
        toast.success("Login successful");
        router.push("/admin/birth-certificate");
      } else {
        const errorData = await res.json();
        toast.error("Login failed", {
          description: errorData.error || "Login failed, try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full overflow-hidden border-0 shadow-2xl p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden flex-col justify-between bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 p-10 text-white md:flex">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    Municipal Civil Registrar
                  </h2>
                  <p className="text-sm text-blue-100">LGU Carigara</p>
                </div>
              </div>

              <div className="space-y-4 rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <Image
                  src="/logos/mcro.png"
                  alt="Municipal Civil Registrar Office Logo"
                  className="mx-auto object-contain brightness-0 invert"
                  width={300}
                  height={300}
                  priority
                />
                {/* <div className="space-y-2 text-center">
                  <h3 className="text-lg font-semibold">Civil Registration System</h3>
                  <p className="text-sm text-blue-100">
                    Secure access to vital statistics and civil registration records
                  </p>
                </div> */}
              </div>
            </div>

            <div className="space-y-2 mt-4 text-sm text-blue-100">
              <p className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Authorized Personnel Only
              </p>
              <div className="opacity-75 flex items-center gap-1">
                <Copyright size={10} className="mt-px" />
                <p className="text-xs">
                  {new Date().getFullYear()} LGU Carigara. All rights reserved.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex min-h-[500px] flex-col justify-center p-8 md:p-12"
            >
              <div className="mx-auto w-full max-w-md space-y-8">
                <div className="flex flex-col items-center gap-4 md:hidden">
                  <div className="rounded-full bg-blue-600 p-3">
                    <ShieldCheck className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">
                      Municipal Civil Registrar
                    </h2>
                    <p className="text-sm text-gray-600">LGU Carigara</p>
                  </div>
                </div>

                <div className="space-y-2 text-center md:text-left">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Welcome Back
                  </h1>
                  <p className="text-base text-gray-600">
                    Please sign in to access the civil registration system
                  </p>
                </div>

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
