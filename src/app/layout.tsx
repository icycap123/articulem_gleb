import type { Metadata } from "next";
import "./globals.css";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Articulem — журнал идей",
  description: "Читайте, пишите и обсуждайте статьи авторов платформы Articulem.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const navUser = user ? { name: user.name, initials: user.initials, role: user.role } : null;

  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div style={{ position: "relative", minHeight: "100vh", background: "#0a0a0b", color: "#e9e7e2", overflowX: "hidden" }}>
          <Background />
          <Navbar user={navUser} />
          <main id="top" style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "0 32px 110px" }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
