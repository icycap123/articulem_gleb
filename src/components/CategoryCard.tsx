"use client";

import Link from "next/link";
import { hex } from "@/lib/theme";

export default function CategoryCard({
  name,
  glyph,
  desc,
  col,
  count,
}: {
  name: string;
  glyph: string;
  desc: string;
  col: string;
  count: number;
}) {
  return (
    <Link href={`/?cat=${encodeURIComponent(name)}`}>
      <div
        style={{ background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 26, cursor: "pointer", transition: "border-color .3s ease, transform .35s ease, box-shadow .35s ease" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = hex(col, 0.4); e.currentTarget.style.boxShadow = `0 18px 50px -22px ${hex(col, 0.5)}`; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <div style={{ width: 54, height: 54, borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: col, background: hex(col, 0.12), border: `1px solid ${hex(col, 0.26)}` }}>{glyph}</div>
        <h3 className="serif" style={{ fontSize: 24, fontWeight: 600, margin: "18px 0 7px", color: "#f3f0e9" }}>{name}</h3>
        <p style={{ fontSize: 14, color: "#9a978f", lineHeight: 1.5, margin: "0 0 18px" }}>{desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: col, fontWeight: 600 }}>{count} статей</span>
          <span style={{ fontSize: 18, color: col }}>→</span>
        </div>
      </div>
    </Link>
  );
}
