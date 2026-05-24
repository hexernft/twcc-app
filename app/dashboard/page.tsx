"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const adminRoles = [
  "super_admin",
  "admin",
  "section_leader",
  "welfare_leader",
  "media_team",
];

export default function DashboardPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  async function checkAuth() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setRole(profile?.role || "member");
    setCheckingAuth(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  useEffect(() => {
    checkAuth();
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-3xl bg-white/95 px-6 py-4 text-sm font-semibold text-gray-500 shadow-xl backdrop-blur-md">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!role || !adminRoles.includes(role)) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl rounded-[2rem] border border-white/20 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            TWCC
          </p>

          <h1 className="mt-4 text-3xl font-bold text-[#101B3D]">
            Dashboard Under Maintenance
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600">
            Thank you for signing up. Your member information has been received.
            The full TWCC member portal is currently being prepared and will be
            opened when the choir admin team is ready.
          </p>

          <div className="mt-6 rounded-3xl bg-[#F8F5EE] p-5 text-left">
            <p className="text-sm font-bold text-[#101B3D]">
              What happens next?
            </p>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
              <li>• Your signup information is saved.</li>
              <li>• TWCC admin can review your details.</li>
              <li>• Full app access will be enabled later.</li>
            </ul>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/20 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
          TWCC Admin Access
        </p>

        <h1 className="mt-4 text-3xl font-bold text-[#101B3D]">
          Dashboard Access
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600">
          You have admin/team access. Use the admin dashboard to manage the TWCC
          portal.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="/admin"
            className="rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
          >
            Open Admin
          </a>

          <button
            onClick={handleLogout}
            className="rounded-full border border-[#101B3D] px-6 py-3 text-sm font-semibold text-[#101B3D]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}