"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { rehearsalRoles } from "@/lib/permissions";

export default function CreateRehearsalPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    rehearsal_date: "",
    start_time: "",
    end_time: "",
    venue: "",
    description: "",
    song_focus: "",
    target_audience: "everyone",
    target_section: "",
    status: "scheduled",
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

    const { data: userData } = await supabase.auth.getUser();

    const payload = {
      title: formData.title,
      rehearsal_date: formData.rehearsal_date,
      start_time: formData.start_time,
      end_time: formData.end_time || null,
      venue: formData.venue || null,
      description: formData.description || null,
      song_focus: formData.song_focus || null,
      target_audience: formData.target_audience,
      target_section:
        formData.target_audience === "section" && formData.target_section
          ? formData.target_section
          : null,
      status: formData.status,
      created_by: userData.user?.id || null,
    };

    const { error } = await supabase.from("rehearsals").insert(payload);

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    setLoading(false);
    setMessage("Rehearsal created successfully!");

    setTimeout(() => {
      router.push("/admin/rehearsals");
    }, 800);
  }

  return (
    <AdminPageGuard allowedRoles={rehearsalRoles}>
      <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                TWCC Admin
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
                Create Rehearsal
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Schedule rehearsal time, venue, audience, and song focus.
              </p>
            </div>

            <a
              href="/admin/rehearsals"
              className="w-fit rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
            >
              Back to Rehearsals
            </a>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Rehearsal Details
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Rehearsal Title
                  </label>

                  <input
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={updateField}
                    placeholder="Midweek Choir Rehearsal"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Date
                    </label>

                    <input
                      name="rehearsal_date"
                      type="date"
                      required
                      value={formData.rehearsal_date}
                      onChange={updateField}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Start Time
                    </label>

                    <input
                      name="start_time"
                      type="time"
                      required
                      value={formData.start_time}
                      onChange={updateField}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      End Time
                    </label>

                    <input
                      name="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={updateField}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Venue
                  </label>

                  <input
                    name="venue"
                    type="text"
                    value={formData.venue}
                    onChange={updateField}
                    placeholder="Main Auditorium"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Song Focus
                  </label>

                  <input
                    name="song_focus"
                    type="text"
                    value={formData.song_focus}
                    onChange={updateField}
                    placeholder="Loveworld worship medley"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Description / Notes
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={updateField}
                    placeholder="Add preparation notes, dress instruction, sound check info, or other rehearsal details."
                    rows={5}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-3">
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
                      <option value="section">Specific Section</option>
                      <option value="leaders">Leaders</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Target Section
                    </label>

                    <select
                      name="target_section"
                      value={formData.target_section}
                      onChange={updateField}
                      disabled={formData.target_audience !== "section"}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D] disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="">Select section</option>
                      <option value="soprano">Soprano</option>
                      <option value="alto">Alto</option>
                      <option value="tenor">Tenor</option>
                      <option value="bass">Bass</option>
                      <option value="instrumentalist">Instrumentalist</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={updateField}
                      className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
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
                href="/admin/rehearsals"
                className="rounded-full border border-[#101B3D] px-6 py-3 text-center text-sm font-semibold text-[#101B3D]"
              >
                Cancel
              </a>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Rehearsal"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </AdminPageGuard>
  );
}