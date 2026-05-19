"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function checkAdminAccess() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (error || !profile) {
        setNotice("Profile not found. Please contact a TWCC admin.");
        setCheckingAccess(false);
        return;
      }

      const allowedRoles = [
        "super_admin",
        "admin",
        "section_leader",
        "welfare_leader",
        "media_team",
      ];

      if (!allowedRoles.includes(profile.role)) {
        router.push("/dashboard");
        return;
      }

      setCheckingAccess(false);
    }

    checkAdminAccess();
  }, [router]);

  if (checkingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5EE] px-4">
        <div className="rounded-3xl bg-white px-6 py-4 text-sm font-semibold text-gray-500 shadow-sm">
          Checking admin access...
        </div>
      </main>
    );
  }

  if (notice) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5EE] px-4">
        <div className="max-w-md rounded-3xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#101B3D]">Access Issue</h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">{notice}</p>

          <a
            href="/dashboard"
            className="mt-6 inline-block rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
          >
            Go to Dashboard
          </a>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}