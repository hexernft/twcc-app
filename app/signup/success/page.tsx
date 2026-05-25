export default function SignupSuccessPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101B3D] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/signup-success.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-[#101B3D]/70" />

      <header className="absolute left-0 right-0 top-0 z-20 px-4 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="/"
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F7E7CE]/70 bg-white/10 text-base font-black tracking-[0.12em] text-[#F7E7CE] shadow-lg backdrop-blur-xl sm:h-20 sm:w-20 sm:text-lg"
          >
            TWCC
          </a>

          <a
            href="/login"
            className="rounded-full border border-[#F7E7CE]/50 bg-white/10 px-6 py-3 text-sm font-semibold text-[#F7E7CE] backdrop-blur-xl transition hover:bg-[#F7E7CE] hover:text-[#101B3D]"
          >
            Login
          </a>
        </div>
      </header>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#F7E7CE]">
            Signup Received
          </p>

          <h1 className="mt-4 text-3xl font-bold text-white">
            Check Your Email
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/75">
            Your TWCC signup information has been submitted successfully.
            Please check your email and confirm your account before logging in.
          </p>

          <div className="mt-6 rounded-3xl bg-white/10 p-5 text-left backdrop-blur-xl">
            <p className="text-sm font-bold text-[#F7E7CE]">
              What happens next?
            </p>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
              <li>• Confirm your email from your inbox.</li>
              <li>• Login after confirmation.</li>
              <li>
                • Your dashboard will show maintenance while access is being
                prepared.
              </li>
              <li>
                • TWCC admin can review your submitted member information.
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/login"
              className="rounded-full bg-[#F7E7CE] px-6 py-3 text-sm font-bold text-[#101B3D] transition hover:bg-white"
            >
              Go to Login
            </a>

            <a
              href="/"
              className="rounded-full border border-[#F7E7CE]/50 bg-white/10 px-6 py-3 text-sm font-semibold text-[#F7E7CE] transition hover:bg-[#F7E7CE] hover:text-[#101B3D]"
            >
              Back Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}