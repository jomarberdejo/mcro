import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { ProfileClient } from "@/components/profile/profile";


async function getCurrentUserInfo(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      office: true,
      role: true,
      createdAt: true,
      _count: {
        select: { auditTrails: true },
      },
    },
  });
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  // console.log(user)

  if (!user) redirect("/login");

   

  const userInfo = await getCurrentUserInfo(user.userId as string);

  if (!userInfo) redirect("/login");

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account information and password.
        </p>
      </div>

      <ProfileClient user={userInfo} />
    </div>
  );
}
