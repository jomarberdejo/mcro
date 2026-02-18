import { jwtVerify, type JWTPayload as JoseJWTPayload } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export interface JWTPayload extends JoseJWTPayload {
  userId: string;
  username: string;
  office: string | null;
}

export async function verifyAuth(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload;

    if (
      typeof payload.userId === "string" &&
      typeof payload.username === "string" &&
      (typeof payload.office === "string" || payload.office === null)
    ) {
      return payload as JWTPayload;
    }

    return null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
