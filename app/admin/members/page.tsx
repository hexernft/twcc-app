"use client";

import { useEffect, useMemo, useState } from "react";
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

const sections = [
  { label: "All Sections", value: "all" },
  { label: "Soprano", value: "soprano" },
  { label: "Alto", value: "alto" },
  { label: "Tenor", value: "tenor" },
  { label: "Bass", value: "bass" },
  { label: "Instrumentalist", value: "instrumentalist" },
  { label: "Choir Leader", value: "choir_leader" },
  { label: "Music Director", value: "music_director" },
];

const statuses = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "New Member", value: "new_member" },
  { label: "On Leave", value: "on_leave" },
  { label: "Inactive", value: "inactive" },
];

const roles = [
  { label: "All Roles", value: "all" },
  { label: "Member", value: "member" },
  { label: "Section Leader", value: "section_leader" },
  { label: "Welfare Leader", value: "welfare_leader" },
  { label: "Media Team", value: "media_team" },
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "super_admin" },
];

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

function memberStatusClass(status: string | null) {
  if (status === "active") return "bg-green-100 text-green-700";
  if (status === "new_member") return "bg-blue-100 text-blue-700";
  if (status === "on_leave") return "bg-orange-100 text-orange-700";
  if (status === "inactive") return "bg-gray-200 text-gray-700";

  return "bg-gray-100 text-gray-700";
}

function welfareStatusClass(status: string | null) {
  if (status === "needs_follow_up") return "bg-purple-100 text-purple-700";
  if (status === "sick") return "bg-red-100 text-red-700";
  if (status === "traveling") return "bg-teal-100 text-teal-700";
  if (status === "bereaved") return "bg-gray-200 text-gray-700";
  if (status === "on_leave") return "bg-orange-100 text-orange-700";
  if (status === "inactive") return "bg-gray-100 text-gray-700";
  if (status === "active") return "bg-green-100 text-green-700";

  return "bg-gray-100 text-gray-700";
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

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

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSection =
        sectionFilter === "all" || member.section === sectionFilter;

      const matchesStatus =
        statusFilter === "all" || member.member_status === statusFilter;

      const matchesRole =
        roleFilter === "all" || member.app_role === roleFilter;

      const searchText = `${member.full_name} ${member.phone || ""} ${
        member.email || ""
      } ${member.section || ""} ${member.app_role || ""}`.toLowerCase();

      const matchesSearch = searchText.includes(searchQuery.toLowerCase());

      return matchesSection && matchesStatus && matchesRole && matchesSearch;
    });
  }, [members, searchQuery, sectionFilter, statusFilter, roleFilter]);

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
      <div className="min-h-screen px-4 py-6 text-[#1F2937]">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                TWCC Admin
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                Members
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-white/75">
                Manage choir members, sections, app roles, welfare status, and
                member records.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/admin"
                className="rounded-full border border-white/30 bg-white/15 px-5 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur-md transition hover:bg-white hover:text-[#101B3D]"
              >
                Back to Admin
              </a>

              <a
                href="/admin/members/add"
                className="rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#101B3D] shadow-xl transition hover:bg-white"
              >
                Add Member
              </a>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md">
              <p className="text-sm text-gray-500">Total Members</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {totalMembers}
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md">
              <p className="text-sm text-gray-500">Active Members</p>
              <p className="mt-3 text-3xl font-bold text-green-600">
                {activeMembers}
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md">
              <p className="text-sm text-gray-500">Sections</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {uniqueSections}
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md">
              <p className="text-sm text-gray-500">Needs Follow-up</p>
              <p className="mt-3 text-3xl font-bold text-purple-600">
                {needsFollowUp}
              </p>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
            <div className="grid gap-4 lg:grid-cols-5">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, email, section..."
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D] lg:col-span-2"
              />

              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
              >
                {sections.map((section) => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {message && (
            <section className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700 shadow-xl">
              {message}
            </section>
          )}

          {loading && (
            <section className="mt-6 rounded-3xl border border-white/20 bg-white/95 p-6 text-sm font-semibold text-gray-500 shadow-2xl backdrop-blur-md">
              Loading members...
            </section>
          )}

          {!loading && filteredMembers.length === 0 && (
            <section className="mt-6 rounded-3xl border border-white/20 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md">
              <h2 className="text-xl font-bold text-[#101B3D]">
                No members found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your filters or add a new choir member.
              </p>

              <a
                href="/admin/members/add"
                className="mt-6 inline-block rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
              >
                Add Member
              </a>
            </section>
          )}

          {!loading && filteredMembers.length > 0 && (
            <section className="mt-6 grid gap-4">
              {filteredMembers.map((member) => (
                <article
                  key={member.id}
                  className="rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#101B3D] text-sm font-bold text-white shadow-md">
                        {getInitials(member.full_name)}
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-[#101B3D]">
                          {member.full_name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatLabel(member.section)} ·{" "}
                          {formatLabel(member.app_role)}
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

                    <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[560px]">
                      <div className="rounded-2xl bg-[#F8F5EE] p-4">
                        <p className="text-xs text-gray-500">Member Status</p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${memberStatusClass(
                            member.member_status
                          )}`}
                        >
                          {formatLabel(member.member_status)}
                        </span>
                      </div>

                      <div className="rounded-2xl bg-[#F8F5EE] p-4">
                        <p className="text-xs text-gray-500">Welfare</p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${welfareStatusClass(
                            member.welfare_status
                          )}`}
                        >
                          {formatLabel(member.welfare_status)}
                        </span>
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
                </article>
              ))}
            </section>
          )}
        </div>
      </div>
    </AdminPageGuard>
  );
}