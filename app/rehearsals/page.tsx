"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

export default function RehearsalsPage() {
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
      .neq("status", "cancelled")
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

  useEffect(() => {
    fetchRehearsals();
  }, []);

  const upcomingRehearsals = rehearsals.filter((rehearsal) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rehearsalDate = new Date(rehearsal.rehearsal_date);
    rehearsalDate.setHours(0, 0, 0, 0);

    return rehearsalDate >= today && rehearsal.status !== "completed";
  });

  const pastRehearsals = rehearsals.filter((rehearsal) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rehearsalDate = new Date(rehearsal.rehearsal_date);
    rehearsalDate.setHours(0, 0, 0, 0);

    return rehearsalDate < today || rehearsal.status === "completed";
  });

  return (
    <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              TWCC
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
              Rehearsals
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View upcoming choir rehearsals, times, venues, and song focus.
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
            Loading rehearsals...
          </section>
        )}

        {!loading && rehearsals.length === 0 && (
          <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#101B3D]">
              No rehearsals available yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Upcoming TWCC rehearsals will appear here.
            </p>
          </section>
        )}

        {!loading && upcomingRehearsals.length > 0 && (
          <section className="mb-8">
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Upcoming
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#101B3D]">
                Next Rehearsals
              </h2>
            </div>

            <div className="grid gap-4">
              {upcomingRehearsals.map((rehearsal, index) => (
                <article
                  key={rehearsal.id}
                  className={
                    index === 0
                      ? "rounded-3xl bg-[#101B3D] p-6 text-white shadow-sm"
                      : "rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
                  }
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={
                            index === 0
                              ? "rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-[#101B3D]"
                              : `rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                                  rehearsal.status
                                )}`
                          }
                        >
                          {index === 0 ? "Next Rehearsal" : formatLabel(rehearsal.status)}
                        </span>

                        <span
                          className={
                            index === 0
                              ? "rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white"
                              : "rounded-full bg-[#F8F5EE] px-3 py-1 text-xs font-bold text-[#101B3D]"
                          }
                        >
                          {formatLabel(rehearsal.target_audience)}
                        </span>
                      </div>

                      <h3
                        className={
                          index === 0
                            ? "mt-4 text-2xl font-bold text-white"
                            : "mt-4 text-xl font-bold text-[#101B3D]"
                        }
                      >
                        {rehearsal.title}
                      </h3>

                      <p
                        className={
                          index === 0
                            ? "mt-2 text-sm text-white/70"
                            : "mt-2 text-sm text-gray-500"
                        }
                      >
                        {formatDate(rehearsal.rehearsal_date)} ·{" "}
                        {formatTime(rehearsal.start_time)} -{" "}
                        {formatTime(rehearsal.end_time)}
                      </p>

                      <p
                        className={
                          index === 0
                            ? "mt-1 text-sm text-white/70"
                            : "mt-1 text-sm text-gray-500"
                        }
                      >
                        Venue: {rehearsal.venue || "Not set"}
                      </p>

                      {rehearsal.song_focus && (
                        <p
                          className={
                            index === 0
                              ? "mt-4 text-sm font-semibold text-[#D4AF37]"
                              : "mt-4 text-sm font-semibold text-[#101B3D]"
                          }
                        >
                          Focus: {rehearsal.song_focus}
                        </p>
                      )}

                      {rehearsal.description && (
                        <p
                          className={
                            index === 0
                              ? "mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-white/80"
                              : "mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-gray-600"
                          }
                        >
                          {rehearsal.description}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {!loading && pastRehearsals.length > 0 && (
          <section>
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#D4AF37]">
                History
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#101B3D]">
                Past Rehearsals
              </h2>
            </div>

            <div className="grid gap-4">
              {pastRehearsals.map((rehearsal) => (
                <article
                  key={rehearsal.id}
                  className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
                >
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
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-[#101B3D]">
                    {rehearsal.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {formatDate(rehearsal.rehearsal_date)} ·{" "}
                    {formatTime(rehearsal.start_time)} -{" "}
                    {formatTime(rehearsal.end_time)}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Venue: {rehearsal.venue || "Not set"}
                  </p>

                  {rehearsal.song_focus && (
                    <p className="mt-4 text-sm font-semibold text-[#101B3D]">
                      Focus: {rehearsal.song_focus}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}