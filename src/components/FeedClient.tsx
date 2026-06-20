"use client";

import Link from "next/link";
import { useMemo, useState, useRef } from "react";
import ArticleCard, { type CardData } from "./ArticleCard";
import { badge, avatar, catColor, hex, CATS, RANK_COLORS } from "@/lib/theme";

export type FeedCard = CardData & { ts: number };
type Featured = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  glyph: string;
  readTime: number;
  authorName: string;
  authorInitials: string;
  date: string;
} | null;
type MiniPop = { id: string; title: string; author: string; likes: number };
type MiniAuthor = { id: string; name: string; initials: string; role: string; count: number; color: string };

const SORTS = ["Новые", "Популярные", "Обсуждаемые"];

export default function FeedClient({
  cards,
  featured,
  popularMini,
  authorsMini,
  tags,
  stats,
  isAuthed,
  initialCat = "Все",
}: {
  cards: FeedCard[];
  featured: Featured;
  popularMini: MiniPop[];
  authorsMini: MiniAuthor[];
  tags: string[];
  stats: { articles: number; authors: number };
  isAuthed: boolean;
  initialCat?: string;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Новые");
  const [activeCat, setActiveCat] = useState(initialCat);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let l = cards.filter((a) => {
      const okCat = activeCat === "Все" || a.category === activeCat;
      const okQ = !q || (a.title + a.excerpt + a.authorName + a.category).toLowerCase().includes(q);
      return okCat && okQ;
    });
    if (sort === "Новые") l = [...l].sort((x, y) => y.ts - x.ts);
    if (sort === "Популярные") l = [...l].sort((x, y) => y.likes - x.likes);
    if (sort === "Обсуждаемые") l = [...l].sort((x, y) => y.comments - x.comments);
    return l;
  }, [cards, query, sort, activeCat]);

  const fcol = featured ? catColor(featured.category) : "#cda96a";

  const seg = (active: boolean): React.CSSProperties => ({
    border: "none", padding: "8px 15px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
    transition: "all .25s ease", background: active ? "#cda96a" : "transparent", color: active ? "#1a1408" : "#9a978f",
  });
  const chip = (col: string, active: boolean): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center", gap: 8,
    border: `1px solid ${active ? hex(col, 0.5) : "rgba(255,255,255,0.08)"}`,
    background: active ? hex(col, 0.14) : "rgba(20,20,22,0.6)", color: active ? col : "#b9b6ad",
    padding: "8px 15px", borderRadius: 30, fontSize: 13.5, fontWeight: 500, cursor: "pointer", transition: "all .25s ease",
  });

  return (
    <div>
      <section style={{ padding: "56px 0 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 30 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Журнал идей</div>
            <h1 className="serif" style={{ fontWeight: 700, fontSize: 52, lineHeight: 1.04, margin: 0, color: "#f7f4ee", letterSpacing: "-0.5px" }}>Статьи</h1>
            <p style={{ margin: "14px 0 0", fontSize: 17, color: "#9a978f", maxWidth: 520, lineHeight: 1.55 }}>
              Читайте и обсуждайте материалы авторов платформы — от технологий до культуры внимания.
            </p>
          </div>
          <div style={{ display: "flex", gap: 30 }}>
            <div style={{ textAlign: "right" }}>
              <div className="serif" style={{ fontSize: 32, color: "#e6cfa0" }}>{stats.articles}</div>
              <div style={{ fontSize: 12, color: "#79766f", letterSpacing: ".5px", textTransform: "uppercase", marginTop: 2 }}>статей</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="serif" style={{ fontSize: 32, color: "#e6cfa0" }}>{stats.authors}</div>
              <div style={{ fontSize: 12, color: "#79766f", letterSpacing: ".5px", textTransform: "uppercase", marginTop: 2 }}>авторов</div>
            </div>
          </div>
        </div>

        {featured && (
          <Link href={`/article/${featured.id}`}>
            <article
              style={{ position: "relative", display: "block", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "#0e0e10", minHeight: 340, cursor: "pointer", transition: "border-color .35s ease, box-shadow .4s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = hex(fcol, 0.45); e.currentTarget.style.boxShadow = `0 30px 80px -36px ${hex(fcol, 0.6)}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${hex(fcol, 0.4)}, ${hex(fcol, 0.08)} 55%, #0a0a0b)` }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.62) 46%, rgba(10,10,11,0.18) 100%)" }} />
              <div className="serif" style={{ position: "absolute", bottom: "-30%", right: "-6%", fontSize: 280, lineHeight: 1, color: "rgba(255,255,255,0.045)", fontStyle: "italic", userSelect: "none" }}>{featured.glyph}</div>
              <div style={{ position: "relative", zIndex: 2, maxWidth: 600, padding: "46px 48px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <span style={badge(fcol)}>{featured.category}</span>
                  <span style={{ fontSize: 13, color: "#9a978f" }}>Избранное · {featured.readTime} мин</span>
                </div>
                <h2 className="serif" style={{ fontWeight: 700, fontSize: 40, lineHeight: 1.08, margin: "0 0 16px", color: "#f7f4ee", letterSpacing: "-0.4px" }}>{featured.title}</h2>
                <p style={{ fontSize: 16, color: "#b9b6ad", lineHeight: 1.6, margin: "0 0 26px" }}>{featured.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={avatar(fcol, 42, 14)}>{featured.authorInitials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e9e7e2" }}>{featured.authorName}</div>
                    <div style={{ fontSize: 12.5, color: "#79766f" }}>{featured.date}</div>
                  </div>
                  <span style={{ marginLeft: 8, color: "#cda96a", fontSize: 14, fontWeight: 600 }}>Читать →</span>
                </div>
              </div>
            </article>
          </Link>
        )}
      </section>

      <section style={{ marginTop: 38 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#6f6c65", fontSize: 16 }}>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по статьям, авторам, темам…"
              onFocus={(e) => { e.target.style.borderColor = "rgba(205,169,106,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
              style={{ width: "100%", background: "rgba(20,20,22,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 13, padding: "14px 16px 14px 42px", color: "#e9e7e2", fontSize: 15, outline: "none", transition: "border-color .3s ease" }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, background: "rgba(20,20,22,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 13, padding: 5 }}>
            {SORTS.map((s) => (
              <button key={s} style={seg(sort === s)} onClick={() => setSort(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          {["Все", ...Object.keys(CATS)].map((label) => {
            const col = CATS[label] || "#cda96a";
            const active = activeCat === label;
            return (
              <button key={label} style={chip(col, active)} onClick={() => setActiveCat(label)}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: label === "Все" ? "#cda96a" : col, display: "inline-block" }} />
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 34, marginTop: 36, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 className="serif" style={{ fontSize: 23, fontWeight: 600, margin: 0, color: "#f0ede6" }}>{activeCat === "Все" ? "Все статьи" : activeCat}</h3>
            <span style={{ fontSize: 13, color: "#79766f" }}>{list.length} материалов</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {list.map((a) => (
              <ArticleCard key={a.id} a={a} isAuthed={isAuthed} />
            ))}
          </div>
          {list.length === 0 && (
            <div style={{ textAlign: "center", padding: "70px 20px", color: "#79766f" }}>
              <div className="serif" style={{ fontSize: 30, color: "#cda96a", marginBottom: 8 }}>Ничего не найдено</div>
              <div style={{ fontSize: 15 }}>Попробуйте изменить запрос или выбрать другую категорию.</div>
            </div>
          )}
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 22, position: "sticky", top: 96 }}>
          <div style={{ background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#cda96a", boxShadow: "0 0 10px #cda96a" }} />
              <h3 className="serif" style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#f0ede6" }}>Популярное за неделю</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {popularMini.map((p, i) => (
                <Link key={p.id} href={`/article/${p.id}`} style={{ display: "flex", gap: 14, padding: "11px 6px", borderRadius: 11 }}>
                  <span className="serif" style={{ fontSize: 22, fontStyle: "italic", color: RANK_COLORS[i] || "#5c5038", minWidth: 26, lineHeight: 1.25 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#dcd9d1", lineHeight: 1.3, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: "#79766f" }}>{p.author} · ▲ {p.likes}</div>
                  </div>
                </Link>
              ))}
              {popularMini.length === 0 && <div style={{ fontSize: 13.5, color: "#79766f" }}>Пока нет материалов.</div>}
            </div>
          </div>

          <div style={{ background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
            <h3 className="serif" style={{ fontSize: 18, fontWeight: 600, margin: "0 0 18px", color: "#f0ede6" }}>Топ авторов</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {authorsMini.map((au) => (
                <Link key={au.id} href="/authors" style={{ display: "flex", alignItems: "center", gap: 13 }}>
                  <div style={avatar(au.color, 40, 13)}>{au.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#dcd9d1" }}>{au.name}</div>
                    <div style={{ fontSize: 12, color: "#79766f" }}>{au.role}</div>
                  </div>
                  <span style={{ fontSize: 12.5, color: "#cda96a", fontWeight: 600 }}>{au.count}</span>
                </Link>
              ))}
              {authorsMini.length === 0 && <div style={{ fontSize: 13.5, color: "#79766f" }}>Скоро здесь появятся авторы.</div>}
            </div>
          </div>

          <div style={{ background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
            <h3 className="serif" style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px", color: "#f0ede6" }}>Темы</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tags.map((t) => (
                <button key={t} onClick={() => { setQuery(t); setActiveCat("Все"); }}
                  style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#9a978f", padding: "6px 12px", borderRadius: 9, fontSize: 12.5, fontWeight: 500, cursor: "pointer", transition: "all .25s ease" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
