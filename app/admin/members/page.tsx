"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { memberManagementRoles } from "@/lib/permissions";

type Member = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  section: string | null;
  app_role: string | null;
  member_status: string | null;
  welfare_status: string | null;
  date_of_birth: string | null;
  created_at: string;
};

function formatLabel(value: string | null) {
  if (!value) return "Not set";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchMembers() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("members")
      .select(
        "id, full_name, phone, email, section, app_role, member_status, welfare_status, date_of_birth, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMembers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  const totalMembers = members.length;

  const activeMembers = members.filter(
    (member) => member.member_status === "active"
  ).length;

  const needsFollowUp = members.filter(
    (member) => member.welfare_status === "needs_follow_up"
  ).length;

  const uniqueSections = new Set(
    members.map((member) => member.section).filter(Boolean)
  ).size;

  return (
    <AdminPageGuard allowedRoles={memberManagementRoles}>
      <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                TWCC Admin
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
                Members
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage choir members, sections, attendance, roles, and welfare status.
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
                href="/admin/members/add"
                className="rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
              >
                Add Member
              </a>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Members</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {totalMembers}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Active Members</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {activeMembers}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Sections</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {uniqueSections}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Needs Follow-up</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {needsFollowUp}
              </p>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-5">
              <input
                placeholder="Search by name, phone, or email..."
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D] lg:col-span-2"
              />

              <select className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]">
                <option>All Sections</option>
                <option>Soprano</option>
                <option>Alto</option>
                <option>Tenor</option>
                <option>Bass</option>
              </select>

              <select className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>New Member</option>
                <option>On Leave</option>
                <option>Needs Follow-up</option>
              </select>

              <select className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]">
                <option>All Roles</option>
                <option>Member</option>
                <option>Section Leader</option>
                <option>Welfare Leader</option>
                <option>Media Team</option>
                <option>Admin</option>
              </select>
            </div>
          </section>

          {message && (
            <section className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">
              {message}
            </section>
          )}

          {loading && (
            <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
              Loading members...
            </section>
          )}

          {!loading && members.length === 0 && (
            <section className="mt-6 rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#101B3D]">
                No members added yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Start by adding your first TWCC choir member.
              </p>

              <a
                href="/admin/members/add"
                className="mt-6 inline-block rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
              >
                Add First Member
              </a>
            </section>
          )}

          {!loading && members.length > 0 && (
            <section className="mt-6 grid gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#101B3D] text-sm font-bold text-white">
                        {getInitials(member.full_name)}
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-[#101B3D]">
                          {member.full_name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatLabel(member.section)} · {formatLabel(member.app_role)}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {member.phone || "No phone number"}
                        </p>

                        {member.email && (
                          <p className="mt-1 text-sm text-gray-500">
                            {member.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                      <div className="rounded-2xl bg-[#F8F5EE] p-4">
                        <p className="text-xs text-gray-500">Member Status</p>
                        <p className="mt-1 font-bold text-[#101B3D]">
                          {formatLabel(member.member_status)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#F8F5EE] p-4">
                        <p className="text-xs text-gray-500">Welfare</p>
                        <p className="mt-1 font-bold text-[#101B3D]">
                          {formatLabel(member.welfare_status)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`/admin/members/${member.id}`}
                          className="flex-1 rounded-2xl bg-[#101B3D] px-4 py-3 text-center text-sm font-semibold text-white"
                        >
                          View
                        </a>

                        <a
                          href={`/admin/members/${member.id}/edit`}
                          className="flex-1 rounded-2xl border border-[#101B3D] px-4 py-3 text-center text-sm font-semibold text-[#101B3D]"
                        >
                          Edit
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
    </AdminPageGuard>
  );
}