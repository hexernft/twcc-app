"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { announcementRoles } from "@/lib/permissions";

type Announcement = {
  id: string;
  title: string;
  message: string;
  category: string | null;
  priority: string | null;
  is_pinned: boolean | null;
  created_at: string;
};

function formatLabel(value: string | null) {
  if (!value) return "Not set";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function priorityClass(priority: string | null) {
  if (priority === "urgent") return "bg-red-100 text-red-700";
  if (priority === "important") return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-700";
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchAnnouncements() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("announcements")
      .select("id, title, message, category, priority, is_pinned, created_at")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setAnnouncements(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <AdminPageGuard allowedRoles={announcementRoles}>
      <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                TWCC Admin
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
                Announcements
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Post choir updates, rehearsal notices, dress codes, and urgent messages.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/admin"
                className="rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
              >
                Back to Admin
              </a>

              <a
                href="/admin/announcements/create"
                className="rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
              >
                Create Announcement
              </a>
            </div>
          </header>

          {message && (
            <section className="rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">
              {message}
            </section>
          )}

          {loading && (
            <section className="rounded-3xl border border-black/5 bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
              Loading announcements...
            </section>
          )}

          {!loading && announcements.length === 0 && (
            <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#101B3D]">
                No announcements yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create your first TWCC announcement for choir members.
              </p>

              <a
                href="/admin/announcements/create"
                className="mt-6 inline-block rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
              >
                Create Announcement
              </a>
            </section>
          )}

          {!loading && announcements.length > 0 && (
            <section className="grid gap-4">
              {announcements.map((announcement) => (
                <article
                  key={announcement.id}
                  className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {announcement.is_pinned && (
                          <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-[#101B3D]">
                            Pinned
                          </span>
                        )}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${priorityClass(
                            announcement.priority
                          )}`}
                        >
                          {formatLabel(announcement.priority)}
                        </span>

                        <span className="rounded-full bg-[#F8F5EE] px-3 py-1 text-xs font-bold text-[#101B3D]">
                          {formatLabel(announcement.category)}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-bold text-[#101B3D]">
                        {announcement.title}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        Posted {formatDate(announcement.created_at)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600">
                    {announcement.message}
                  </p>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </AdminPageGuard>
  );
}