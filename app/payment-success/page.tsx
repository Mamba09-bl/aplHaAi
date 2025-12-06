"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentSuccessClient() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
      <div className="bg-white/10 border border-white/20 p-10 rounded-2xl shadow-xl text-center max-w-lg">
        <h1 className="text-3xl font-bold text-green-400 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-300 mb-6">
          Thank you for upgrading to <span className="text-yellow-300">ALPHA PLUS</span>.
        </p>

        {sessionId && (
          <p className="text-sm text-gray-500">Session ID: {sessionId}</p>
        )}

        <a
          href="/chat"
          className="mt-6 inline-block bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-black font-bold transition"
        >
          Back to Chat
        </a>
      </div>
    </div>
  );
}
