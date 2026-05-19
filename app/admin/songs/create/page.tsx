"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { mediaRoles } from "@/lib/permissions";

export default function CreateSongPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    lyrics: "",
    song_link: "",
    practice_note: "",
    voice_part_note: "",
  });

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      artist: formData.artist || null,
      lyrics: formData.lyrics || null,
      song_link: formData.song_link || null,
      lyrics_link: null,
      video_link: null,
      practice_note: formData.practice_note || null,
      voice_part_note: formData.voice_part_note || null,
      added_by: userData.user?.id || null,
    };

    const { error } = await supabase.from("songs").insert(payload);

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    setLoading(false);
    setMessage("Song added successfully!");

    setTimeout(() => {
      router.push("/admin/songs");
    }, 800);
  }

  return (
    <AdminPageGuard allowedRoles={mediaRoles}>
      <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                TWCC Admin
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
                Add Loveworld Song
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Add the full lyrics, song link, and choir practice notes.
              </p>
            </div>

            <a
              href="/admin/songs"
              className="w-fit rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
            >
              Back to Songs
            </a>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Song Details
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Song Title
                  </label>

                  <input
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={updateField}
                    placeholder="You Are Great"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Artist / Ministry
                  </label>

                  <input
                    name="artist"
                    type="text"
                    value={formData.artist}
                    onChange={updateField}
                    placeholder="Loveworld Singers"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Song Link
                  </label>

                  <input
                    name="song_link"
                    type="url"
                    value={formData.song_link}
                    onChange={updateField}
                    placeholder="https://..."
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Lyrics
                  </label>

                  <textarea
                    name="lyrics"
                    value={formData.lyrics}
                    onChange={updateField}
                    placeholder="Paste the full lyrics here..."
                    rows={12}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Practice Note
                  </label>

                  <textarea
                    name="practice_note"
                    value={formData.practice_note}
                    onChange={updateField}
                    placeholder="Example: Everyone should focus on the chorus entry."
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Voice Part Note
                  </label>

                  <textarea
                    name="voice_part_note"
                    value={formData.voice_part_note}
                    onChange={updateField}
                    placeholder="Example: Altos should focus on the second verse harmony."
                    rows={4}
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
                href="/admin/songs"
                className="rounded-full border border-[#101B3D] px-6 py-3 text-center text-sm font-semibold text-[#101B3D]"
              >
                Cancel
              </a>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Adding Song..." : "Add Song"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </AdminPageGuard>
  );
}