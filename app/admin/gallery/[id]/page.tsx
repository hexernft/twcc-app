"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function AdminGalleryAlbumPage() {
  const params = useParams();
  const albumId = params.id as string;

  const [album, setAlbum] = useState<GalleryAlbum | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [message, setMessage] = useState("");

  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);
  const [caption, setCaption] = useState("");

  function handlePhotoFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoFiles(e.target.files);
  }

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

  async function uploadSinglePhoto(file: File, index: number) {
    const fileExtension = file.name.split(".").pop();
    const filePath = `${albumId}/photo-${Date.now()}-${index}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery-photos")
      .upload(filePath, file, {
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

  async function addPhotos(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingPhoto(true);
    setMessage("");

    try {
      if (!photoFiles || photoFiles.length === 0) {
        throw new Error("Please select at least one photo.");
      }

      const { data: userData } = await supabase.auth.getUser();

      const uploadedPhotoRecords: GalleryPhoto[] = [];

      for (let index = 0; index < photoFiles.length; index++) {
        const file = photoFiles[index];
        const publicUrl = await uploadSinglePhoto(file, index);

        const { data: photoRecord, error: insertError } = await supabase
          .from("gallery_photos")
          .insert({
            album_id: albumId,
            image_url: publicUrl,
            caption: caption || null,
            uploaded_by: userData.user?.id || null,
          })
          .select("id, album_id, image_url, caption, created_at")
          .single();

        if (insertError) {
          throw new Error(insertError.message);
        }

        uploadedPhotoRecords.push(photoRecord);
      }

      setPhotos((prev) => [...uploadedPhotoRecords, ...prev]);
      setCaption("");
      setPhotoFiles(null);

      const fileInput = document.getElementById(
        "photo-upload"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      setSavingPhoto(false);
      setMessage(
        `${uploadedPhotoRecords.length} photo${
          uploadedPhotoRecords.length === 1 ? "" : "s"
        } uploaded successfully.`
      );
    } catch (error) {
      setSavingPhoto(false);
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  async function deletePhoto(photoId: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this photo?"
    );

    if (!confirmDelete) return;

    setMessage("");

    const { error } = await supabase
      .from("gallery_photos")
      .delete()
      .eq("id", photoId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    setMessage("Photo deleted successfully.");
  }

  useEffect(() => {
    if (albumId) {
      fetchAlbumAndPhotos();
    }
  }, [albumId]);

  if (loading) {
    return (
      <AdminPageGuard allowedRoles={mediaRoles}>
        <main className="min-h-screen bg-[#F8F5EE] px-4 py-6">
          <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
            Loading album...
          </div>
        </main>
      </AdminPageGuard>
    );
  }

  if (!album) {
    return (
      <AdminPageGuard allowedRoles={mediaRoles}>
        <main className="min-h-screen bg-[#F8F5EE] px-4 py-6">
          <div className="mx-auto max-w-6xl rounded-3xl bg-red-50 p-6 text-sm font-semibold text-red-700 shadow-sm">
            Album not found.
          </div>
        </main>
      </AdminPageGuard>
    );
  }

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
                {album.title}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {formatDate(album.event_date)} · {photos.length} photo
                {photos.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/admin/gallery"
                className="rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
              >
                Back to Gallery
              </a>

              <a
                href={`/gallery/${album.id}`}
                className="rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
              >
                Member View
              </a>
            </div>
          </header>

          {message && (
            <section className="mb-6 rounded-3xl border border-black/5 bg-white p-5 text-sm font-semibold text-[#101B3D] shadow-sm">
              {message}
            </section>
          )}

          <section className="mb-6 grid gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm lg:col-span-1">
              <div className="h-64 bg-[#101B3D]/10">
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
            </div>

            <form
              onSubmit={addPhotos}
              className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm lg:col-span-2"
            >
              <p className="text-sm font-semibold text-[#D4AF37]">
                Upload Photos
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#101B3D]">
                Add photos to this album
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Select Photos
                  </label>

                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    required
                    onChange={handlePhotoFilesChange}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                  />

                  {photoFiles && photoFiles.length > 0 && (
                    <p className="mt-2 text-xs font-semibold text-[#101B3D]">
                      Selected {photoFiles.length} photo
                      {photoFiles.length === 1 ? "" : "s"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Caption
                  </label>

                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Optional caption. This caption will be used for all selected photos."
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#101B3D]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPhoto}
                  className="rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingPhoto ? "Uploading Photos..." : "Upload Photos"}
                </button>
              </div>
            </form>
          </section>

          {photos.length === 0 && (
            <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#101B3D]">
                No photos added yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Upload photos to start building this album.
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
                  <article
                    key={photo.id}
                    className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"
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
                        <p className="text-sm text-gray-500">No caption</p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href={photo.image_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-[#101B3D] px-4 py-2 text-xs font-bold text-[#101B3D]"
                        >
                          Open Image
                        </a>

                        <button
                          type="button"
                          onClick={() => deletePhoto(photo.id)}
                          className="rounded-full border border-red-600 px-4 py-2 text-xs font-bold text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </AdminPageGuard>
  );
}