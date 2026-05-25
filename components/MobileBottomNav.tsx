"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const adminRoles = [
  "super_admin",
  "admin",
  "section_leader",
  "welfare_leader",
  "media_team",
];

type NavItem = {
  label: string;
  href: string;
  icon: "home" | "news" | "chat" | "songs" | "gallery" | "admin";
};

const baseNavItems: NavItem[] = [
  {
    label: "Home",
    href: "/dashboard",
    icon: "home",
  },
  {
    label: "News",
    href: "/announcements",
    icon: "news",
  },
  {
    label: "Chat",
    href: "/chat",
    icon: "chat",
  },
  {
    label: "Songs",
    href: "/songs",
    icon: "songs",
  },
  {
    label: "Gallery",
    href: "/gallery",
    icon: "gallery",
  },
];

const adminNavItem: NavItem = {
  label: "Admin",
  href: "/admin",
  icon: "admin",
};

const hiddenRoutes = ["/", "/login", "/signup", "/signup/success"];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({
  name,
  active,
}: {
  name: NavItem["icon"];
  active: boolean;
}) {
  const color = active ? "#F7E7CE" : "rgba(255,255,255,0.68)";

  if (name === "home") {
    return (
      <svg width="27" height="27" viewBox="0 0 24 24" fill={color}>
        <path d="M3 10.6 12 3l9 7.6v9.1c0 .7-.6 1.3-1.3 1.3h-5.2v-6.4h-5V21H4.3c-.7 0-1.3-.6-1.3-1.3v-9.1Z" />
      </svg>
    );
  }

  if (name === "news") {
    return (
      <svg
        width="27"
        height="27"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 4h12v16l-6-3-6 3V4Z" />
      </svg>
    );
  }

  if (name === "chat") {
    return (
      <svg
        width="27"
        height="27"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 5h16v11H8l-4 4V5Z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </svg>
    );
  }

  if (name === "songs") {
    return (
      <svg
        width="27"
        height="27"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18V5l10-2v13" />
        <circle cx="7" cy="18" r="3" />
        <circle cx="17" cy="16" r="3" />
      </svg>
    );
  }

  if (name === "gallery") {
    return (
      <svg
        width="27"
        height="27"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M8 13l2.2-2.2 3.2 3.2 1.6-1.6L20 17" />
        <circle cx="9" cy="9" r="1.2" />
      </svg>
    );
  }

  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4 21c1.2-4 4-6 8-6s6.8 2 8 6" />
    </svg>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  const shouldHide =
    hiddenRoutes.includes(pathname) ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api");

  const navItems = useMemo(() => {
    if (isAdmin) return [...baseNavItems.slice(0, 4), adminNavItem];
    return baseNavItems;
  }, [isAdmin]);

  useEffect(() => {
    let isMounted = true;

    async function checkRole() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        if (isMounted) setIsAdmin(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (isMounted) {
        setIsAdmin(adminRoles.includes(profile?.role || ""));
      }
    }

    checkRole();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (shouldHide) return;

    lastScrollYRef.current = window.scrollY;
    setIsVisible(true);

    function handleScroll() {
      if (tickingRef.current) return;

      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const lastScrollY = lastScrollYRef.current;
        const difference = currentScrollY - lastScrollY;

        if (currentScrollY < 80) {
          setIsVisible(true);
          lastScrollYRef.current = currentScrollY;
          tickingRef.current = false;
          return;
        }

        if (Math.abs(difference) < 8) {
          tickingRef.current = false;
          return;
        }

        if (difference > 0) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }

        lastScrollYRef.current = currentScrollY;
        tickingRef.current = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, shouldHide]);

  if (shouldHide) return null;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-[9999] border-t border-[#F7E7CE]/15 bg-[#101B3D] px-2 pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.28)] transition-transform duration-300 md:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        paddingBottom: "calc(0.45rem + env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto grid max-w-md grid-cols-5">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <a
              key={item.href}
              href={item.href}
              className="flex min-w-0 flex-col items-center justify-center gap-1 py-1.5 text-center"
            >
              <div
                className={`flex h-8 w-12 items-center justify-center rounded-full transition ${
                  active ? "bg-[#F7E7CE]/12" : "bg-transparent"
                }`}
              >
                <NavIcon name={item.icon} active={active} />
              </div>

              <span
                className={`truncate text-[11px] font-medium leading-none ${
                  active ? "text-[#F7E7CE]" : "text-white/60"
                }`}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}