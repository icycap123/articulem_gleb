import type { CSSProperties } from "react";

// ---- palette ----
export const COLORS = {
  bg: "#0a0a0b",
  panel: "rgba(18,18,20,0.72)",
  border: "rgba(255,255,255,0.06)",
  text: "#e9e7e2",
  heading: "#f7f4ee",
  headingSoft: "#f0ede6",
  muted: "#9a978f",
  faint: "#79766f",
  gold: "#cda96a",
  goldBright: "#e6cfa0",
  goldInk: "#1a1408",
};

export const FONT_SERIF = "'Playfair Display', Georgia, serif";
export const FONT_SANS = "'Manrope', system-ui, sans-serif";

// ---- category colors ----
export const CATS: Record<string, string> = {
  "Технологии": "#6ea8fe",
  "Наука": "#5fd1b0",
  "Культура": "#c79be0",
  "Дизайн": "#f0b46a",
  "Психология": "#ef8f9b",
  "Путешествия": "#88cf9a",
  "Финансы": "#cda96a",
};

export const CAT_META: Record<string, { desc: string; glyph: string }> = {
  "Технологии": { desc: "ИИ, гаджеты и будущее цифрового мира.", glyph: "⌁" },
  "Наука": { desc: "Космос, физика, биология и большие вопросы.", glyph: "◈" },
  "Культура": { desc: "Искусство, эссеистика и общество.", glyph: "❝" },
  "Дизайн": { desc: "Интерфейсы, типографика, визуальный язык.", glyph: "▢" },
  "Психология": { desc: "Мозг, привычки и устройство сознания.", glyph: "✺" },
  "Путешествия": { desc: "Города, природа и маршруты со смыслом.", glyph: "❋" },
  "Финансы": { desc: "Инвестиции, экономика и деньги.", glyph: "₿" },
};

export const CATEGORY_LIST = Object.keys(CATS);
export const RANK_COLORS = ["#e6cfa0", "#cda96a", "#a98e5e", "#7d6a45", "#5c5038"];

// ---- helpers ----
export function hex(c: string, a: number): string {
  const h = c.replace("#", "");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function catColor(cat: string): string {
  return CATS[cat] || COLORS.gold;
}

export function badge(col: string): CSSProperties {
  return {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: ".4px",
    textTransform: "uppercase",
    color: col,
    background: hex(col, 0.12),
    border: `1px solid ${hex(col, 0.26)}`,
    padding: "3px 10px",
    borderRadius: 30,
  };
}

export function avatar(col: string, sz: number, fs: number): CSSProperties {
  return {
    width: sz,
    height: sz,
    borderRadius: "50%",
    flexShrink: 0,
    background: `linear-gradient(135deg, ${hex(col, 0.5)}, rgba(20,20,22,0.9))`,
    border: `1px solid ${hex(col, 0.3)}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: fs,
    fontWeight: 600,
    color: COLORS.headingSoft,
  };
}

export function thumb(col: string, w: number, h: number): CSSProperties {
  return {
    position: "relative",
    width: w,
    height: h,
    flexShrink: 0,
    borderRadius: 12,
    overflow: "hidden",
    background: `linear-gradient(150deg, ${hex(col, 0.34)}, ${hex(col, 0.06)} 72%, rgba(18,18,20,0.9))`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

export function thumbGlyph(col: string, fs: number): CSSProperties {
  return {
    fontFamily: FONT_SERIF,
    fontSize: fs,
    color: hex(col, 0.72),
    textShadow: `0 4px 24px ${hex(col, 0.4)}`,
  };
}

export const panel: CSSProperties = {
  background: COLORS.panel,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 18,
};

export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

export function formatDate(d: Date | string): string {
  const dt = typeof d === "string" ? new Date(d) : d;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(dt.getDate())}.${p(dt.getMonth() + 1)}.${dt.getFullYear()}`;
}

const PICK = ["#6ea8fe", "#5fd1b0", "#c79be0", "#f0b46a", "#ef8f9b", "#88cf9a", "#cda96a"];
export function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PICK[h % PICK.length];
}
