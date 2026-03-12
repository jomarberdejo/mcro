"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, KeyRound, Pencil, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { ProfileUser } from "@/types";


function ProfileInfoForm({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState(user.name ?? "");
  const [email, setEmail] = React.useState(user.email ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: email || null }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success("Profile updated successfully.");
      router.refresh();
    } else {
      toast.error(data.error ?? "Failed to update profile.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={user.username}
            readOnly
            className="bg-muted text-muted-foreground cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="office">Office</Label>
          <Input
            id="office"
            value={user.office ?? "MCRO"}
            readOnly
            className="bg-muted text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="gap-2">
          <Pencil className="h-4 w-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function ChangePasswordForm() {
  const [loading, setLoading] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success(data.message ?? "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(data.error ?? "Failed to change password.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="col-span-full space-y-1.5">
          <Label htmlFor="current-password">
            Current Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              tabIndex={-1}
            >
              {showCurrent ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="new-password">
            New Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              tabIndex={-1}
            >
              {showNew ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm-password">
            Confirm New Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          <KeyRound className="h-4 w-4" />
          {loading ? "Changing..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
}

export function ProfileClient({ user }: { user: ProfileUser }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <div className="bg-muted flex h-14 w-14 shrink-0 items-center justify-center rounded-full">
            {user.role === "ADMIN" ? (
              <ShieldCheck className="h-7 w-7 text-amber-600" />
            ) : (
              <User className="h-7 w-7 text-sky-600" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {user.name ?? user.username}
              </span>
              <Badge
                variant="outline"
                className={
                  user.role === "ADMIN"
                    ? "border-amber-200 bg-amber-100 text-amber-700"
                    : "border-sky-200 bg-sky-100 text-sky-700"
                }
              >
                {user.role}
              </Badge>
            </div>
            <div className="text-muted-foreground flex items-center gap-3 text-sm">
              <span>{user.username}</span>
              <span>·</span>
              <span>{user.office ?? "MCRO"}</span>
              <span>·</span>
              <span>Joined {format(new Date(user.createdAt), "MMM yyyy")}</span>
              <span>·</span>
              <span>{user._count.auditTrails} activity logs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold">Account Information</h2>
          <p className="text-muted-foreground text-sm">
            Update your name and email address.
          </p>
        </div>
        <Separator />
        <ProfileInfoForm user={user} />
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold">Change Password</h2>
          <p className="text-muted-foreground text-sm">
            Enter your current password to set a new one.
          </p>
        </div>
        <Separator />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
