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
    <main className="grid min-h-screen bg-[#F8F5EE] text-[#1F2937] lg:grid-cols-2">
      {/* Motion Side */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#101B3D] lg:block">
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

        <div className="relative z-10 flex min-h-screen flex-col justify-end p-12 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            TWCC
          </p>

          <h1 className="mt-4 text-5xl font-bold leading-tight">
            The World Class Choir
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-white/75">
            Manage choir communication, rehearsals, attendance, welfare, songs,
            and service memories in one secure platform.
          </p>
        </div>
      </section>

      {/* Login Form Side */}
      <section className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-lg">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              TWCC
            </p>

            <h1 className="mt-3 text-3xl font-bold text-[#101B3D]">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to The World Class Choir portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
              />
            </div>

            {message && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <a
            href="/"
            className="mt-6 block text-center text-sm font-semibold text-[#101B3D]"
          >
            Back to Home
          </a>
        </div>
      </section>
    </main>
  );
}