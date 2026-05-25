"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const fullDashboardRoles = [
  "approved_member",
  "super_admin",
  "admin",
  "section_leader",
  "welfare_leader",
  "media_team",
];

const adminRoles = [
  "super_admin",
  "admin",
  "section_leader",
  "welfare_leader",
  "media_team",
];

export default function DashboardPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  async function checkAuth() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/login");
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (error || !profile) {
      setRole("pending_member");
      setCheckingAuth(false);
      return;
    }

    setRole(profile.role || "pending_member");
    setCheckingAuth(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  useEffect(() => {
    checkAuth();
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-3xl bg-white/95 px-6 py-4 text-sm font-semibold text-gray-500 shadow-xl backdrop-blur-md">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!role || !fullDashboardRoles.includes(role)) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl rounded-[2rem] border border-white/20 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            TWCC
          </p>

          <h1 className="mt-4 text-3xl font-bold text-[#101B3D]">
            Dashboard Under Maintenance
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600">
            Thank you for signing up. Your member information has been received.
            The full TWCC member portal is currently being prepared and will be
            opened when the choir admin team is ready.
          </p>

          <div className="mt-6 rounded-3xl bg-[#F8F5EE] p-5 text-left">
            <p className="text-sm font-bold text-[#101B3D]">
              What happens next?
            </p>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
              <li>• Your signup information is saved.</li>
              <li>• TWCC admin can review your details.</li>
              <li>• Full app access will be enabled later.</li>
            </ul>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const canOpenAdmin = adminRoles.includes(role);

  return (
    <div className="min-h-screen px-4 py-6 text-[#1F2937]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              TWCC
            </p>

            <h1 className="mt-2 text-3xl font-bold text-white drop-shadow-sm">
              Good evening 👋
            </h1>

            <p className="mt-1 text-sm font-medium text-white/75">
              Welcome to The World Class Choir Portal
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full border border-[#D4AF37]/40 bg-white/95 px-4 py-2 text-sm font-semibold text-[#101B3D] shadow-xl backdrop-blur-md">
              🔔
            </button>

            {canOpenAdmin && (
              <a
                href="/admin"
                className="rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-bold text-[#101B3D] shadow-xl transition hover:bg-white"
              >
                Admin
              </a>
            )}

            <button
              onClick={handleLogout}
              className="rounded-full border border-[#D4AF37]/60 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-xl backdrop-blur-md transition hover:bg-[#D4AF37] hover:text-[#101B3D]"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl bg-[#101B3D]/95 p-6 text-white shadow-2xl backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#D4AF37]">
                    Next Rehearsal
                  </p>

                  <h2 className="mt-3 text-2xl font-bold text-white">
                    Midweek Choir Rehearsal
                  </h2>

                  <p className="mt-2 text-sm text-white/70">
                    Wednesday, May 20, 2026
                  </p>
                </div>

                <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-[#101B3D]">
                  Scheduled
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/60">Time</p>
                  <p className="mt-1 font-semibold">6:00 PM - 8:00 PM</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/60">Venue</p>
                  <p className="mt-1 font-semibold">Main Auditorium</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/60">Focus</p>
                  <p className="mt-1 font-semibold">Loveworld Medley</p>
                </div>
              </div>

              <a
                href="/rehearsals"
                className="mt-6 inline-block rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#101B3D]"
              >
                View Rehearsal
              </a>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#D4AF37]">
                    Latest Announcement
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-[#101B3D]">
                    Dress Code for Sunday Service
                  </h2>
                </div>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                  Important
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600">
                All members should wear white and gold for Sunday’s
                ministration. Please arrive early for sound check and final
                preparation.
              </p>

              <a
                href="/announcements"
                className="mt-5 inline-block rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
              >
                Read More
              </a>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Latest Loveworld Song
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#101B3D]">
                You Are Great
              </h2>

              <p className="mt-1 text-sm text-gray-500">Loveworld Singers</p>

              <div className="mt-4 rounded-2xl bg-[#F8F5EE] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Practice Note
                </p>

                <p className="mt-2 text-sm text-gray-700">
                  Altos should focus on the second verse harmony. Everyone
                  should practice the chorus entry.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/songs"
                  className="rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
                >
                  Open Song
                </a>

                <a
                  href="/songs"
                  className="rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
                >
                  Lyrics
                </a>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Today’s Celebrations
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[#F8F5EE] p-4">
                  <p className="text-xs font-semibold text-gray-500">
                    Birthday
                  </p>

                  <p className="mt-1 font-bold text-[#101B3D]">
                    Sis. Amara Johnson
                  </p>

                  <p className="text-sm text-gray-500">Alto Section</p>
                </div>

                <div className="rounded-2xl bg-[#F8F5EE] p-4">
                  <p className="text-xs font-semibold text-gray-500">
                    Wedding Anniversary
                  </p>

                  <p className="mt-1 font-bold text-[#101B3D]">
                    Bro. David & Sis. Grace
                  </p>

                  <p className="text-sm text-gray-500">Happy Anniversary!</p>
                </div>
              </div>

              <a
                href="/celebrations"
                className="mt-5 block w-full rounded-full bg-[#D4AF37] px-5 py-3 text-center text-sm font-bold text-[#101B3D]"
              >
                View Celebrations
              </a>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm font-semibold text-[#D4AF37]">
                My Attendance
              </p>

              <div className="mt-4 flex items-end gap-2">
                <p className="text-5xl font-bold text-[#101B3D]">85%</p>
                <p className="pb-2 text-sm text-gray-500">this month</p>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Rehearsal</span>
                  <span className="font-semibold text-green-600">Present</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Last Service</span>
                  <span className="font-semibold text-green-600">Present</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Latest Gallery
              </p>

              <h2 className="mt-2 text-lg font-bold text-[#101B3D]">
                Sunday Service
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                May 19, 2026 · 48 photos
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="h-20 rounded-2xl bg-[#101B3D]/20" />
                <div className="h-20 rounded-2xl bg-[#101B3D]/30" />
                <div className="h-20 rounded-2xl bg-[#101B3D]/40" />
              </div>

              <a
                href="/gallery"
                className="mt-5 block w-full rounded-full border border-[#101B3D] px-5 py-3 text-center text-sm font-semibold text-[#101B3D]"
              >
                View Gallery
              </a>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Quick Actions
              </p>

              <div className="mt-5 grid gap-3">
                <a
                  href="/announcements"
                  className="rounded-2xl bg-[#F8F5EE] px-4 py-3 text-left text-sm font-semibold text-[#101B3D]"
                >
                  View Announcements
                </a>

                <a
                  href="/chat"
                  className="rounded-2xl bg-[#F8F5EE] px-4 py-3 text-left text-sm font-semibold text-[#101B3D]"
                >
                  Open Chat
                </a>

                <a
                  href="/songs"
                  className="rounded-2xl bg-[#F8F5EE] px-4 py-3 text-left text-sm font-semibold text-[#101B3D]"
                >
                  View Songs
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}