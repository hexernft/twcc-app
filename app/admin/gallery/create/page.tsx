"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { mediaRoles } from "@/lib/permissions";

export default function CreateGalleryAlbumPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
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

  function handleCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setCoverFile(file);
  }

  async function uploadCoverImage(albumId: string) {
    if (!coverFile) return null;

    const fileExtension = coverFile.name.split(".").pop();
    const filePath = `${albumId}/cover-${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery-photos")
      .upload(filePath, coverFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from("gallery-photos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data: userData } = await supabase.auth.getUser();

      const { data: album, error: albumError } = await supabase
        .from("gallery_albums")
        .insert({
          title: formData.title,
          description: formData.description || null,
          event_date: formData.event_date || null,
          cover_image_url: null,
          uploaded_by: userData.user?.id || null,
        })
        .select("id")
        .single();

      if (albumError) {
        throw new Error(albumError.message);
      }

      if (coverFile) {
        const coverImageUrl = await uploadCoverImage(album.id);

        const { error: updateError } = await supabase
          .from("gallery_albums")
          .update({
            cover_image_url: coverImageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", album.id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }

      setLoading(false);
      setMessage("Gallery album created successfully!");

      setTimeout(() => {
        router.push("/admin/gallery");
      }, 800);
    } catch (error) {
      setLoading(false);
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
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
                Create Gallery Album
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Create a service, rehearsal, or special event photo album.
              </p>
            </div>

            <a
              href="/admin/gallery"
              className="w-fit rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
            >
              Back to Gallery
            </a>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Album Details
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Album Title
                  </label>

                  <input
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={updateField}
                    placeholder="Sunday Service"
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Event Date
                  </label>

                  <input
                    name="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={updateField}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Cover Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />

                  {coverFile && (
                    <p className="mt-2 text-xs font-semibold text-[#101B3D]">
                      Selected: {coverFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={updateField}
                    placeholder="Photos from Sunday choir ministration and service."
                    rows={5}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#101B3D]"
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
                href="/admin/gallery"
                className="rounded-full border border-[#101B3D] px-6 py-3 text-center text-sm font-semibold text-[#101B3D]"
              >
                Cancel
              </a>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Album..." : "Create Album"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </AdminPageGuard>
  );
}