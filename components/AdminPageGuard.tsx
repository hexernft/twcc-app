"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { canAccessRole, type UserRole } from "@/lib/permissions";

export default function AdminPageGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: ReactNode;
}) {
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function checkAccess() {
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

      if (!canAccessRole(profile.role, allowedRoles)) {
        setNotice("You do not have permission to view this admin page.");
        setCheckingAccess(false);
        return;
      }

      setCheckingAccess(false);
    }

    checkAccess();
  }, [allowedRoles, router]);

  if (checkingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5EE] px-4">
        <div className="rounded-3xl bg-white px-6 py-4 text-sm font-semibold text-gray-500 shadow-sm">
          Checking page access...
        </div>
      </main>
    );
  }

  if (notice) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5EE] px-4">
        <div className="max-w-md rounded-3xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#101B3D]">
            Access Restricted
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">{notice}</p>

          <a
            href="/admin"
            className="mt-6 inline-block rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Admin
          </a>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}