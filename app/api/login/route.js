import { NextResponse } from "next/server";
import userModel from "@/modules/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const SECRET = "MY_SUPER_SECRET_123";
  const { email, password } = await req.json();

  const existing = await userModel.findOne({ email });

  if (!existing) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const isMatch = await bcrypt.compare(password, existing.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const token = jwt.sign({ id: existing._id, email: existing.email }, SECRET);

  const res = NextResponse.json({
    success: true,
    message: "Login successful",
  });

  res.cookies.set("token", token, {
    httpOnly: false, // allows client-side JS to read it
    secure: false, // must be false on localhost
    sameSite: "lax",
    path: "/",
  });

  return res;
}
