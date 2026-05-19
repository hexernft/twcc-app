export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101B3D] text-white">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/twcc-hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#101B3D]/75" />

      {/* Page Content */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            TWCC
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-6xl">
            The World Class Choir
          </h1>

          <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
            One choir. One sound. One platform for announcements, rehearsals,
            attendance, welfare, songs, gallery, and communication.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/login"
              className="rounded-full bg-[#D4AF37] px-7 py-3 text-sm font-bold text-[#101B3D]"
            >
              Login
            </a>

            <a
              href="/dashboard"
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white"
            >
              Open Dashboard
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}