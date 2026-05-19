"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageGuard from "@/components/AdminPageGuard";
import { attendanceRoles } from "@/lib/permissions";

type Member = {
  id: string;
  full_name: string;
  phone: string | null;
  section: string | null;
  member_status: string | null;
};

type AttendanceStatus = "present" | "absent" | "late" | "excused";

type AttendanceDraft = {
  status: AttendanceStatus;
  note: string;
};

const eventTypes = [
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

function formatLabel(value: string | null) {
  if (!value) return "Not set";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

function statusButtonClass(
  currentStatus: AttendanceStatus,
  buttonStatus: AttendanceStatus
) {
  const isActive = currentStatus === buttonStatus;

  if (!isActive) {
    return "rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:border-[#101B3D] hover:text-[#101B3D]";
  }

  if (buttonStatus === "present") {
    return "rounded-full bg-green-600 px-4 py-2 text-xs font-bold text-white";
  }

  if (buttonStatus === "absent") {
    return "rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white";
  }

  if (buttonStatus === "late") {
    return "rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white";
  }

  return "rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white";
}

export default function AdminAttendancePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [eventType, setEventType] = useState("rehearsal");
  const [attendanceDate, setAttendanceDate] = useState(todayDate());
  const [sectionFilter, setSectionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [attendanceDrafts, setAttendanceDrafts] = useState<
    Record<string, AttendanceDraft>
  >({});

  async function fetchMembers() {
    setLoadingMembers(true);
    setMessage("");

    const { data, error } = await supabase
      .from("members")
      .select("id, full_name, phone, section, member_status")
      .order("full_name", { ascending: true });

    if (error) {
      setMessage(error.message);
      setLoadingMembers(false);
      return;
    }

    const activeMembers = (data || []).filter(
      (member) => member.member_status !== "inactive"
    );

    setMembers(activeMembers);

    const initialDrafts: Record<string, AttendanceDraft> = {};

    activeMembers.forEach((member) => {
      initialDrafts[member.id] = {
        status: "present",
        note: "",
      };
    });

    setAttendanceDrafts(initialDrafts);
    setLoadingMembers(false);
  }

  async function fetchExistingAttendance() {
    if (!attendanceDate || members.length === 0) return;

    setMessage("");

    const { data, error } = await supabase
      .from("attendance")
      .select("member_id, status, note")
      .eq("event_type", eventType)
      .eq("attendance_date", attendanceDate);

    if (error) {
      setMessage(error.message);
      return;
    }

    setAttendanceDrafts((prev) => {
      const updated = { ...prev };

      data?.forEach((record) => {
        if (record.member_id && updated[record.member_id]) {
          updated[record.member_id] = {
            status: record.status as AttendanceStatus,
            note: record.note || "",
          };
        }
      });

      return updated;
    });
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchExistingAttendance();
  }, [eventType, attendanceDate, members.length]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSection =
        sectionFilter === "all" || member.section === sectionFilter;

      const searchText = `${member.full_name} ${member.phone || ""} ${
        member.section || ""
      }`.toLowerCase();

      const matchesSearch = searchText.includes(searchQuery.toLowerCase());

      return matchesSection && matchesSearch;
    });
  }, [members, sectionFilter, searchQuery]);

  const summary = useMemo(() => {
    const visibleDrafts = filteredMembers.map(
      (member) => attendanceDrafts[member.id]
    );

    return {
      expected: visibleDrafts.length,
      present: visibleDrafts.filter((draft) => draft?.status === "present")
        .length,
      absent: visibleDrafts.filter((draft) => draft?.status === "absent").length,
      late: visibleDrafts.filter((draft) => draft?.status === "late").length,
      excused: visibleDrafts.filter((draft) => draft?.status === "excused")
        .length,
    };
  }, [filteredMembers, attendanceDrafts]);

  const attendanceRate =
    summary.expected > 0
      ? Math.round(((summary.present + summary.late) / summary.expected) * 100)
      : 0;

  function updateMemberStatus(memberId: string, status: AttendanceStatus) {
    setAttendanceDrafts((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        status,
      },
    }));
  }

  function updateMemberNote(memberId: string, note: string) {
    setAttendanceDrafts((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        note,
      },
    }));
  }

  async function saveAttendance() {
    setSaving(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    const records = filteredMembers.map((member) => {
      const draft = attendanceDrafts[member.id] || {
        status: "present",
        note: "",
      };

      return {
        member_id: member.id,
        event_type: eventType,
        event_id: null,
        attendance_date: attendanceDate,
        status: draft.status,
        note: draft.note || null,
        marked_by: userData.user?.id || null,
        updated_at: new Date().toISOString(),
      };
    });

    const { error } = await supabase.from("attendance").upsert(records, {
      onConflict: "member_id,event_type,event_id,attendance_date",
    });

    if (error) {
      setSaving(false);
      setMessage(error.message);
      return;
    }

    setSaving(false);
    setMessage("Attendance saved successfully!");
  }

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
                Attendance
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Mark attendance for rehearsals, services, meetings, and special programs.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/admin/attendance/report"
                className="rounded-full bg-[#101B3D] px-5 py-3 text-sm font-semibold text-white"
              >
                View Report
              </a>

              <a
                href="/admin"
                className="rounded-full border border-[#101B3D] px-5 py-3 text-sm font-semibold text-[#101B3D]"
              >
                Back to Admin
              </a>
            </div>
          </header>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Expected</p>
              <p className="mt-3 text-3xl font-bold text-[#101B3D]">
                {summary.expected}
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
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Event Type
                </label>

                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                >
                  {eventTypes.map((event) => (
                    <option key={event.value} value={event.value}>
                      {event.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Date
                </label>

                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Section
                </label>

                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                >
                  {sections.map((section) => (
                    <option key={section.value} value={section.value}>
                      {section.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Search Member
                </label>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, or section..."
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                />
              </div>
            </div>
          </section>

          {message && (
            <section className="mb-6 rounded-3xl border border-black/5 bg-white p-5 text-sm font-semibold text-[#101B3D] shadow-sm">
              {message}
            </section>
          )}

          {loadingMembers && (
            <section className="rounded-3xl border border-black/5 bg-white p-6 text-sm font-semibold text-gray-500 shadow-sm">
              Loading members...
            </section>
          )}

          {!loadingMembers && filteredMembers.length === 0 && (
            <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#101B3D]">
                No members found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try changing the section filter or add members first.
              </p>

              <a
                href="/admin/members/add"
                className="mt-6 inline-block rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
              >
                Add Member
              </a>
            </section>
          )}

          {!loadingMembers && filteredMembers.length > 0 && (
            <>
              <section className="grid gap-4">
                {filteredMembers.map((member) => {
                  const draft = attendanceDrafts[member.id] || {
                    status: "present",
                    note: "",
                  };

                  return (
                    <article
                      key={member.id}
                      className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#101B3D] text-sm font-bold text-white">
                            {getInitials(member.full_name)}
                          </div>

                          <div>
                            <h2 className="text-lg font-bold text-[#101B3D]">
                              {member.full_name}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                              {formatLabel(member.section)}
                            </p>

                            {member.phone && (
                              <p className="mt-1 text-sm text-gray-500">
                                {member.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateMemberStatus(member.id, "present")
                            }
                            className={statusButtonClass(
                              draft.status,
                              "present"
                            )}
                          >
                            Present
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateMemberStatus(member.id, "absent")
                            }
                            className={statusButtonClass(draft.status, "absent")}
                          >
                            Absent
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateMemberStatus(member.id, "late")
                            }
                            className={statusButtonClass(draft.status, "late")}
                          >
                            Late
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateMemberStatus(member.id, "excused")
                            }
                            className={statusButtonClass(
                              draft.status,
                              "excused"
                            )}
                          >
                            Excused
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <input
                          type="text"
                          value={draft.note}
                          onChange={(e) =>
                            updateMemberNote(member.id, e.target.value)
                          }
                          placeholder="Optional note, e.g. arrived late, excused by leader..."
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#101B3D]"
                        />
                      </div>
                    </article>
                  );
                })}
              </section>

              <div className="sticky bottom-4 mt-6 rounded-3xl border border-black/5 bg-white p-4 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#101B3D]">
                      Attendance Summary
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {summary.present} present · {summary.late} late ·{" "}
                      {summary.absent} absent · {summary.excused} excused
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={saveAttendance}
                    disabled={saving}
                    className="rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving Attendance..." : "Save Attendance"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </AdminPageGuard>
  );
}