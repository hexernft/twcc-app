"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { welfareRoles } from "@/lib/permissions";

type Member = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  section: string | null;
  member_status: string | null;
  welfare_status: string | null;
  created_at: string;
};

const welfareStatuses = [
  { label: "All Welfare Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Needs Follow-up", value: "needs_follow_up" },
  { label: "Sick", value: "sick" },
  { label: "Traveling", value: "traveling" },
  { label: "Bereaved", value: "bereaved" },
  { label: "New Member", value: "new_member" },
  { label: "On Leave", value: "on_leave" },
  { label: "Inactive", value: "inactive" },
  { label: "Resolved", value: "resolved" },
];

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

function welfareBadgeClass(status: string | null) {
  if (status === "needs_follow_up") return "bg-purple-100 text-purple-700";
  if (status === "sick") return "bg-red-100 text-red-700";
  if (status === "traveling") return "bg-teal-100 text-teal-700";
  if (status === "bereaved") return "bg-gray-200 text-gray-700";
  if (status === "new_member") return "bg-blue-100 text-blue-700";
  if (status === "on_leave") return "bg-orange-100 text-orange-700";
  if (status === "inactive") return "bg-gray-100 text-gray-700";
  if (status === "resolved") return "bg-green-100 text-green-700";

  return "bg-green-100 text-green-700";
}

export default function WelfareDashboardPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingMemberId, setSavingMemberId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchMembers() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("members")
      .select(
        "id, full_name, phone, email, section, member_status, welfare_status, created_at"
      )
      .order("full_name", { ascending: true });

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
      const matchesStatus =
        statusFilter === "all" || member.welfare_status === statusFilter;

      const matchesSection =
        sectionFilter === "all" || member.section === sectionFilter;

      const searchText = `${member.full_name} ${member.phone || ""} ${
        member.email || ""
      } ${member.section || ""} ${member.welfare_status || ""}`.toLowerCase();

      const matchesSearch = searchText.includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSection && matchesSearch;
    });
  }, [members, statusFilter, sectionFilter, searchQuery]);

  const summary = useMemo(() => {
    return {
      total: members.length,
      active: members.filter((member) => member.welfare_status === "active")
        .length,
      needsFollowUp: members.filter(
        (member) => member.welfare_status === "needs_follow_up"
      ).length,
      sick: members.filter((member) => member.welfare_status === "sick").length,
      traveling: members.filter(
        (member) => member.welfare_status === "traveling"
      ).length,
      inactive: members.filter(
        (member) =>
          member.welfare_status === "inactive" ||
          member.member_status === "inactive"
      ).length,
    };
  }, [members]);

  async function updateWelfareStatus(memberId: string, welfareStatus: string) {
    setSavingMemberId(memberId);
    setMessage("");

    const { error } = await supabase
      .from("members")
      .update({
        welfare_status: welfareStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memberId);

    if (error) {
      setSavingMemberId(null);
      setMessage(error.message);
      return;
    }

    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? {
              ...member,
              welfare_status: welfareStatus,
            }
          : member
      )
    );

    setSavingMemberId(null);
    setMessage("Welfare status updated successfully.");
  }

  return (
    <AdminPageGuard allowedRoles={welfareRoles}>
      <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                TWCC Admin
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
                Welfare Dashboard
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Track member care, follow-ups, sickness, travel status, and inactive members.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/admin/members"
                className="rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
              >
                Members
              </a>

              <a
                href="/admin"
                className="rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
              >
                Back to Admin
              </a>
            </div>
          </header>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Members</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {summary.total}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Active</p>
              <p className="mt-3 text-3xl font-bold text-green-600">
                {summary.active}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Follow-ups</p>
              <p className="mt-3 text-3xl font-bold text-purple-600">
                {summary.needsFollowUp}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Sick</p>
              <p className="mt-3 text-3xl font-bold text-red-600">
                {summary.sick}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Traveling</p>
              <p className="mt-3 text-3xl font-bold text-teal-600">
                {summary.traveling}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="mt-3 text-3xl font-bold text-gray-600">
                {summary.inactive}
              </p>
            </div>
          </section>

          <section className="mb-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
              >
                {welfareStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

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

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member, phone, email, section..."
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D] lg:col-span-2"
              />
            </div>
          </section>

          {message && (
            <section className="mb-6 rounded-3xl border border-black/5 bg-white p-5 text-sm font-semibold text-[#101B3D] shadow-sm">
              {message}
            </section>
          )}

          {loading && (
            <section className="rounded-3xl border border-black/5 bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
              Loading welfare records...
            </section>
          )}

          {!loading && filteredMembers.length === 0 && (
            <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#101B3D]">
                No members found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try adjusting the welfare or section filters.
              </p>
            </section>
          )}

          {!loading && filteredMembers.length > 0 && (
            <section className="grid gap-4">
              {filteredMembers.map((member) => (
                <article
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
                          {formatLabel(member.section)} ·{" "}
                          {member.phone || "No phone"}
                        </p>

                        {member.email && (
                          <p className="mt-1 text-sm text-gray-500">
                            {member.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 lg:min-w-[520px] lg:grid-cols-3">
                      <div className="rounded-2xl bg-[#F8F5EE] p-4">
                        <p className="text-xs text-gray-500">Member Status</p>
                        <p className="mt-1 font-bold text-[#101B3D]">
                          {formatLabel(member.member_status)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#F8F5EE] p-4">
                        <p className="text-xs text-gray-500">Welfare Status</p>
                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${welfareBadgeClass(
                            member.welfare_status
                          )}`}
                        >
                          {formatLabel(member.welfare_status)}
                        </span>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-500">
                          Update Welfare
                        </label>

                        <select
                          value={member.welfare_status || "active"}
                          disabled={savingMemberId === member.id}
                          onChange={(e) =>
                            updateWelfareStatus(member.id, e.target.value)
                          }
                          className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D] disabled:bg-gray-100"
                        >
                          {welfareStatuses
                            .filter((status) => status.value !== "all")
                            .map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={`/admin/members/${member.id}`}
                      className="rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
                    >
                      View Profile
                    </a>

                    <a
                      href={`/admin/members/${member.id}/edit`}
                      className="rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
                    >
                      Edit Member
                    </a>
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