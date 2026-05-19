export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8F5EE] flex items-center justify-center px-6">
      <div className="max-w-xl w-full rounded-3xl bg-white p-8 shadow-sm border border-black/5 text-center">
        <p className="text-sm font-semibold text-[#D4AF37] uppercase tracking-[0.2em]">
          TWCC
        </p>

        <h1 className="mt-4 text-4xl font-bold text-[#101B3D]">
          The World Class Choir
        </h1>

        <p className="mt-4 text-gray-600">
          One choir. One sound. One platform.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/login"
            className="rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
          >
            Login
          </a>

          <a
            href="/dashboard"
            className="rounded-full border border-[#101B3D] px-6 py-3 text-sm font-semibold text-[#101B3D]"
          >
            View Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}