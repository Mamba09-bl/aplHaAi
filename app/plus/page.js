"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function AlphaPlusCard() {
  const router = useRouter();

  useEffect(() => {
    const checkPaid = async () => {
      const res = await fetch("/api/chat");
      const result = await res.json();

      if (result.alreadyPaid) {
        router.replace("/alreadyPaid");
      }
    };

    checkPaid();
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 shadow-2xl text-white select-none">
      <h2 className="text-2xl font-bold mb-2">AlphaPlus</h2>
      <p className="text-xs text-gray-400 mb-6">Unlock advanced power</p>

      <div className="text-4xl font-bold">
        $49.99<span className="text-sm">/month</span>
      </div>

      <a
        href="/checkout"
        className="block w-full mt-4 py-2 rounded-lg 
             bg-gradient-to-r from-[#254F1A] to-[#3E7A2C] 
             text-[#D2E823] font-semibold text-center
             hover:from-[#3A7A2B] hover:to-[#4FAE3B]
             transition-all duration-300 shadow-lg shadow-[#254F1A]/40"
      >
        Upgrade
      </a>

      <ul className="mt-6 space-y-3 text-sm text-gray-300">
        <li className="flex items-center gap-2">
          <span className="text-[#D2E823]">★</span> Smarter and deeper responses
        </li>
        <li className="flex items-center gap-2">
          <span className="text-[#D2E823]">★</span> Longer chats & higher upload
          limits
        </li>
        <li className="flex items-center gap-2">
          <span className="text-[#D2E823]">★</span> High‑quality AI image
          generation
        </li>
        <li className="flex items-center gap-2">
          <span className="text-[#D2E823]">★</span> More context memory for
          accuracy
        </li>
        <li className="flex items-center gap-2">
          <span className="text-[#D2E823]">★</span> Tools for automation &
          planning
        </li>
      </ul>

      <p className="text-[10px] text-gray-500 mt-6">
        Available in supported regions only.
      </p>
    </div>
  );
}
