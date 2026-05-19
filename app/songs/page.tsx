"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [openLyricsSongId, setOpenLyricsSongId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  function toggleLyrics(songId: string) {
    setOpenLyricsSongId((currentId) => (currentId === songId ? null : songId));
  }

  useEffect(() => {
    fetchSongs();
  }, []);

  const filteredSongs = songs.filter((song) => {
    const searchText = `${song.title} ${song.artist || ""} ${
      song.practice_note || ""
    } ${song.voice_part_note || ""}`.toLowerCase();

    return searchText.includes(searchQuery.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              TWCC
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
              Loveworld Songs
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Practice with full lyrics, song links, and choir notes.
            </p>
          </div>

          <a
            href="/dashboard"
            className="w-fit rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
          >
            Back to Dashboard
          </a>
        </header>

        <section className="mb-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <label className="text-sm font-medium text-gray-700">
            Search Songs
          </label>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, artist, or practice note..."
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
          />
        </section>

        {message && (
          <section className="mb-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">
            {message}
          </section>
        )}

        {loading && (
          <section className="rounded-3xl border border-black/5 bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
            Loading songs...
          </section>
        )}

        {!loading && filteredSongs.length === 0 && (
          <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#101B3D]">
              No songs found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Songs added by the admin will appear here.
            </p>
          </section>
        )}

        {!loading && filteredSongs.length > 0 && (
          <section className="grid gap-4">
            {filteredSongs.map((song) => {
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
                            <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl bg-[#F8F5EE] p-4 text-sm leading-7 text-gray-700">
                              {song.lyrics}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 lg:min-w-[220px] lg:justify-end">
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
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}