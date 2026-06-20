"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { badge, thumb, thumbGlyph, catColor, hex, RANK_COLORS } from "@/lib/theme";

export type PopItem = {
  id: string;
  title: string;
  author: string;
  category: string;
  likes: number;
  comments: number;
  glyph: string;
  ts: number;
};

const PERIODS: { label: string; days: number | null }[] = [
  { label: "Неделя", days: 7 },
  { label: "Месяц", days: 30 },
  { label: "Всё время", days: null },
];
const TRENDS = ["▲ +4", "▲ +2", "▲ +1", "— 0", "▼ −1", "▲ +3", "— 0", "▲ +2", "▼ −2", "▲ +1"];

export default function PopularClient({ items }: { items: PopItem[] }) {
  const [period, setPeriod] = useState("Всё время");

  const list = useMemo(() => {
    const def = PERIODS.find((p) => p.label === period)!;
    const now = Date.now();
    const filtered = def.days == null ? items : items.filter((i) => now - i.ts <= def.days! * 86400000);
    return [...filtered].sort((a, b) => b.likes - a.likes);
  }, [items, period]);

  const seg = (active: boolean): React.CSSProperties => ({
    border: "none", padding: "8px 15px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
    transition: "all .25s ease", background: active ? "#cda96a" : "transparent", color: active ? "#1a1408" : "#9a978f",
  });

  return (
    <div style={{ paddingTop: 48 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 34 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Рейтинг</div>
          <h1 className="serif" style={{ fontWeight: 700, fontSize: 46, lineHeight: 1.04, margin: 0, color: "#f7f4ee" }}>Популярное</h1>
        </div>
        <div style={{ display: "flex", gap: 6, background: "rgba(20,20,22,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 13, padding: 5 }}>
          {PERIODS.map((p) => (
            <button key={p.label} style={seg(period === p.label)} onClick={() => setPeriod(p.label)}>{p.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {list.map((p, i) => {
          const col = catColor(p.category);
          const t = TRENDS[i] || "— 0";
          const up = t.includes("▲");
          const down = t.includes("▼");
          return (
            <Link key={p.id} href={`/article/${p.id}`}>
              <div
                style={{ display: "flex", alignItems: "center", gap: 22, background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "18px 24px", cursor: "pointer", transition: "border-color .3s ease, transform .3s ease, box-shadow .35s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = hex(col, 0.4); e.currentTarget.style.boxShadow = `0 18px 50px -22px ${hex(col, 0.5)}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span className="serif" style={{ fontSize: 30, fontStyle: "italic", color: RANK_COLORS[i] || "#4a4136", minWidth: 44, textAlign: "center" }}>{String(i + 1).padStart(2, "0")}</span>
                <div style={thumb(col, 58, 58)}><span style={thumbGlyph(col, 26)}>{p.glyph}</span></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={badge(col)}>{p.category}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: up ? "#5fd1b0" : down ? "#ef8f9b" : "#79766f" }}>{t}</span>
                  </div>
                  <div className="serif" style={{ fontSize: 20, fontWeight: 600, color: "#f0ede6", lineHeight: 1.2 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: "#79766f", marginTop: 4 }}>{p.author}</div>
                </div>
                <div style={{ display: "flex", gap: 24, textAlign: "center" }}>
                  <div>
                    <div className="serif" style={{ fontSize: 22, color: "#e6cfa0" }}>{p.likes}</div>
                    <div style={{ fontSize: 11, color: "#79766f", textTransform: "uppercase", letterSpacing: ".5px" }}>лайков</div>
                  </div>
                  <div>
                    <div className="serif" style={{ fontSize: 22, color: "#cdcac2" }}>{p.comments}</div>
                    <div style={{ fontSize: 11, color: "#79766f", textTransform: "uppercase", letterSpacing: ".5px" }}>обсужд.</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {list.length === 0 && (
          <div style={{ textAlign: "center", padding: "70px 20px", color: "#79766f" }}>
            <div className="serif" style={{ fontSize: 26, color: "#cda96a", marginBottom: 8 }}>Пока пусто</div>
            <div style={{ fontSize: 14.5 }}>За выбранный период ещё нет материалов.</div>
          </div>
        )}
      </div>
    </div>
  );
}
