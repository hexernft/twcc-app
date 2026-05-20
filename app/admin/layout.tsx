"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

type BackgroundImage =
  | "admin"
  | "announcements"
  | "chat"
  | "dashboard"
  | "events"
  | "gallery"
  | "rehearsals"
  | "songs"
  | "members";

function getAdminBackground(pathname: string): BackgroundImage {
  if (pathname.includes("/announcements")) return "announcements";
  if (pathname.includes("/rehearsals")) return "rehearsals";
  if (pathname.includes("/songs")) return "songs";
  if (pathname.includes("/gallery")) return "gallery";
  if (pathname.includes("/members")) return "members";
  if (pathname.includes("/attendance")) return "members";
  if (pathname.includes("/welfare")) return "members";

  return "admin";
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

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

  const backgroundImage = getAdminBackground(pathname);

  if (checkingAccess) {
    return (
      <PageBackground
        image={backgroundImage}
        blur="medium"
        overlayColor="black"
        overlayStrength="strong"
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="rounded-3xl bg-white/95 px-6 py-4 text-sm font-semibold text-gray-500 shadow-xl backdrop-blur-md">
            Checking admin access...
          </div>
        </div>
      </PageBackground>
    );
  }

  if (notice) {
    return (
      <PageBackground
        image={backgroundImage}
        blur="medium"
        overlayColor="black"
        overlayStrength="strong"
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md rounded-3xl bg-white/95 p-6 text-center shadow-xl backdrop-blur-md">
            <h1 className="text-xl font-bold text-[#101B3D]">Access Issue</h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">{notice}</p>

            <a
              href="/dashboard"
              className="mt-6 inline-block rounded-full bg-[#101B3D] px-6 py-3 text-sm font-semibold text-white"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </PageBackground>
    );
  }

  return (
    <PageBackground
      image={backgroundImage}
      blur="medium"
      overlayColor="black"
      overlayStrength="strong"
    >
      {children}
    </PageBackground>
  );
}