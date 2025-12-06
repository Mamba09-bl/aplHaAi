import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, name, amount } = await req.json();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // keep this exactly
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "hamza.ahmed.abbasi07@gmail.com",
    to: email,
    subject: "Payment Successful",
    text: `Hello ${name}, we received your payment of $${amount}. Thank you!`,
    html: `<p>Hello <b>${name}</b>,</p><p>We received your payment of <b>$${amount}</b>. Thank you!</p>`,
  });

  return NextResponse.json({ message: "Email sent successfully" });
}
