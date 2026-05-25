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

const baseNavItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: "⌂",
  },
  {
    label: "News",
    href: "/announcements",
    icon: "◉",
  },
  {
    label: "Chat",
    href: "/chat",
    icon: "✉",
  },
  {
    label: "Songs",
    href: "/songs",
    icon: "♪",
  },
  {
    label: "Gallery",
    href: "/gallery",
    icon: "▣",
  },
];

const adminNavItem = {
  label: "Admin",
  href: "/admin",
  icon: "◆",
};

const hiddenRoutes = ["/", "/login", "/signup", "/signup/success"];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
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
    if (isAdmin) return [...baseNavItems, adminNavItem];
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
      className={`fixed bottom-0 left-0 right-0 z-[9999] border-t border-white/15 bg-[#101B3D]/90 px-3 pt-2 shadow-2xl backdrop-blur-xl transition-transform duration-300 md:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
      }}
    >
      <div
        className="mx-auto grid max-w-md gap-1 rounded-[1.5rem] border border-white/10 bg-white/10 p-2"
        style={{
          gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))`,
        }}
      >
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition ${
                active
                  ? "bg-[#F7E7CE] text-[#101B3D]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>

              <span className="mt-1 truncate text-[10px] font-bold leading-none">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}