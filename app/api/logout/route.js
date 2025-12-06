export async function GET() {
  return Response.json(
    { success: true, message: "Logged out" },
    {
      status: 200,
      headers: {
        "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0;", // delete cookie
      },
    }
  );
}
