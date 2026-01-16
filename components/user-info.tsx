"use client";

import { User } from "lucide-react";
import { useAuthContext } from "@/providers/auth-provider";
import { Card, CardContent } from "@/components/ui/card";

export function UserInfo() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.name || user.username}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.office || "MCRO"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}