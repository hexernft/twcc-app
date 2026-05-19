"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type GalleryAlbum = {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  cover_image_url: string | null;
  created_at: string;
  gallery_photos: { id: string }[];
};

function formatDate(value: string | null) {
  if (!value) return "Date not set";

  return new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchAlbums() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("gallery_albums")
      .select(
        `
        id,
        title,
        description,
        event_date,
        cover_image_url,
        created_at,
        gallery_photos (
          id
        )
      `
      )
      .order("event_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setAlbums((data || []) as GalleryAlbum[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              TWCC
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
              Photo Gallery
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View TWCC service photos, rehearsal memories, and special event albums.
            </p>
          </div>

          <a
            href="/dashboard"
            className="w-fit rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
          >
            Back to Dashboard
          </a>
        </header>

        {message && (
          <section className="mb-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">
            {message}
          </section>
        )}

        {loading && (
          <section className="rounded-3xl border border-black/5 bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
            Loading gallery albums...
          </section>
        )}

        {!loading && albums.length === 0 && (
          <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#101B3D]">
              No gallery albums yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Service and choir photos will appear here once uploaded.
            </p>
          </section>
        )}

        {!loading && albums.length > 0 && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <article
                key={album.id}
                className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"
              >
                <div className="h-56 bg-[#101B3D]/10">
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

                  <p className="mt-2 text-sm text-gray-500">
                    {album.gallery_photos?.length || 0} photo
                    {(album.gallery_photos?.length || 0) === 1 ? "" : "s"}
                  </p>

                  {album.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {album.description}
                    </p>
                  )}

                  <a
                    href={`/gallery/${album.id}`}
                    className="mt-5 inline-block rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
                  >
                    View Album
                  </a>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}