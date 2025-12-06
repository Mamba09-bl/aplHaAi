// app/api/create-payment-intent/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const JWT_SECRET = "MY_SUPER_SECRET_123"; // use same secret you use to sign your JWTs

export async function POST(req) {
  try {
    const { amount, email } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }

    // Try to determine customer email:
    // 1) prefer email coming from frontend body
    // 2) fallback to JWT token from cookie (if available)
    let customerEmail = email|| null;

    if (!customerEmail) {
      try {
        const token = req.cookies.get("token")?.value || req.cookies.get("next-auth.session-token")?.value;
        if (token) {
          const payload = jwt.verify(token, JWT_SECRET);
          // payload should contain email if you signed it that way
          if (payload && payload.email) {
            customerEmail = payload.email;
          }
        }
      } catch (err) {
        // token missing/invalid — we simply continue without an email
        console.warn("No JWT email available or invalid token", err?.message || err);
      }
    }

    // Create PaymentIntent and put email into metadata if available


  const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount)), // ensure integer (cents if you already converted)
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: customerEmail, 
      metadata: customerEmail ? { email: customerEmail } : undefined,
    });


    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("create-payment-intent error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// import { NextRequest, NextResponse } from "next/server";
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// export async function POST(request: NextRequest) {
//   try {
//     const { amount } = await request.json();

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: "usd",
      
//       automatic_payment_methods: { enabled: true },
//     });

//     return NextResponse.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error("Internal Error:", error);
//     // Handle other errors (e.g., network issues, parsing errors)
//     return NextResponse.json(
//       { error: `Internal Server Error: ${error}` },
//       { status: 500 }
//     );
//   }
// }