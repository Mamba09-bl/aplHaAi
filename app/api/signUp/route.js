import { NextResponse } from "next/server";
import userModel from "@/modules/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "MY_SUPER_SECRET_123";

export async function POST(req) {
  const { email, password, Username } = await req.json();

  // Check if user already exists
  const existing = await userModel.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 }
    );
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  // Create user
  const user = await userModel.create({
    Username,
    email,
    password: hash,
  });
  console.log(user);

  // Generate JWT token
  const token = jwt.sign({ id: user._id, email: user.email }, SECRET);

  // Create response and set cookie
  const res = NextResponse.json({ success: true, token }, { status: 201 });

  res.cookies.set("token", token, {
    httpOnly: false, // allows client-side JS to read it
    secure: false, // must be false on localhost
    sameSite: "lax",
    path: "/",
  });

  return res;
}
