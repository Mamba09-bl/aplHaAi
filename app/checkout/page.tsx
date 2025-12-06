"use client";
import CheckoutPage from "../components/CheckoutPage";
import convertToSubcurrency from "../../lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const amount = 49.99;

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1c1c1c] to-black p-6">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-10 text-center">

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#D2E823]">AlphaPlus</h1>

          <h2 className="text-xl text-gray-300 mt-2">
            Upgrade now for only{" "}
            <span className="font-bold text-[#D2E823]">${amount}</span>
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Unlock unlimited AI access, faster responses, and premium tools.
          </p>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "usd",
          }}
        >
          <CheckoutPage amount={amount} />
        </Elements>

      </div>
    </main>
  );
}
