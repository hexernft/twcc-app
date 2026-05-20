export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101B3D] text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/twcc-hero-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[#101B3D]/80" />

      <header className="absolute left-0 right-0 top-0 z-20 px-4 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F7E7CE]/70 bg-white/10 text-base font-black tracking-[0.12em] text-[#F7E7CE] shadow-lg backdrop-blur-xl sm:h-20 sm:w-20 sm:text-lg">
            TWCC
          </div>

          <a
            href="/login"
            className="rounded-full border border-[#F7E7CE]/50 bg-white/10 px-6 py-3 text-sm font-semibold text-[#F7E7CE] backdrop-blur-xl transition hover:bg-[#F7E7CE] hover:text-[#101B3D]"
          >
            Login
          </a>
        </div>
      </header>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
        <div className="w-full max-w-5xl">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-6xl">
              The World Class Choir
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#F7E7CE] sm:text-2xl">
              Called to worship, chosen to serve.
            </p>
          </div>

          <div className="mx-auto mt-6 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/10 px-6 py-5 text-center backdrop-blur-xl sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-semibold text-[#F7E7CE]">
                Follow us on Instagram
              </p>

              <p className="mt-1 text-sm text-white/70">
                Stay connected with TWCC updates, service moments, and choir
                highlights.
              </p>
            </div>

            <a
              href="https://www.instagram.com/twcchoir/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#F7E7CE]/60 bg-white/10 px-6 py-3 text-sm font-bold text-[#F7E7CE] transition hover:bg-[#F7E7CE] hover:text-[#101B3D]"
            >
              <span className="text-lg">◎</span>
              <span>@twcchoir</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}