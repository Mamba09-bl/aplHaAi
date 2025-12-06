// import Stripe from "stripe";
// import userModel from "@/modules/user";

// // NEW required exports:
// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";
// export const preferredRegion = "auto";
// export const bodyParser = false; // stripe needs raw body

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   const body = await req.text();
//   const signature = req.headers.get("stripe-signature");

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }

//   if (event.type === "payment_intent.succeeded") {
//     const paymentIntent = event.data.object;

//     console.log("EVENT DATA:", paymentIntent);

//     const customerEmail = paymentIntent.metadata.email;

//     console.log("Email from metadata:", customerEmail);

//     if (!customerEmail) {
//       console.log("NO EMAIL FOUND! CANNOT UPDATE USER.");
//       return new Response(null, { status: 200 });
//     }

//     await userModel.findOneAndUpdate(
//       { email: customerEmail },
//       { hasPaid: true, freeMessagesUsed: 0 }
//     );

//     console.log("Payment Success → user upgraded:", customerEmail);
//   }

//   return new Response(null, { status: 200 });
// }

import Stripe from "stripe";
import userModel from "@/modules/user";

export const runtime = "nodejs"; // raw body works only in nodejs runtime

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature"); // ← FIXED

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("WEBHOOK EVENT:", event.type);
  } catch (err) {
    console.log("❌ Webhook error:", err.message);
    return new Response("Webhook signature error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_email;

    console.log("Updating user:", email);

    await userModel.findOneAndUpdate(
      { email },
      { hasPaid: true, freeMessagesUsed: 0 }
    );
  }

  console.log("webhook called....");

  return new Response("OK", { status: 200 });
}
