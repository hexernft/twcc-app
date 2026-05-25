"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { adminRoles } from "@/lib/permissions";

type MemberSignup = {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  pcf_cell: string | null;
  kingschat_id: string | null;
  section: string | null;
  gender: string | null;
  address: string | null;
  date_of_birth: string | null;
  marital_status: string | null;
  wedding_anniversary: string | null;
  signup_status: string | null;
  created_at: string;
};

const statuses = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

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

function statusClass(status: string | null) {
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";

  return "bg-orange-100 text-orange-700";
}

export default function AdminSignupsPage() {
  const [signups, setSignups] = useState<MemberSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [message, setMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function fetchSignups() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("member_signups")
      .select(
        "id, user_id, full_name, email, phone, pcf_cell, kingschat_id, section, gender, address, date_of_birth, marital_status, wedding_anniversary, signup_status, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setSignups(data || []);
    setLoading(false);
  }

  async function updateSignupStatus(signupId: string, status: string) {
    setUpdatingId(signupId);
    setMessage("");

    const { error } = await supabase
      .from("member_signups")
      .update({
        signup_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", signupId);

    if (error) {
      setMessage(error.message);
      setUpdatingId("");
      return;
    }

    setSignups((prev) =>
      prev.map((signup) =>
        signup.id === signupId ? { ...signup, signup_status: status } : signup
      )
    );

    setUpdatingId("");
    setMessage(`Signup marked as ${status}.`);
  }

  const filteredSignups = useMemo(() => {
    return signups.filter((signup) => {
      const matchesStatus =
        statusFilter === "all" || signup.signup_status === statusFilter;

      const searchText = `${signup.full_name} ${signup.email} ${
        signup.phone || ""
      } ${signup.pcf_cell || ""} ${signup.kingschat_id || ""} ${
        signup.section || ""
      }`.toLowerCase();

      const matchesSearch = searchText.includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [signups, searchQuery, statusFilter]);

  const totalSignups = signups.length;
  const pendingSignups = signups.filter(
    (signup) => signup.signup_status === "pending"
  ).length;
  const approvedSignups = signups.filter(
    (signup) => signup.signup_status === "approved"
  ).length;
  const rejectedSignups = signups.filter(
    (signup) => signup.signup_status === "rejected"
  ).length;

  useEffect(() => {
    fetchSignups();
  }, []);

  return (
    <AdminPageGuard allowedRoles={adminRoles}>
      <div className="min-h-screen px-4 py-6 text-[#1F2937]">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                TWCC Admin
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white drop-shadow-sm">
                Member Signups
              </h1>

              <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-white/75">
                Review submitted member information before giving full app
                access.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/admin"
                className="rounded-full border border-[#D4AF37]/50 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur-md transition hover:bg-white hover:text-[#101B3D]"
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
              <p className="text-sm text-gray-500">Total Signups</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {totalSignups}
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="mt-3 text-3xl font-bold text-orange-600">
                {pendingSignups}
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md">
              <p className="text-sm text-gray-500">Approved</p>
              <p className="mt-3 text-3xl font-bold text-green-600">
                {approvedSignups}
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md">
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="mt-3 text-3xl font-bold text-red-600">
                {rejectedSignups}
              </p>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
            <div className="grid gap-4 md:grid-cols-3">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, phone, PCF, KingsChat..."
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D] md:col-span-2"
              />

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
            </div>
          </section>

          {message && (
            <section className="mt-6 rounded-3xl border border-white/20 bg-white/95 p-5 text-sm font-semibold text-[#101B3D] shadow-2xl backdrop-blur-md">
              {message}
            </section>
          )}

          {loading && (
            <section className="mt-6 rounded-3xl border border-white/20 bg-white/95 p-6 text-sm font-semibold text-gray-500 shadow-2xl backdrop-blur-md">
              Loading member signups...
            </section>
          )}

          {!loading && filteredSignups.length === 0 && (
            <section className="mt-6 rounded-3xl border border-white/20 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md">
              <h2 className="text-xl font-bold text-[#101B3D]">
                No signups found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                New member signups will appear here.
              </p>
            </section>
          )}

          {!loading && filteredSignups.length > 0 && (
            <section className="mt-6 grid gap-4">
              {filteredSignups.map((signup) => (
                <article
                  key={signup.id}
                  className="rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#101B3D] text-sm font-bold text-white shadow-md">
                        {getInitials(signup.full_name)}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold text-[#101B3D]">
                            {signup.full_name}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                              signup.signup_status
                            )}`}
                          >
                            {formatLabel(signup.signup_status || "pending")}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          {signup.email}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {signup.phone || "No phone number"}
                        </p>

                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Submitted {formatDate(signup.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={updatingId === signup.id}
                        onClick={() =>
                          updateSignupStatus(signup.id, "approved")
                        }
                        className="rounded-full bg-green-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === signup.id}
                        onClick={() =>
                          updateSignupStatus(signup.id, "rejected")
                        }
                        className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === signup.id}
                        onClick={() =>
                          updateSignupStatus(signup.id, "pending")
                        }
                        className="rounded-full border border-[#101B3D] px-4 py-2 text-xs font-bold text-[#101B3D] disabled:opacity-60"
                      >
                        Pending
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-[#F8F5EE] p-4">
                      <p className="text-xs text-gray-500">Section</p>
                      <p className="mt-1 font-bold text-[#101B3D]">
                        {formatLabel(signup.section)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8F5EE] p-4">
                      <p className="text-xs text-gray-500">PCF / CELL</p>
                      <p className="mt-1 font-bold text-[#101B3D]">
                        {signup.pcf_cell || "Not set"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8F5EE] p-4">
                      <p className="text-xs text-gray-500">KingsChat ID</p>
                      <p className="mt-1 font-bold text-[#101B3D]">
                        {signup.kingschat_id || "Not set"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8F5EE] p-4">
                      <p className="text-xs text-gray-500">Gender</p>
                      <p className="mt-1 font-bold text-[#101B3D]">
                        {formatLabel(signup.gender)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8F5EE] p-4">
                      <p className="text-xs text-gray-500">Birthday</p>
                      <p className="mt-1 font-bold text-[#101B3D]">
                        {formatDate(signup.date_of_birth)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8F5EE] p-4">
                      <p className="text-xs text-gray-500">Marital Status</p>
                      <p className="mt-1 font-bold text-[#101B3D]">
                        {formatLabel(signup.marital_status)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8F5EE] p-4 sm:col-span-2">
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="mt-1 font-bold text-[#101B3D]">
                        {signup.address || "Not set"}
                      </p>
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