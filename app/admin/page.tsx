const summaryCards = [
  { label: "Total Members", value: "86" },
  { label: "Active Members", value: "78" },
  { label: "Attendance This Month", value: "82%" },
  { label: "Welfare Follow-ups", value: "5" },
  { label: "Birthdays This Month", value: "9" },
  { label: "Gallery Albums", value: "24" },
];

const quickActions = [
  {
    label: "Add Member",
    description: "Register a new choir member",
    href: "/admin/members/add",
  },
  {
    label: "Post Announcement",
    description: "Share important choir updates",
    href: "/admin/announcements/create",
  },
  {
    label: "Create Rehearsal",
    description: "Schedule rehearsal time and venue",
    href: "/admin/rehearsals/create",
  },
  {
    label: "Mark Attendance",
    description: "Record attendance for members",
    href: "/admin/attendance",
  },
  {
    label: "Upload Photos",
    description: "Manage choir gallery albums",
    href: "/admin/gallery",
  },
  {
    label: "Add Song",
    description: "Upload lyrics and song links",
    href: "/admin/songs/create",
  },
];

const managementSections = [
  {
    title: "Members",
    description: "View, add, and update choir member records.",
    href: "/admin/members",
  },
  {
    title: "Announcements",
    description: "Post updates, reminders, dress codes, and notices.",
    href: "/admin/announcements",
  },
  {
    title: "Rehearsals",
    description: "Create and manage rehearsal schedules.",
    href: "/admin/rehearsals",
  },
  {
    title: "Attendance",
    description: "Mark attendance and view reports.",
    href: "/admin/attendance",
  },
  {
    title: "Welfare",
    description: "Track care, follow-ups, sickness, and member welfare.",
    href: "/admin/welfare",
  },
  {
    title: "Songs",
    description: "Manage Loveworld songs, lyrics, and practice notes.",
    href: "/admin/songs",
  },
  {
    title: "Gallery",
    description: "Create albums and upload choir photos.",
    href: "/admin/gallery",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen px-4 py-6 text-[#1F2937]">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              TWCC Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold text-white drop-shadow-sm">
              Management Center
            </h1>

            <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-white/75">
              Manage members, rehearsals, attendance, welfare, songs, gallery,
              and choir communication from one secure place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/dashboard"
              className="rounded-full border border-[#D4AF37]/50 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur-md transition hover:bg-white hover:text-[#101B3D]"
            >
              Member View
            </a>

            <a
              href="/admin/members/add"
              className="rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#101B3D] shadow-xl transition hover:bg-white"
            >
              Add Member
            </a>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-md"
            >
              <p className="text-sm text-gray-500">{card.label}</p>

              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
              <div>
                <p className="text-sm font-semibold text-[#D4AF37]">
                  Quick Actions
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#101B3D]">
                  What do you want to manage?
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Jump straight into the most important admin tasks.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {quickActions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="group rounded-2xl bg-[#F8F5EE] px-4 py-4 text-left transition hover:bg-[#101B3D]"
                  >
                    <p className="text-sm font-bold text-[#101B3D] group-hover:text-white">
                      {action.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500 group-hover:text-white/70">
                      {action.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[#101B3D]/95 p-6 text-white shadow-2xl backdrop-blur-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#D4AF37]">
                    Attendance Overview
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    82% Attendance
                  </h2>

                  <p className="mt-2 text-sm text-white/70">
                    Last rehearsal attendance summary.
                  </p>
                </div>

                <a
                  href="/admin/attendance/report"
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#101B3D]"
                >
                  View Report
                </a>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/60">Present</p>
                  <p className="mt-1 text-xl font-bold">42</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/60">Absent</p>
                  <p className="mt-1 text-xl font-bold">8</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/60">Late</p>
                  <p className="mt-1 text-xl font-bold">5</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/60">Excused</p>
                  <p className="mt-1 text-xl font-bold">3</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#D4AF37]">
                    Management Sections
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-[#101B3D]">
                    Admin Tools
                  </h2>
                </div>

                <a
                  href="/admin/members"
                  className="w-fit rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
                >
                  View Members
                </a>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {managementSections.map((section) => (
                  <a
                    key={section.title}
                    href={section.href}
                    className="rounded-2xl border border-black/5 bg-[#F8F5EE] p-4 transition hover:bg-white hover:shadow-md"
                  >
                    <h3 className="font-bold text-[#101B3D]">
                      {section.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      {section.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Welfare Overview
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#101B3D]">
                Member Care
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between rounded-2xl bg-[#F8F5EE] p-4">
                  <span className="text-gray-600">Needs Follow-up</span>
                  <span className="font-bold text-[#101B3D]">5</span>
                </div>

                <div className="flex justify-between rounded-2xl bg-[#F8F5EE] p-4">
                  <span className="text-gray-600">Sick</span>
                  <span className="font-bold text-[#101B3D]">2</span>
                </div>

                <div className="flex justify-between rounded-2xl bg-[#F8F5EE] p-4">
                  <span className="text-gray-600">Traveling</span>
                  <span className="font-bold text-[#101B3D]">3</span>
                </div>
              </div>

              <a
                href="/admin/welfare"
                className="mt-5 block w-full rounded-full bg-[#D4AF37] px-5 py-3 text-center text-sm font-bold text-[#101B3D]"
              >
                View Welfare
              </a>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Latest Announcements
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[#F8F5EE] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-[#101B3D]">
                      Dress Code for Sunday
                    </h3>

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                      Important
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Posted May 19, 2026
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8F5EE] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-[#101B3D]">
                      Rehearsal Time Update
                    </h3>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                      Urgent
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Posted May 18, 2026
                  </p>
                </div>
              </div>

              <a
                href="/admin/announcements"
                className="mt-5 block w-full rounded-full border border-[#101B3D] px-5 py-3 text-center text-sm font-semibold text-[#101B3D]"
              >
                Manage Announcements
              </a>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm font-semibold text-[#D4AF37]">
                Media & Songs
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[#F8F5EE] p-4">
                  <p className="text-xs text-gray-500">Latest Gallery</p>

                  <h3 className="mt-1 font-bold text-[#101B3D]">
                    Sunday Service
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">48 photos</p>
                </div>

                <div className="rounded-2xl bg-[#F8F5EE] p-4">
                  <p className="text-xs text-gray-500">Latest Song</p>

                  <h3 className="mt-1 font-bold text-[#101B3D]">
                    You Are Great
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Loveworld Singers
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <a
                  href="/admin/gallery"
                  className="rounded-full border border-[#101B3D] px-5 py-3 text-center text-sm font-semibold text-[#101B3D]"
                >
                  Manage Gallery
                </a>

                <a
                  href="/admin/songs"
                  className="rounded-full bg-[#101B3D] px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Manage Songs
                </a>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}