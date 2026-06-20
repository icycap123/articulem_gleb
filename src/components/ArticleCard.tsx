"use client";

import Link from "next/link";
import { useRef } from "react";
import { badge, avatar, thumbGlyph, catColor, hex } from "@/lib/theme";
import LikeButton from "./LikeButton";

export type CardData = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  glyph: string;
  readTime: number;
  authorName: string;
  authorInitials: string;
  date: string;
  likes: number;
  comments: number;
  liked: boolean;
};

export default function ArticleCard({ a, isAuthed }: { a: CardData; isAuthed: boolean }) {
  const col = catColor(a.category);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Link href={`/article/${a.id}`} style={{ display: "block" }}>
      <article
        ref={ref}
        onMouseEnter={() => {
          const c = ref.current!;
          c.style.transform = "translateY(-4px)";
          c.style.borderColor = hex(col, 0.4);
          c.style.boxShadow = `0 18px 50px -20px ${hex(col, 0.5)}`;
          const h = c.querySelector("h4");
          if (h) (h as HTMLElement).style.color = col;
        }}
        onMouseLeave={() => {
          const c = ref.current!;
          c.style.transform = "translateY(0)";
          c.style.borderColor = "rgba(255,255,255,0.06)";
          c.style.boxShadow = "none";
          const h = c.querySelector("h4");
          if (h) (h as HTMLElement).style.color = "#f3f0e9";
        }}
        style={{
          transition: "border-color .3s ease, box-shadow .35s ease, transform .35s ease",
          display: "flex",
          background: "rgba(18,18,20,0.72)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 18,
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 158,
            flexShrink: 0,
            background: `linear-gradient(150deg, ${hex(col, 0.32)}, ${hex(col, 0.06)} 70%, rgba(18,18,20,0.9))`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderRight: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <span style={thumbGlyph(col, 60)}>{a.glyph}</span>
        </div>
        <div style={{ flex: 1, padding: "20px 22px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
            <span style={badge(col)}>{a.category}</span>
            <span style={{ fontSize: 12.5, color: "#79766f" }}>{a.readTime} мин чтения</span>
          </div>
          <h4 className="serif" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.18, margin: "0 0 9px", color: "#f3f0e9", transition: "color .25s ease" }}>
            {a.title}
          </h4>
          <p style={{ fontSize: 14.5, color: "#9a978f", lineHeight: 1.55, margin: "0 0 16px", flex: 1 }}>{a.excerpt}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={avatar(col, 30, 11)}>{a.authorInitials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#d8d5cd" }}>{a.authorName}</div>
              <div style={{ fontSize: 11.5, color: "#6f6c65" }}>{a.date}</div>
            </div>
            <LikeButton articleId={a.id} initialLikes={a.likes} initialLiked={a.liked} color={col} isAuthed={isAuthed} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: "#79766f" }}>💬 {a.comments}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
