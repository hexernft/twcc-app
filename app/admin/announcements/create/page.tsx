"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { announcementRoles } from "@/lib/permissions";

export default function CreateAnnouncementPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    category: "general",
    priority: "normal",
    target_audience: "everyone",
    target_section: "",
    is_pinned: false,
  });

  function updateField(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;

      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    const payload = {
      title: formData.title,
      message: formData.message,
      category: formData.category,
      priority: formData.priority,
      target_audience: formData.target_audience,
      target_section:
        formData.target_audience === "section" && formData.target_section
          ? formData.target_section
          : null,
      is_pinned: formData.is_pinned,
      posted_by: userData.user?.id || null,
    };

    const { error } = await supabase.from("announcements").insert(payload);

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    setLoading(false);
    setMessage("Announcement posted successfully!");

    setTimeout(() => {
      router.push("/admin/announcements");
    }, 800);
  }

  return (
    <AdminPageGuard allowedRoles={announcementRoles}>
      <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                TWCC Admin
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
                Create Announcement
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Share choir updates, dress codes, rehearsal notices, and urgent messages.
              </p>
            </div>

            <a
              href="/admin/announcements"
              className="w-fit rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
            >
              Back to Announcements
            </a>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Announcement Details
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Title
                  </label>

                  <input
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={updateField}
                    placeholder="Dress Code for Sunday Service"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Message
                  </label>

                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={updateField}
                    placeholder="Write the full announcement here..."
                    rows={7}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={updateField}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                    >
                      <option value="general">General</option>
                      <option value="important">Important</option>
                      <option value="urgent">Urgent</option>
                      <option value="dress_code">Dress Code</option>
                      <option value="rehearsal_update">Rehearsal Update</option>
                      <option value="ministration">Ministration</option>
                      <option value="welfare">Welfare</option>
                      <option value="celebration">Celebration</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Priority
                    </label>

                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={updateField}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                    >
                      <option value="normal">Normal</option>
                      <option value="important">Important</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Audience
                    </label>

                    <select
                      name="target_audience"
                      value={formData.target_audience}
                      onChange={updateField}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="admins">Admins</option>
                      <option value="leaders">Leaders</option>
                      <option value="section">Specific Section</option>
                      <option value="media_team">Media Team</option>
                      <option value="welfare_team">Welfare Team</option>
                    </select>
                  </div>
                </div>

                {formData.target_audience === "section" && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Target Section
                    </label>

                    <select
                      name="target_section"
                      value={formData.target_section}
                      onChange={updateField}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                    >
                      <option value="">Select section</option>
                      <option value="soprano">Soprano</option>
                      <option value="alto">Alto</option>
                      <option value="tenor">Tenor</option>
                      <option value="bass">Bass</option>
                      <option value="instrumentalist">Instrumentalist</option>
                    </select>
                  </div>
                )}

                <label className="flex items-center gap-3 rounded-2xl bg-[#F8F5EE] p-4 text-sm font-semibold text-[#101B3D]">
                  <input
                    name="is_pinned"
                    type="checkbox"
                    checked={formData.is_pinned}
                    onChange={updateField}
                    className="h-4 w-4"
                  />
                  Pin this announcement
                </label>
              </div>
            </section>

            {message && (
              <div className="rounded-2xl bg-white p-4 text-sm font-semibold text-[#101B3D] shadow-sm">
                {message}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <a
                href="/admin/announcements"
                className="rounded-full border border-[#101B3D] px-6 py-3 text-center text-sm font-semibold text-[#101B3D]"
              >
                Cancel
              </a>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Posting..." : "Post Announcement"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </AdminPageGuard>
  );
}