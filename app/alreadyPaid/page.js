"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function AlreadyPaidPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center 
      bg-gradient-to-br from-[#0f0f0f] via-[#1c1c1c] to-black p-6"
    >
      <div
        className="w-full max-w-lg bg-white/5 backdrop-blur-xl 
        border border-white/10 rounded-2xl shadow-2xl p-10 text-center"
      >
        <h1 className="text-4xl font-extrabold text-[#D2E823] mb-4">
          You Already Have AlphaPlus
        </h1>

        <p className="text-gray-300 text-lg mb-6">
          Your subscription is active — enjoy unlimited access, faster model
          performance, and premium tools.
        </p>

        <div
          className="bg-green-600/20 border border-green-500 
          text-green-300 font-semibold p-4 rounded-xl shadow-lg mb-8"
        >
          ✓ Membership Verified — AlphaPlus Enabled
        </div>

        <button
          onClick={() => router.push("/chat")}
          className="px-6 py-3 bg-[#254F1A] text-[#D2E823] 
            font-semibold rounded-xl hover:bg-[#3a7a2b] transition-all shadow-lg"
        >
          Go Back to Chat
        </button>
      </div>
    </div>
  );
}
