"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ChatChannel = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export default function ChatPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function openDefaultChat() {
      setLoading(true);
      setMessage("");

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.replace("/login");
        return;
      }

      const { data: channels, error } = await supabase
        .from("chat_channels")
        .select("id, name, description, created_at")
        .order("created_at", { ascending: true });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      const allChannels = (channels || []) as ChatChannel[];

      if (allChannels.length === 0) {
        setMessage("No chat channel has been created yet.");
        setLoading(false);
        return;
      }

      const generalChannel =
        allChannels.find((channel) =>
          channel.name.toLowerCase().includes("general")
        ) || allChannels[0];

      router.replace(`/chat/${generalChannel.id}`);
    }

    openDefaultChat();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
          TWCC Chat
        </p>

        <h1 className="mt-4 text-2xl font-bold text-[#101B3D]">
          {loading ? "Opening Chat..." : "Chat Not Available"}
        </h1>

        <p className="mx-auto mt-3 text-sm leading-6 text-gray-600">
          {loading
            ? "Please wait while we take you straight to the choir chat."
            : message}
        </p>

        {!loading && (
          <a
            href="/dashboard"
            className="mt-6 inline-block rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Dashboard
          </a>
        )}
      </div>
    </div>
  );
}