"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { mediaRoles } from "@/lib/permissions";

type Song = {
  id: string;
  title: string;
  artist: string | null;
  lyrics: string | null;
  song_link: string | null;
  lyrics_link: string | null;
  video_link: string | null;
  practice_note: string | null;
  voice_part_note: string | null;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [openLyricsSongId, setOpenLyricsSongId] = useState<string | null>(null);

  async function fetchSongs() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("songs")
      .select(
        "id, title, artist, lyrics, song_link, lyrics_link, video_link, practice_note, voice_part_note, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setSongs(data || []);
    setLoading(false);
  }

  async function deleteSong(songId: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this song?"
    );

    if (!confirmDelete) return;

    setMessage("");

    const { error } = await supabase.from("songs").delete().eq("id", songId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSongs((prev) => prev.filter((song) => song.id !== songId));
    setMessage("Song deleted successfully.");
  }

  function toggleLyrics(songId: string) {
    setOpenLyricsSongId((currentId) => (currentId === songId ? null : songId));
  }

  useEffect(() => {
    fetchSongs();
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
                Loveworld Songs
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage full lyrics, song links, and choir practice notes.
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
                href="/admin/songs/create"
                className="rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
              >
                Add Song
              </a>
            </div>
          </header>

          <section className="mb-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#101B3D]">Note</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Only upload lyrics that TWCC has permission to store and share
              inside the app.
            </p>
          </section>

          {message && (
            <section className="mb-6 rounded-3xl border border-black/5 bg-white p-5 text-sm font-semibold text-[#101B3D] shadow-sm">
              {message}
            </section>
          )}

          {loading && (
            <section className="rounded-3xl border border-black/5 bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
              Loading songs...
            </section>
          )}

          {!loading && songs.length === 0 && (
            <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#101B3D]">
                No songs added yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Add the first Loveworld song or practice resource for TWCC
                members.
              </p>

              <a
                href="/admin/songs/create"
                className="mt-6 inline-block rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
              >
                Add Song
              </a>
            </section>
          )}

          {!loading && songs.length > 0 && (
            <section className="grid gap-4">
              {songs.map((song) => {
                const lyricsOpen = openLyricsSongId === song.id;

                return (
                  <article
                    key={song.id}
                    className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#D4AF37]">
                          Added {formatDate(song.created_at)}
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-[#101B3D]">
                          {song.title}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {song.artist || "Artist not set"}
                        </p>

                        {song.practice_note && (
                          <div className="mt-4 rounded-2xl bg-[#F8F5EE] p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Practice Note
                            </p>

                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                              {song.practice_note}
                            </p>
                          </div>
                        )}

                        {song.voice_part_note && (
                          <div className="mt-4 rounded-2xl bg-[#F8F5EE] p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Voice Part Note
                            </p>

                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                              {song.voice_part_note}
                            </p>
                          </div>
                        )}

                        {song.lyrics && (
                          <div className="mt-4 rounded-2xl border border-[#101B3D]/10 bg-white p-4">
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Full Lyrics
                              </p>

                              <button
                                type="button"
                                onClick={() => toggleLyrics(song.id)}
                                className="rounded-full border border-[#101B3D] px-4 py-2 text-xs font-bold text-[#101B3D]"
                              >
                                {lyricsOpen ? "Hide Lyrics" : "Show Lyrics"}
                              </button>
                            </div>

                            {lyricsOpen && (
                              <pre className="mt-4 max-h-[500px] overflow-auto whitespace-pre-wrap rounded-2xl bg-[#F8F5EE] p-4 text-sm leading-7 text-gray-700">
                                {song.lyrics}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 lg:min-w-[280px] lg:justify-end">
                        {song.song_link && (
                          <a
                            href={song.song_link}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-[#101B3D] px-4 py-2 text-xs font-bold text-white"
                          >
                            Open Song
                          </a>
                        )}

                        {song.lyrics_link && (
                          <a
                            href={song.lyrics_link}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-[#101B3D] px-4 py-2 text-xs font-bold text-[#101B3D]"
                          >
                            Lyrics Link
                          </a>
                        )}

                        {song.video_link && (
                          <a
                            href={song.video_link}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-[#101B3D] px-4 py-2 text-xs font-bold text-[#101B3D]"
                          >
                            Video
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteSong(song.id)}
                          className="rounded-full border border-red-600 px-4 py-2 text-xs font-bold text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </AdminPageGuard>
  );
}