"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ChatChannel = {
  id: string;
  name: string;
  description: string | null;
  channel_type: string;
  section: string | null;
  created_at: string;
};

export default function ChatPage() {
  const [channel, setChannel] = useState<ChatChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchGeneralChat() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("chat_channels")
      .select("id, name, description, channel_type, section, created_at")
      .eq("channel_type", "general")
      .limit(1)
      .single();

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setChannel(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchGeneralChat();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              TWCC
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
              General Choir Chat
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              One shared chat space for all TWCC members.
            </p>
          </div>

          <a
            href="/dashboard"
            className="w-fit rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
          >
            Back to Dashboard
          </a>
        </header>

        {message && (
          <section className="mb-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">
            {message}
          </section>
        )}

        {loading && (
          <section className="rounded-3xl border border-black/5 bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
            Loading general chat...
          </section>
        )}

        {!loading && !channel && (
          <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#101B3D]">
              General chat not found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Please create the General Choir Chat channel in Supabase.
            </p>
          </section>
        )}

        {!loading && channel && (
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  General
                </span>

                <h2 className="mt-4 text-2xl font-bold text-[#101B3D]">
                  {channel.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {channel.description || "Main chat for all choir members."}
                </p>
              </div>

              <a
                href={`/chat/${channel.id}`}
                className="rounded-full bg-[#101B3D] px-6 py-3 text-center text-sm font-semibold text-white"
              >
                Open General Chat
              </a>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}