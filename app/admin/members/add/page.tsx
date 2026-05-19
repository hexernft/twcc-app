"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { memberManagementRoles } from "@/lib/permissions";

export default function AddMemberPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    section: "",
    app_role: "member",
    date_joined: "",
    member_status: "active",
    date_of_birth: "",
    marital_status: "single",
    wedding_anniversary: "",
    welfare_status: "active",
    welfare_note: "",
  });

  function updateField(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const memberPayload = {
      full_name: formData.full_name,
      phone: formData.phone || null,
      email: formData.email || null,
      gender: formData.gender || null,
      address: formData.address || null,
      section: formData.section || null,
      app_role: formData.app_role,
      date_joined: formData.date_joined || null,
      member_status: formData.member_status,
      date_of_birth: formData.date_of_birth || null,
      marital_status: formData.marital_status,
      wedding_anniversary:
        formData.marital_status === "married" && formData.wedding_anniversary
          ? formData.wedding_anniversary
          : null,
      welfare_status: formData.welfare_status,
      user_id: null,
    };

    const { data: member, error: memberError } = await supabase
      .from("members")
      .insert(memberPayload)
      .select()
      .single();

    if (memberError) {
      setLoading(false);
      setMessage(memberError.message);
      return;
    }

    if (formData.welfare_note || formData.welfare_status !== "active") {
      const { error: welfareError } = await supabase
        .from("welfare_status")
        .insert({
          member_id: member.id,
          status: formData.welfare_status,
          note: formData.welfare_note || null,
        });

      if (welfareError) {
        setLoading(false);
        setMessage(
          `Member was added, but welfare note failed: ${welfareError.message}`
        );
        return;
      }
    }

    setLoading(false);
    setMessage("Member added successfully!");

    setTimeout(() => {
      router.push("/admin/members");
    }, 800);
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
                Add Member
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Register a choir member and assign their section, role, and welfare status.
              </p>
            </div>

            <a
              href="/admin/members"
              className="w-fit rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
            >
              Back to Members
            </a>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Personal Information
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#101B3D]">
                Member Details
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    name="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={updateField}
                    placeholder="Sis. Amara Johnson"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={updateField}
                    placeholder="08012345678"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={updateField}
                    placeholder="member@example.com"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={updateField}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={updateField}
                    placeholder="Member address"
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Choir Information
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#101B3D]">
                Section & Role
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Choir Section
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={updateField}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  >
                    <option value="">Select section</option>
                    <option value="soprano">Soprano</option>
                    <option value="alto">Alto</option>
                    <option value="tenor">Tenor</option>
                    <option value="bass">Bass</option>
                    <option value="instrumentalist">Instrumentalist</option>
                    <option value="choir_leader">Choir Leader</option>
                    <option value="music_director">Music Director</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    App Role
                  </label>
                  <select
                    name="app_role"
                    value={formData.app_role}
                    onChange={updateField}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  >
                    <option value="member">Member</option>
                    <option value="section_leader">Section Leader</option>
                    <option value="welfare_leader">Welfare Leader</option>
                    <option value="media_team">Media Team</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Date Joined
                  </label>
                  <input
                    name="date_joined"
                    type="date"
                    value={formData.date_joined}
                    onChange={updateField}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Member Status
                  </label>
                  <select
                    name="member_status"
                    value={formData.member_status}
                    onChange={updateField}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  >
                    <option value="active">Active</option>
                    <option value="new_member">New Member</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Celebrations
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#101B3D]">
                Birthday & Anniversary
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={updateField}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Marital Status
                  </label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={updateField}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="widowed">Widowed</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Wedding Anniversary
                  </label>
                  <input
                    name="wedding_anniversary"
                    type="date"
                    value={formData.wedding_anniversary}
                    onChange={updateField}
                    disabled={formData.marital_status !== "married"}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D] disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Welfare
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#101B3D]">
                Member Care Status
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Welfare Status
                  </label>
                  <select
                    name="welfare_status"
                    value={formData.welfare_status}
                    onChange={updateField}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  >
                    <option value="active">Active</option>
                    <option value="needs_follow_up">Needs Follow-up</option>
                    <option value="sick">Sick</option>
                    <option value="traveling">Traveling</option>
                    <option value="bereaved">Bereaved</option>
                    <option value="new_member">New Member</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Welfare Note
                  </label>
                  <textarea
                    name="welfare_note"
                    value={formData.welfare_note}
                    onChange={updateField}
                    placeholder="Optional welfare note"
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>
              </div>
            </section>

            {message && (
              <div className="rounded-2xl bg-white p-4 text-sm font-semibold text-[#101B3D] shadow-sm">
                {message}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <a
                href="/admin/members"
                className="rounded-full border border-[#101B3D] px-6 py-3 text-center text-sm font-semibold text-[#101B3D]"
              >
                Cancel
              </a>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Member"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </AdminPageGuard>
  );
}