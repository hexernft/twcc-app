"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type GalleryAlbum = {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  cover_image_url: string | null;
  created_at: string;
};

type GalleryPhoto = {
  id: string;
  album_id: string;
  image_url: string;
  caption: string | null;
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

export default function GalleryAlbumPage() {
  const params = useParams();
  const albumId = params.id as string;

  const [album, setAlbum] = useState<GalleryAlbum | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchAlbumAndPhotos() {
    setLoading(true);
    setMessage("");

    const { data: albumData, error: albumError } = await supabase
      .from("gallery_albums")
      .select("id, title, description, event_date, cover_image_url, created_at")
      .eq("id", albumId)
      .single();

    if (albumError) {
      setMessage(albumError.message);
      setLoading(false);
      return;
    }

    const { data: photoData, error: photoError } = await supabase
      .from("gallery_photos")
      .select("id, album_id, image_url, caption, created_at")
      .eq("album_id", albumId)
      .order("created_at", { ascending: false });

    if (photoError) {
      setMessage(photoError.message);
      setLoading(false);
      return;
    }

    setAlbum(albumData);
    setPhotos(photoData || []);
    setLoading(false);
  }

  useEffect(() => {
    if (albumId) {
      fetchAlbumAndPhotos();
    }
  }, [albumId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F5EE] px-4 py-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
          Loading album...
        </div>
      </main>
    );
  }

  if (message || !album) {
    return (
      <main className="min-h-screen bg-[#F8F5EE] px-4 py-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-red-50 p-6 text-sm font-semibold text-red-700 shadow-sm">
          {message || "Album not found."}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              TWCC Gallery
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
              {album.title}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {formatDate(album.event_date)} · {photos.length} photo
              {photos.length === 1 ? "" : "s"}
            </p>
          </div>

          <a
            href="/gallery"
            className="w-fit rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
          >
            Back to Gallery
          </a>
        </header>

        <section className="mb-6 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          {album.cover_image_url && (
            <div className="h-72 bg-[#101B3D]/10">
              <img
                src={album.cover_image_url}
                alt={album.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <p className="text-sm font-semibold text-[#D4AF37]">
              Album Details
            </p>

            {album.description ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
                {album.description}
              </p>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No description added.
              </p>
            )}
          </div>
        </section>

        {photos.length === 0 && (
          <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#101B3D]">
              No photos in this album yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Photos will appear here once the media team uploads them.
            </p>
          </section>
        )}

        {photos.length > 0 && (
          <section>
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Photos
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#101B3D]">
                Album Photos
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className="overflow-hidden rounded-3xl border border-black/5 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="h-64 bg-[#101B3D]/10">
                    <img
                      src={photo.image_url}
                      alt={photo.caption || album.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    {photo.caption ? (
                      <p className="text-sm leading-6 text-gray-600">
                        {photo.caption}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Tap to view photo
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <p className="font-bold text-[#101B3D]">Photo Preview</p>

                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="rounded-full bg-[#101B3D] px-4 py-2 text-xs font-bold text-white"
                >
                  Close
                </button>
              </div>

              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.caption || album.title}
                className="max-h-[70vh] w-full object-contain bg-black"
              />

              <div className="p-5">
                {selectedPhoto.caption && (
                  <p className="mb-4 text-sm leading-6 text-gray-600">
                    {selectedPhoto.caption}
                  </p>
                )}

                <a
                  href={selectedPhoto.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
                >
                  Open Image
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}