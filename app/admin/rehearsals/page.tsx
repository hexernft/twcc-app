"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { rehearsalRoles } from "@/lib/permissions";

type Rehearsal = {
  id: string;
  title: string;
  rehearsal_date: string;
  start_time: string;
  end_time: string | null;
  venue: string | null;
  description: string | null;
  song_focus: string | null;
  target_audience: string | null;
  target_section: string | null;
  status: string | null;
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

function formatTime(value: string | null) {
  if (!value) return "Not set";

  const [hours, minutes] = value.split(":");
  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));

  return date.toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusClass(status: string | null) {
  if (status === "cancelled") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-gray-100 text-gray-700";
  return "bg-green-100 text-green-700";
}

export default function AdminRehearsalsPage() {
  const [rehearsals, setRehearsals] = useState<Rehearsal[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchRehearsals() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("rehearsals")
      .select(
        "id, title, rehearsal_date, start_time, end_time, venue, description, song_focus, target_audience, target_section, status, created_at"
      )
      .order("rehearsal_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setRehearsals(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    setMessage("");

    const { error } = await supabase
      .from("rehearsals")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    fetchRehearsals();
  }

  useEffect(() => {
    fetchRehearsals();
  }, []);

  const scheduledCount = rehearsals.filter(
    (rehearsal) => rehearsal.status === "scheduled"
  ).length;

  const cancelledCount = rehearsals.filter(
    (rehearsal) => rehearsal.status === "cancelled"
  ).length;

  const completedCount = rehearsals.filter(
    (rehearsal) => rehearsal.status === "completed"
  ).length;

  return (
    <AdminPageGuard allowedRoles={rehearsalRoles}>
      <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                TWCC Admin
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
                Rehearsals
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Create and manage choir rehearsals, venues, times, and song focus.
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
                href="/admin/rehearsals/create"
                className="rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
              >
                Create Rehearsal
              </a>
            </div>
          </header>

          <section className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Scheduled</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {scheduledCount}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {completedCount}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {cancelledCount}
              </p>
            </div>
          </section>

          {message && (
            <section className="mb-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">
              {message}
            </section>
          )}

          {loading && (
            <section className="rounded-3xl border border-black/5 bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
              Loading rehearsals...
            </section>
          )}

          {!loading && rehearsals.length === 0 && (
            <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#101B3D]">
                No rehearsals created yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create your first TWCC rehearsal schedule.
              </p>

              <a
                href="/admin/rehearsals/create"
                className="mt-6 inline-block rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
              >
                Create Rehearsal
              </a>
            </section>
          )}

          {!loading && rehearsals.length > 0 && (
            <section className="grid gap-4">
              {rehearsals.map((rehearsal) => (
                <article
                  key={rehearsal.id}
                  className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                            rehearsal.status
                          )}`}
                        >
                          {formatLabel(rehearsal.status)}
                        </span>

                        <span className="rounded-full bg-[#F8F5EE] px-3 py-1 text-xs font-bold text-[#101B3D]">
                          {formatLabel(rehearsal.target_audience)}
                        </span>

                        {rehearsal.target_section && (
                          <span className="rounded-full bg-[#F8F5EE] px-3 py-1 text-xs font-bold text-[#101B3D]">
                            {formatLabel(rehearsal.target_section)}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 text-xl font-bold text-[#101B3D]">
                        {rehearsal.title}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        {formatDate(rehearsal.rehearsal_date)} ·{" "}
                        {formatTime(rehearsal.start_time)} -{" "}
                        {formatTime(rehearsal.end_time)}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Venue: {rehearsal.venue || "Not set"}
                      </p>

                      {rehearsal.song_focus && (
                        <p className="mt-3 text-sm font-semibold text-[#101B3D]">
                          Focus: {rehearsal.song_focus}
                        </p>
                      )}

                      {rehearsal.description && (
                        <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-gray-600">
                          {rehearsal.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 lg:min-w-[260px] lg:justify-end">
                      <button
                        onClick={() => updateStatus(rehearsal.id, "scheduled")}
                        className="rounded-full border border-green-600 px-4 py-2 text-xs font-bold text-green-700"
                      >
                        Scheduled
                      </button>

                      <button
                        onClick={() => updateStatus(rehearsal.id, "completed")}
                        className="rounded-full border border-gray-500 px-4 py-2 text-xs font-bold text-gray-700"
                      >
                        Completed
                      </button>

                      <button
                        onClick={() => updateStatus(rehearsal.id, "cancelled")}
                        className="rounded-full border border-red-600 px-4 py-2 text-xs font-bold text-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </AdminPageGuard>
  );
}