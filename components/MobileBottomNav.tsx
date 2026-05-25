"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
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
    label: "Admin",
    href: "/admin",
    icon: "◆",
  },
];

const hiddenRoutes = ["/", "/login", "/signup", "/signup/success"];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const shouldHide =
    hiddenRoutes.includes(pathname) ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api");

  useEffect(() => {
    if (shouldHide) return;

    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 80) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, shouldHide]);

  if (shouldHide) return null;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-white/15 bg-[#101B3D]/90 px-3 pb-3 pt-2 shadow-2xl backdrop-blur-xl transition-transform duration-300 md:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-[1.5rem] border border-white/10 bg-white/10 p-2">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition ${
                active
                  ? "bg-[#F7E7CE] text-[#101B3D]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>

              <span className="mt-1 text-[10px] font-bold leading-none">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}