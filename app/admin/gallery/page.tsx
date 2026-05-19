"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { mediaRoles } from "@/lib/permissions";

type GalleryAlbum = {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  cover_image_url: string | null;
  created_at: string;
};

function formatDate(value: string | null) {
  if (!value) return "Date not set";

  return new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchAlbums() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("gallery_albums")
      .select("id, title, description, event_date, cover_image_url, created_at")
      .order("event_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setAlbums(data || []);
    setLoading(false);
  }

  async function deleteAlbum(albumId: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this album?"
    );

    if (!confirmDelete) return;

    setMessage("");

    const { error } = await supabase
      .from("gallery_albums")
      .delete()
      .eq("id", albumId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setAlbums((prev) => prev.filter((album) => album.id !== albumId));
    setMessage("Album deleted successfully.");
  }

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <AdminPageGuard allowedRoles={mediaRoles}>
      <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                TWCC Admin
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
                Photo Gallery
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage service photos, choir albums, and media memories.
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
                href="/admin/gallery/create"
                className="rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
              >
                Create Album
              </a>
            </div>
          </header>

          {message && (
            <section className="mb-6 rounded-3xl border border-black/5 bg-white p-5 text-sm font-semibold text-[#101B3D] shadow-sm">
              {message}
            </section>
          )}

          {loading && (
            <section className="rounded-3xl border border-black/5 bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
              Loading albums...
            </section>
          )}

          {!loading && albums.length === 0 && (
            <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#101B3D]">
                No gallery albums yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create the first TWCC photo album for service or rehearsal photos.
              </p>

              <a
                href="/admin/gallery/create"
                className="mt-6 inline-block rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
              >
                Create Album
              </a>
            </section>
          )}

          {!loading && albums.length > 0 && (
            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => (
                <article
                  key={album.id}
                  className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"
                >
                  <div className="h-52 bg-[#101B3D]/10">
                    {album.cover_image_url ? (
                      <img
                        src={album.cover_image_url}
                        alt={album.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm font-semibold text-[#101B3D]">
                        No Cover Image
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-sm font-semibold text-[#D4AF37]">
                      {formatDate(album.event_date)}
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-[#101B3D]">
                      {album.title}
                    </h2>

                    {album.description && (
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {album.description}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      <a
                        href={`/admin/gallery/${album.id}`}
                        className="rounded-full bg-[#101B3D] px-4 py-2 text-xs font-bold text-white"
                      >
                        View Album
                      </a>

                      <button
                        type="button"
                        onClick={() => deleteAlbum(album.id)}
                        className="rounded-full border border-red-600 px-4 py-2 text-xs font-bold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
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