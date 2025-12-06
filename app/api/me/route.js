import { getUser } from "@/lib/getUser";

export async function GET() {
  const auth = await getUser();

  if (!auth) return Response.json({ user: null });

  return Response.json({ user: auth.user });
}
