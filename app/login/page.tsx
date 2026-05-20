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

      <div className="absolute inset-0 bg-[#101B3D]/80" />

      <header className="absolute left-0 right-0 top-0 z-20 px-4 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="/"
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F7E7CE]/70 bg-white/10 text-base font-black tracking-[0.12em] text-[#F7E7CE] shadow-lg backdrop-blur-xl sm:h-20 sm:w-20 sm:text-lg"
          >
            TWCC
          </a>

          <a
            href="/"
            className="rounded-full border border-[#F7E7CE]/50 bg-white/10 px-6 py-3 text-sm font-semibold text-[#F7E7CE] backdrop-blur-xl transition hover:bg-[#F7E7CE] hover:text-[#101B3D]"
          >
            Home
          </a>
        </div>
      </header>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
        <div className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#F7E7CE]">
              Member Access
            </p>

            <h1 className="mt-4 text-3xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/70">
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
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none placeholder:text-gray-400 focus:border-[#F7E7CE]"
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
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none placeholder:text-gray-400 focus:border-[#F7E7CE]"
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
              className="w-full rounded-full bg-[#F7E7CE] px-6 py-3 text-sm font-bold text-[#101B3D] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-white/55">
            Called to worship, chosen to serve.
          </p>
        </div>
      </section>
    </main>
  );
}