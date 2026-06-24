"use client";

import { useState } from "react";
import { badge, avatar, thumb, thumbGlyph, formatDate } from "@/lib/theme";
import AdminActions from "./AdminActions";
import DeleteArticleButton from "./DeleteArticleButton";

export default function ArticleModerationCard({ a, col }: { a: any; col: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ display: "flex", gap: 22, alignItems: "flex-start", background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
      <div style={thumb(col, 90, 90)}><span style={thumbGlyph(col, 38)}>{a.glyph}</span></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span style={badge(col)}>{a.category}</span>
          <span style={{ fontSize: 12.5, color: "#79766f" }}>{formatDate(a.createdAt)} · {a.readTime} мин</span>
        </div>
        <h3 className="serif" style={{ fontSize: 24, fontWeight: 600, color: "#f3f0e9", margin: "0 0 8px", lineHeight: 1.2 }}>{a.title}</h3>
        <p style={{ fontSize: 14.5, color: "#9a978f", lineHeight: 1.6, margin: "0 0 14px" }}>{a.excerpt}</p>

        <div
          style={{
            fontSize: 14,
            color: "#b1aea6",
            lineHeight: 1.65,
            whiteSpace: "pre-wrap",
            maxHeight: expanded ? "none" : 150,
            overflow: "hidden",
            maskImage: expanded ? "none" : "linear-gradient(180deg,#000 70%,transparent)",
            WebkitMaskImage: expanded ? "none" : "linear-gradient(180deg,#000 70%,transparent)",
          }}
        >
          {a.body}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          style={{ marginTop: 10, background: "transparent", border: "none", color: "#cda96a", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0 }}
        >
          {expanded ? "Свернуть ↑" : "Читать полностью ↓"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 11, marginTop: 16 }}>
          <div style={avatar(a.author.color, 32, 11)}>{a.author.initials}</div>
          <span style={{ fontSize: 13.5, color: "#d8d5cd", fontWeight: 600 }}>{a.author.name}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <AdminActions articleId={a.id} />
        <DeleteArticleButton articleId={a.id} />
      </div>
    </div>
  );
}