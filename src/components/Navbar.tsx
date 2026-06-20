"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type NavUser = { name: string; initials: string; role: "USER" | "ADMIN" } | null;

const NAV = [
  { label: "Статьи", href: "/" },
  { label: "Категории", href: "/categories" },
  { label: "Популярное", href: "/popular" },
  { label: "Авторы", href: "/authors" },
];

export default function Navbar({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/" || pathname.startsWith("/article");
    return pathname.startsWith(href);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  const navItem = (active: boolean): React.CSSProperties => ({
    fontSize: 14.5,
    fontWeight: 500,
    color: active ? "#f0ede6" : "#9a978f",
    padding: "7px 13px",
    borderRadius: 9,
    cursor: "pointer",
    transition: "color .25s ease, background .25s ease",
    background: active ? "rgba(255,255,255,0.05)" : "transparent",
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "background .4s ease, border-color .4s ease, backdrop-filter .4s ease",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)"}`,
        background: scrolled ? "rgba(10,10,11,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "18px 32px", display: "flex", alignItems: "center", gap: 38 }}>
        <Link href="/" className="wordmark" style={{ fontSize: 27 }}>
          Articulem
        </Link>
        <nav style={{ display: "flex", gap: 4, marginLeft: 4 }}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} style={navItem(isActive(n.href))}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href="/admin" style={{ color: "#9a978f", fontSize: 13.5, fontWeight: 600 }}>
                  Админ
                </Link>
              )}
              <Link
                href="/create"
                style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", color: "#e6cfa0", border: "1px solid rgba(205,169,106,0.4)", borderRadius: 10, padding: "9px 15px", fontSize: 13.5, fontWeight: 600 }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span> Создать
              </Link>
              <Link
                href="/profile"
                title={user.name}
                style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#2a2a30,#16161a)", border: "1px solid rgba(205,169,106,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#e6cfa0" }}
              >
                {user.initials}
              </Link>
              <button
                onClick={logout}
                style={{ background: "#e9e7e2", color: "#111", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: "#cdcac2", fontSize: 14, fontWeight: 600, padding: "9px 6px" }}>
                Войти
              </Link>
              <Link
                href="/register"
                style={{ background: "#e9e7e2", color: "#111", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 14, fontWeight: 600 }}
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
      <div style={{ height: 2, background: "transparent" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#cda96a,#e6cfa0)", boxShadow: "0 0 10px rgba(205,169,106,0.6)", transition: "width .1s linear" }} />
      </div>
    </header>
  );
}
