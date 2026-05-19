"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ChatChannel = {
  id: string;
  name: string;
  description: string | null;
  channel_type: string;
  section: string | null;
};

type ChatMessage = {
  id: string;
  channel_id: string;
  sender_id: string | null;
  message: string | null;
  image_url: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInitials(name: string | null) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ChatRoomPage() {
  const params = useParams();
  const channelId = params.id as string;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [channel, setChannel] = useState<ChatChannel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  function scrollToBottom() {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  async function fetchCurrentUser() {
    const { data } = await supabase.auth.getUser();
    setCurrentUserId(data.user?.id || null);
  }

  async function fetchChannel() {
    const { data, error } = await supabase
      .from("chat_channels")
      .select("id, name, description, channel_type, section")
      .eq("id", channelId)
      .single();

    if (error) {
      setNotice(error.message);
      return;
    }

    setChannel(data);
  }

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("chat_messages")
      .select(
        `
        id,
        channel_id,
        sender_id,
        message,
        image_url,
        created_at,
        profiles (
          full_name,
          avatar_url
        )
      `
      )
      .eq("channel_id", channelId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (error) {
      setNotice(error.message);
      return;
    }

    setMessages(((data || []) as unknown) as ChatMessage[]);
    scrollToBottom();
  }

  async function loadChatRoom() {
    setLoading(true);
    setNotice("");

    await fetchCurrentUser();
    await fetchChannel();
    await fetchMessages();

    setLoading(false);
  }

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();

    if (!trimmedMessage) return;

    setSending(true);
    setNotice("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user?.id) {
      setSending(false);
      setNotice("You must be logged in to send a message.");
      return;
    }

    const { error } = await supabase.from("chat_messages").insert({
      channel_id: channelId,
      sender_id: userData.user.id,
      message: trimmedMessage,
      image_url: null,
    });

    if (error) {
      setSending(false);
      setNotice(error.message);
      return;
    }

    setNewMessage("");
    setSending(false);
  }

  useEffect(() => {
    if (channelId) {
      loadChatRoom();
    }
  }, [channelId]);

  useEffect(() => {
    if (!channelId) return;

    const subscription = supabase
      .channel(`chat-room-${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `channel_id=eq.${channelId}`,
        },
        async () => {
          await fetchMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5EE] px-4">
        <div className="rounded-3xl bg-white px-6 py-4 text-sm font-semibold text-gray-500 shadow-sm">
          Loading chat...
        </div>
      </main>
    );
  }

  if (!channel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5EE] px-4">
        <div className="rounded-3xl bg-red-50 px-6 py-4 text-sm font-semibold text-red-700 shadow-sm">
          {notice || "Chat channel not found."}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EE] text-[#1F2937]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col bg-[#F8F5EE] shadow-xl">
        {/* TWCC Chat Header */}
        <header className="sticky top-0 z-20 bg-[#101B3D] px-4 py-3 text-white shadow-md">
          <div className="flex items-center gap-3">
            <a
              href="/chat"
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold hover:bg-white/10"
            >
              ‹
            </a>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D4AF37] text-sm font-bold text-[#101B3D]">
              TW
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-bold">{channel.name}</h1>
              <p className="truncate text-xs text-white/70">
                {channel.description || "General TWCC choir conversation"}
              </p>
            </div>

            <a
              href="/dashboard"
              className="hidden rounded-full bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/20 sm:block"
            >
              Dashboard
            </a>
          </div>
        </header>

        {notice && (
          <section className="mx-4 mt-4 rounded-2xl bg-white p-4 text-sm font-semibold text-[#101B3D] shadow-sm">
            {notice}
          </section>
        )}

        {/* Chat Body */}
        <section className="flex-1 overflow-y-auto px-3 py-4">
          {messages.length === 0 ? (
            <div className="flex min-h-[65vh] items-center justify-center text-center">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#101B3D]">
                  No messages yet
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Start the conversation in {channel.name}.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((chatMessage) => {
                const isMine = chatMessage.sender_id === currentUserId;
                const senderName =
                  chatMessage.profiles?.full_name ||
                  (isMine ? "You" : "Unknown Member");

                return (
                  <div
                    key={chatMessage.id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-3 py-2 shadow-sm sm:max-w-[70%] ${
                        isMine
                          ? "rounded-tr-sm bg-[#101B3D] text-white"
                          : "rounded-tl-sm bg-white text-[#1F2937]"
                      }`}
                    >
                      {!isMine && (
                        <p className="mb-1 text-xs font-bold text-[#101B3D]">
                          {senderName}
                        </p>
                      )}

                      {chatMessage.message && (
                        <p
                          className={`whitespace-pre-line text-[15px] leading-6 ${
                            isMine ? "text-white" : "text-[#111827]"
                          }`}
                        >
                          {chatMessage.message}
                        </p>
                      )}

                      {chatMessage.image_url && (
                        <img
                          src={chatMessage.image_url}
                          alt="Chat image"
                          className="mt-2 max-h-72 rounded-xl object-cover"
                        />
                      )}

                      <div className="mt-1 flex items-center justify-end gap-1">
                        <span
                          className={`text-[11px] ${
                            isMine ? "text-white/60" : "text-gray-500"
                          }`}
                        >
                          {formatTime(chatMessage.created_at)}
                        </span>

                        {isMine && (
                          <span className="text-[11px] text-[#D4AF37]">
                            ✓✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </div>
          )}
        </section>

        {/* Chat Input */}
        <form
          onSubmit={sendMessage}
          className="sticky bottom-0 z-20 border-t border-black/5 bg-white px-3 py-3"
        >
          <div className="flex items-end gap-2">
            <div className="flex min-h-[48px] flex-1 items-end rounded-3xl bg-[#F8F5EE] px-4 py-2 shadow-sm">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message"
                rows={1}
                className="max-h-32 min-h-[32px] flex-1 resize-none bg-transparent py-1 text-sm leading-6 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    const form = e.currentTarget.form;
                    form?.requestSubmit();
                  }
                }}
              />
            </div>

            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-lg font-bold text-[#101B3D] shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "…" : "➤"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}