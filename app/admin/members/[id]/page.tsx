"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { memberManagementRoles } from "@/lib/permissions";

type Member = {
  id: string;
  full_name: string;
  profile_photo_url: string | null;
  phone: string | null;
  email: string | null;
  gender: string | null;
  section: string | null;
  date_of_birth: string | null;
  marital_status: string | null;
  wedding_anniversary: string | null;
  address: string | null;
  date_joined: string | null;
  member_status: string | null;
  app_role: string | null;
  welfare_status: string | null;
  created_at: string;
};

function formatLabel(value: string | null) {
  if (!value) return "Not set";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string | null) {
  if (!value) return "Not set";

  return new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MemberProfilePage() {
  const params = useParams();
  const memberId = params.id as string;

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchMember() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("id", memberId)
      .single();

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMember(data);
    setLoading(false);
  }

  useEffect(() => {
    if (memberId) {
      fetchMember();
    }
  }, [memberId]);

  if (loading) {
    return (
      <AdminPageGuard allowedRoles={memberManagementRoles}>
        <main className="min-h-screen bg-[#F8F5EE] px-4 py-6">
          <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
            Loading member profile...
          </div>
        </main>
      </AdminPageGuard>
    );
  }

  if (message || !member) {
    return (
      <AdminPageGuard allowedRoles={memberManagementRoles}>
        <main className="min-h-screen bg-[#F8F5EE] px-4 py-6">
          <div className="mx-auto max-w-5xl rounded-3xl bg-red-50 p-6 text-sm font-semibold text-red-700 shadow-sm">
            {message || "Member not found."}
          </div>
        </main>
      </AdminPageGuard>
    );
  }

  return (
    <AdminPageGuard allowedRoles={memberManagementRoles}>
      <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                TWCC Admin
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
                Member Profile
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View member details, welfare status, and choir information.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/admin/members"
                className="rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
              >
                Back to Members
              </a>

              <a
                href={`/admin/members/${member.id}/edit`}
                className="rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
              >
                Edit Member
              </a>
            </div>
          </header>

          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#101B3D] text-2xl font-bold text-white">
                {getInitials(member.full_name)}
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#101B3D]">
                  {member.full_name}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {formatLabel(member.section)} · {formatLabel(member.app_role)}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {formatLabel(member.member_status)}
                  </span>

                  <span className="rounded-full bg-[#F8F5EE] px-3 py-1 text-xs font-bold text-[#101B3D]">
                    Welfare: {formatLabel(member.welfare_status)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Personal Information
              </p>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-semibold text-[#101B3D]">
                    {member.phone || "Not set"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Email</span>
                  <span className="font-semibold text-[#101B3D]">
                    {member.email || "Not set"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Gender</span>
                  <span className="font-semibold text-[#101B3D]">
                    {formatLabel(member.gender)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Address</span>
                  <span className="max-w-xs text-right font-semibold text-[#101B3D]">
                    {member.address || "Not set"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Choir Information
              </p>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Section</span>
                  <span className="font-semibold text-[#101B3D]">
                    {formatLabel(member.section)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Role</span>
                  <span className="font-semibold text-[#101B3D]">
                    {formatLabel(member.app_role)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Date Joined</span>
                  <span className="font-semibold text-[#101B3D]">
                    {formatDate(member.date_joined)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Status</span>
                  <span className="font-semibold text-[#101B3D]">
                    {formatLabel(member.member_status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Celebrations
              </p>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Birthday</span>
                  <span className="font-semibold text-[#101B3D]">
                    {formatDate(member.date_of_birth)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Marital Status</span>
                  <span className="font-semibold text-[#101B3D]">
                    {formatLabel(member.marital_status)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Wedding Anniversary</span>
                  <span className="font-semibold text-[#101B3D]">
                    {formatDate(member.wedding_anniversary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Welfare & Attendance
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#F8F5EE] p-4">
                  <p className="text-xs text-gray-500">Welfare Status</p>
                  <p className="mt-1 font-bold text-[#101B3D]">
                    {formatLabel(member.welfare_status)}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8F5EE] p-4">
                  <p className="text-xs text-gray-500">Attendance</p>
                  <p className="mt-1 font-bold text-[#101B3D]">Coming Soon</p>
                </div>
              </div>

              <a
                href="/admin/attendance/report"
                className="mt-5 block w-full rounded-full border border-[#101B3D] px-5 py-3 text-center text-sm font-semibold text-[#101B3D]"
              >
                View Attendance History
              </a>
            </div>
          </section>
        </div>
      </main>
    </AdminPageGuard>
  );
}