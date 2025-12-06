import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode("MY_SUPER_SECRET_123");

export async function getUser() {
  const cookieStore = await cookies(); // <-- FIXED

  const customToken = cookieStore.get("token")?.value;
  const nextAuthToken = cookieStore.get("next-auth.session-token")?.value;

  // CUSTOM JWT LOGIN
  if (customToken) {
    try {
      const { payload } = await jwtVerify(customToken, SECRET);
      return { type: "custom", user: payload };
    } catch {
      return null;
    }
  }

  // NEXTAUTH LOGIN
  if (nextAuthToken) {
    const sessionRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/session`,
      {
        headers: {
          Cookie: `next-auth.session-token=${nextAuthToken}`,
        },
      }
    );

    const session = await sessionRes.json();
    return { type: "nextauth", user: session?.user };
  }

  return null;
}
