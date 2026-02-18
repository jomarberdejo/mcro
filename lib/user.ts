import { cookies } from "next/headers";
import { verifyAuth } from "./auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  const user = await verifyAuth(token);

  return user;
}
