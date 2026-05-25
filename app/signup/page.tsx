"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export default function SignupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    pcf_cell: "",
    kingschat_id: "",
    section: "",
    gender: "",
    address: "",
    date_of_birth: "",
    marital_status: "single",
    wedding_anniversary: "",
  });

  function updateField(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData((prev) => ({
        ...prev,
        phone: value.replace(/\D/g, ""),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const cleanEmail = formData.email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      setLoading(false);
      setMessage("Please enter a valid email address.");
      return;
    }

    if (formData.phone && formData.phone.length < 7) {
      setLoading(false);
      setMessage("Please enter a valid phone number.");
      return;
    }

    const { data: signupData, error: signupError } =
      await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          },
        },
      });

    if (signupError) {
      setLoading(false);
      setMessage(signupError.message);
      return;
    }

    const user = signupData.user;
    const session = signupData.session;

    if (session && user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: formData.full_name,
        email: cleanEmail,
        role: "member",
      });

      if (profileError) {
        setLoading(false);
        setMessage(profileError.message);
        return;
      }
    }

    const { error: signupInfoError } = await supabase
      .from("member_signups")
      .insert({
        user_id: session && user ? user.id : null,
        full_name: formData.full_name,
        email: cleanEmail,
        phone: formData.phone || null,
        pcf_cell: formData.pcf_cell || null,
        kingschat_id: formData.kingschat_id || null,
        section: formData.section || null,
        gender: formData.gender || null,
        address: formData.address || null,
        date_of_birth: formData.date_of_birth || null,
        marital_status: formData.marital_status || null,
        wedding_anniversary:
          formData.marital_status === "married" &&
          formData.wedding_anniversary
            ? formData.wedding_anniversary
            : null,
        signup_status: "pending",
      });

    if (signupInfoError) {
      setLoading(false);
      setMessage(signupInfoError.message);
      return;
    }

    setLoading(false);
    router.push("/signup/success");
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

      <div className="absolute inset-0 bg-[#101B3D]/85" />

      <header className="absolute left-0 right-0 top-0 z-20 px-4 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="/"
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F7E7CE]/70 bg-white/10 text-base font-black tracking-[0.12em] text-[#F7E7CE] shadow-lg backdrop-blur-xl sm:h-20 sm:w-20 sm:text-lg"
          >
            TWCC
          </a>

          <a
            href="/login"
            className="rounded-full border border-[#F7E7CE]/50 bg-white/10 px-6 py-3 text-sm font-semibold text-[#F7E7CE] backdrop-blur-xl transition hover:bg-[#F7E7CE] hover:text-[#101B3D]"
          >
            Login
          </a>
        </div>
      </header>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-28">
        <div className="w-full max-w-3xl rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#F7E7CE]">
              Join TWCC
            </p>

            <h1 className="mt-4 text-3xl font-bold text-white">
              Member Signup
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/70">
              Create your account and submit your choir information. Access is
              limited while the portal is being prepared.
            </p>
          </div>

          <form onSubmit={handleSignup} className="mt-8 space-y-6">
            <section className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-white/80">
                  Full Name
                </label>

                <input
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={updateField}
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none placeholder:text-gray-400 focus:border-[#F7E7CE]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80">
                  Email Address
                </label>

                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none placeholder:text-gray-400 focus:border-[#F7E7CE]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80">
                  Password
                </label>

                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={updateField}
                  placeholder="Create password"
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none placeholder:text-gray-400 focus:border-[#F7E7CE]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80">
                  Phone Number
                </label>

                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.phone}
                  onChange={updateField}
                  placeholder="080..."
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none placeholder:text-gray-400 focus:border-[#F7E7CE]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80">
                  PCF / CELL
                </label>

                <input
                  name="pcf_cell"
                  type="text"
                  value={formData.pcf_cell}
                  onChange={updateField}
                  placeholder="Enter your PCF or Cell"
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none placeholder:text-gray-400 focus:border-[#F7E7CE]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80">
                  KingsChat ID
                </label>

                <input
                  name="kingschat_id"
                  type="text"
                  value={formData.kingschat_id}
                  onChange={updateField}
                  placeholder="Enter your KingsChat ID"
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none placeholder:text-gray-400 focus:border-[#F7E7CE]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80">
                  Choir Section
                </label>

                <select
                  name="section"
                  value={formData.section}
                  onChange={updateField}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none focus:border-[#F7E7CE]"
                >
                  <option value="">Select section</option>
                  <option value="soprano">Soprano</option>
                  <option value="alto">Alto</option>
                  <option value="tenor">Tenor</option>
                  <option value="bass">Bass</option>
                  <option value="instrumentalist">Instrumentalist</option>
                  <option value="choir_leader">Choir Leader</option>
                  <option value="music_director">Music Director</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-white/80">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={updateField}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none focus:border-[#F7E7CE]"
                >
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-white/80">
                  Date of Birth
                </label>

                <input
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={updateField}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none focus:border-[#F7E7CE]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80">
                  Marital Status
                </label>

                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={updateField}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none focus:border-[#F7E7CE]"
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              {formData.marital_status === "married" && (
                <div>
                  <label className="text-sm font-medium text-white/80">
                    Wedding Anniversary
                  </label>

                  <input
                    name="wedding_anniversary"
                    type="date"
                    value={formData.wedding_anniversary}
                    onChange={updateField}
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none focus:border-[#F7E7CE]"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-white/80">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={updateField}
                  placeholder="Your address"
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm text-[#101B3D] outline-none placeholder:text-gray-400 focus:border-[#F7E7CE]"
                />
              </div>
            </section>

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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}