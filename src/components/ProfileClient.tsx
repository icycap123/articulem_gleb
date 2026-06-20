"use client";

import Link from "next/link";
import { useState } from "react";
import { badge, avatar, thumb, thumbGlyph, catColor, hex } from "@/lib/theme";

export type ProfileArticle = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  glyph: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason: string | null;
  likes: number;
  comments: number;
  date: string;
  authorName?: string;
};

const STATUS_META: Record<string, { label: string; col: string }> = {
  PENDING: { label: "На проверке", col: "#f0b46a" },
  APPROVED: { label: "Опубликовано", col: "#5fd1b0" },
  REJECTED: { label: "Отклонено", col: "#ef8f9b" },
};

function Row({ a, showStatus, showAuthor }: { a: ProfileArticle; showStatus?: boolean; showAuthor?: boolean }) {
  const col = catColor(a.category);
  const inner = (
    <div
      style={{ display: "flex", gap: 18, background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 18, transition: "border-color .3s ease" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = hex(col, 0.34); }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      <div style={thumb(col, 74, 74)}><span style={thumbGlyph(col, 30)}>{a.glyph}</span></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7, flexWrap: "wrap" }}>
          <span style={badge(col)}>{a.category}</span>
          {showStatus && (
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".3px", color: STATUS_META[a.status].col, background: hex(STATUS_META[a.status].col, 0.12), border: `1px solid ${hex(STATUS_META[a.status].col, 0.3)}`, padding: "3px 9px", borderRadius: 30 }}>
              {STATUS_META[a.status].label}
            </span>
          )}
          <span style={{ fontSize: 12, color: "#79766f" }}>{a.date}</span>
        </div>
        <div className="serif" style={{ fontSize: 19, fontWeight: 600, color: "#f0ede6", lineHeight: 1.2, marginBottom: 5 }}>{a.title}</div>
        <div style={{ fontSize: 13.5, color: "#9a978f", lineHeight: 1.5 }}>{a.excerpt}</div>
        {showAuthor && a.authorName && <div style={{ fontSize: 12.5, color: "#79766f", marginTop: 6 }}>{a.authorName}</div>}
        {a.status === "REJECTED" && a.rejectReason && (
          <div style={{ fontSize: 12.5, color: "#ef8f9b", marginTop: 8, background: "rgba(239,143,155,0.08)", border: "1px solid rgba(239,143,155,0.2)", borderRadius: 9, padding: "7px 11px" }}>
            Причина: {a.rejectReason}
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, fontSize: 13, color: "#79766f" }}>
        <span>▲ {a.likes}</span>
        <span>💬 {a.comments}</span>
      </div>
    </div>
  );
  return a.status === "APPROVED" || showAuthor ? <Link href={`/article/${a.id}`}>{inner}</Link> : inner;
}

export default function ProfileClient({
  name,
  username,
  initials,
  color,
  bio,
  roleTag,
  stats,
  published,
  review,
  liked,
  submitted,
}: {
  name: string;
  username: string;
  initials: string;
  color: string;
  bio: string | null;
  roleTag: string | null;
  stats: { articles: number; followers: number; likes: number; comments: number };
  published: ProfileArticle[];
  review: ProfileArticle[];
  liked: ProfileArticle[];
  submitted: boolean;
}) {
  const tabs = [
    { key: "pub", label: `Опубликованные · ${published.length}` },
    { key: "rev", label: `На проверке · ${review.length}` },
    { key: "liked", label: `Понравившиеся · ${liked.length}` },
  ];
  const [tab, setTab] = useState("pub");

  return (
    <div style={{ paddingTop: 40 }}>
      {submitted && (
        <div style={{ marginBottom: 22, background: "rgba(95,209,176,0.1)", border: "1px solid rgba(95,209,176,0.3)", borderRadius: 13, padding: "14px 18px", color: "#9fe3cd", fontSize: 14.5 }}>
          Статья отправлена на проверку. После одобрения модератором она появится в общей ленте.
        </div>
      )}

      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", padding: "40px 36px", background: `linear-gradient(135deg, ${hex(color, 0.28)}, rgba(10,10,11,0.9) 70%)` }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.05), transparent 60%)" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
          <div style={avatar(color, 84, 28)}>{initials}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 className="serif" style={{ fontWeight: 700, fontSize: 38, margin: 0, color: "#f7f4ee" }}>{name}</h1>
            <div style={{ fontSize: 14.5, color: hex(color, 0.95), fontWeight: 500, marginTop: 4 }}>@{username} · {roleTag || "Автор платформы"}</div>
            <p style={{ fontSize: 14.5, color: "#b9b6ad", lineHeight: 1.55, margin: "12px 0 0", maxWidth: 540 }}>{bio || "Автор платформы Articulem."}</p>
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", gap: 36, marginTop: 30 }}>
          {([["статей", stats.articles], ["подписчиков", stats.followers], ["лайков", stats.likes], ["комментариев", stats.comments]] as const).map(([l, v]) => (
            <div key={l}>
              <div className="serif" style={{ fontSize: 28, color: "#e6cfa0" }}>{v}</div>
              <div style={{ fontSize: 12, color: "#9a978f", textTransform: "uppercase", letterSpacing: ".5px", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, margin: "30px 0 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ border: "none", background: "transparent", color: tab === t.key ? "#f0ede6" : "#79766f", fontSize: 14.5, fontWeight: 600, padding: "12px 16px", cursor: "pointer", borderBottom: `2px solid ${tab === t.key ? "#cda96a" : "transparent"}`, marginBottom: -1, transition: "color .2s ease" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {tab === "pub" && (published.length ? published.map((a) => <Row key={a.id} a={a} />) : <Empty text="У вас пока нет опубликованных статей." cta />)}
        {tab === "rev" && (review.length ? review.map((a) => <Row key={a.id} a={a} showStatus />) : <Empty text="Нет статей на проверке." />)}
        {tab === "liked" && (liked.length ? liked.map((a) => <Row key={a.id} a={a} showAuthor />) : <Empty text="Вы ещё не оценили ни одной статьи." />)}
      </div>
    </div>
  );
}

function Empty({ text, cta }: { text: string; cta?: boolean }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#79766f" }}>
      <div style={{ fontSize: 15, marginBottom: cta ? 18 : 0 }}>{text}</div>
      {cta && (
        <Link href="/create" style={{ display: "inline-block", background: "#cda96a", color: "#1a1408", borderRadius: 11, padding: "11px 22px", fontSize: 14, fontWeight: 700 }}>
          Написать статью
        </Link>
      )}
    </div>
  );
}
