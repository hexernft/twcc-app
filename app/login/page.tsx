"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101B3D] text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/twcc-hero-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[#101B3D]/75" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/15 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              TWCC
            </p>

            <h1 className="mt-4 text-3xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/70">
              Login to The World Class Choir portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-white/80">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none placeholder:text-gray-400 focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white/80">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none placeholder:text-gray-400 focus:border-[#D4AF37]"
              />
            </div>

            {message && (
              <div className="rounded-2xl border border-red-200 bg-red-50/95 p-4 text-sm font-semibold text-red-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#101B3D] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 flex justify-center">
            <a
              href="/"
              className="text-sm font-semibold text-white/80 transition hover:text-[#D4AF37]"
            >
              Back to Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}