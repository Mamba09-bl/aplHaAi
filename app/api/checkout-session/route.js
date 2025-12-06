// app/api/checkout-session/route.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "AlphaPlus Subscription" },
          unit_amount: 4999,
        },
        quantity: 1,
      },
    ],
    success_url: `http://localhost:3000/payment-success?email=${email}&amount=49.99`,
    cancel_url: "http://localhost:3000/checkout",
  });

  return Response.json({ url: session.url });
}
