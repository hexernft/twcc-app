"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { attendanceRoles } from "@/lib/permissions";

type AttendanceRecord = {
  id: string;
  member_id: string;
  event_type: string;
  attendance_date: string;
  status: string;
  note: string | null;
  created_at: string;
  members: {
    full_name: string;
    phone: string | null;
    section: string | null;
  } | null;
};

const eventTypes = [
  { label: "All Events", value: "all" },
  { label: "Rehearsal", value: "rehearsal" },
  { label: "Sunday Service", value: "sunday_service" },
  { label: "Midweek Service", value: "midweek_service" },
  { label: "Choir Meeting", value: "choir_meeting" },
  { label: "Special Program", value: "special_program" },
  { label: "Concert / Ministration", value: "concert" },
  { label: "Training", value: "training" },
];

const sections = [
  { label: "All Sections", value: "all" },
  { label: "Soprano", value: "soprano" },
  { label: "Alto", value: "alto" },
  { label: "Tenor", value: "tenor" },
  { label: "Bass", value: "bass" },
  { label: "Instrumentalist", value: "instrumentalist" },
  { label: "Choir Leader", value: "choir_leader" },
  { label: "Music Director", value: "music_director" },
];

const statuses = [
  { label: "All Statuses", value: "all" },
  { label: "Present", value: "present" },
  { label: "Absent", value: "absent" },
  { label: "Late", value: "late" },
  { label: "Excused", value: "excused" },
];

function formatLabel(value: string | null) {
  if (!value) return "Not set";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function statusClass(status: string) {
  if (status === "present") return "bg-green-100 text-green-700";
  if (status === "absent") return "bg-red-100 text-red-700";
  if (status === "late") return "bg-orange-100 text-orange-700";
  return "bg-blue-100 text-blue-700";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AttendanceReportPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [eventFilter, setEventFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchAttendanceRecords() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("attendance")
      .select(
        `
        id,
        member_id,
        event_type,
        attendance_date,
        status,
        note,
        created_at,
        members (
          full_name,
          phone,
          section
        )
      `
      )
      .order("attendance_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setRecords(((data || []) as unknown) as AttendanceRecord[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const member = record.members;

      const matchesEvent =
        eventFilter === "all" || record.event_type === eventFilter;

      const matchesSection =
        sectionFilter === "all" || member?.section === sectionFilter;

      const matchesStatus =
        statusFilter === "all" || record.status === statusFilter;

      const searchText = `${member?.full_name || ""} ${member?.phone || ""} ${
        member?.section || ""
      } ${record.event_type} ${record.status}`.toLowerCase();

      const matchesSearch = searchText.includes(searchQuery.toLowerCase());

      return matchesEvent && matchesSection && matchesStatus && matchesSearch;
    });
  }, [records, eventFilter, sectionFilter, statusFilter, searchQuery]);

  const summary = useMemo(() => {
    return {
      total: filteredRecords.length,
      present: filteredRecords.filter((record) => record.status === "present")
        .length,
      absent: filteredRecords.filter((record) => record.status === "absent")
        .length,
      late: filteredRecords.filter((record) => record.status === "late").length,
      excused: filteredRecords.filter((record) => record.status === "excused")
        .length,
    };
  }, [filteredRecords]);

  const attendanceRate =
    summary.total > 0
      ? Math.round(((summary.present + summary.late) / summary.total) * 100)
      : 0;

  return (
    <AdminPageGuard allowedRoles={attendanceRoles}>
      <main className="min-h-screen bg-[#F8F5EE] px-4 py-6 text-[#1F2937]">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                TWCC Admin
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#101B3D]">
                Attendance Report
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View saved attendance records by event, section, status, and member.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/admin/attendance"
                className="rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
              >
                Mark Attendance
              </a>

              <a
                href="/admin"
                className="rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
              >
                Back to Admin
              </a>
            </div>
          </header>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {summary.total}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Present</p>
              <p className="mt-3 text-3xl font-bold text-green-600">
                {summary.present}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Absent</p>
              <p className="mt-3 text-3xl font-bold text-red-600">
                {summary.absent}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Late</p>
              <p className="mt-3 text-3xl font-bold text-orange-500">
                {summary.late}
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {attendanceRate}%
              </p>
            </div>
          </section>

          <section className="mb-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-5">
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
              >
                {eventTypes.map((event) => (
                  <option key={event.value} value={event.value}>
                    {event.label}
                  </option>
                ))}
              </select>

              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
              >
                {sections.map((section) => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member, phone, section..."
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D] lg:col-span-2"
              />
            </div>
          </section>

          {message && (
            <section className="mb-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">
              {message}
            </section>
          )}

          {loading && (
            <section className="rounded-3xl border border-black/5 bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
              Loading attendance records...
            </section>
          )}

          {!loading && filteredRecords.length === 0 && (
            <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#101B3D]">
                No attendance records found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Mark attendance first, or adjust your filters.
              </p>

              <a
                href="/admin/attendance"
                className="mt-6 inline-block rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
              >
                Mark Attendance
              </a>
            </section>
          )}

          {!loading && filteredRecords.length > 0 && (
            <section className="grid gap-4">
              {filteredRecords.map((record) => {
                const memberName = record.members?.full_name || "Unknown Member";

                return (
                  <article
                    key={record.id}
                    className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#101B3D] text-sm font-bold text-white">
                          {getInitials(memberName)}
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-[#101B3D]">
                            {memberName}
                          </h2>

                          <p className="mt-1 text-sm text-gray-500">
                            {formatLabel(record.members?.section || null)} ·{" "}
                            {record.members?.phone || "No phone"}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {formatLabel(record.event_type)} ·{" "}
                            {formatDate(record.attendance_date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 lg:min-w-[300px] lg:items-end">
                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                            record.status
                          )}`}
                        >
                          {formatLabel(record.status)}
                        </span>

                        {record.note && (
                          <p className="max-w-sm text-sm text-gray-500 lg:text-right">
                            Note: {record.note}
                          </p>
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
    </AdminPageGuard>
  );
}