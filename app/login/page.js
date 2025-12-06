"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function VariantB() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Username: data.Username,
        email: data.email,
        password: data.password,
      }),
    });

    const result = await res.json();

    if (result.success) {
      router.push("/chat");
    } else {
      console.error("Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-[#0f0f0f] via-[#1c1c1c] to-[#000000] 
      px-4 py-10"
    >
      <div
        className="w-full max-w-4xl bg-white/5 backdrop-blur-xl 
        rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 
        shadow-2xl border border-white/10"
      >
        <div className="hidden md:block relative">
          <Image
            src="/Gemini_Generated_Image_7erjzz7erjzz7erj.png"
            alt="illustration"
            fill
            className="object-cover"
          />
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Welcome Back</h2>
          <p className="text-sm text-gray-300 mb-6">
            Log in to your account to access your links.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email"
              className="w-full px-3 py-2 rounded border bg-transparent border-gray-600 text-white"
            />
            {errors.email && (
              <div className="text-xs text-red-500">Required</div>
            )}

            <input
              type="password"
              {...register("password", { required: true, minLength: 3 })}
              placeholder="Password"
              className="w-full px-3 py-2 rounded border bg-transparent border-gray-600 text-white"
            />
            {errors.password && (
              <div className="text-xs text-red-500">Min 3 chars</div>
            )}

            <button className="w-full py-2 rounded bg-[#254F1A] text-[#D2E823] font-semibold">
              Login
            </button>
          </form>

          {/* NEW: Don't have an account */}
          <div className="mt-4 text-center">
            <p className="text-gray-300 text-sm">
              Don’t have an account?{" "}
              <a
                href="/"
                className="text-[#D2E823] font-semibold hover:underline hover:text-[#b4cc1a] transition"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
