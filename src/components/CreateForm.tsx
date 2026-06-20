"use client";

import { useState, useTransition } from "react";
import { createArticle } from "@/lib/actions";
import { CATS, CAT_META, hex, badge } from "@/lib/theme";

const TOOLBAR = ["B", "i", "“", "H", "🔗"];

export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("Технологии");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const ccol = CATS[cat] || "#cda96a";
  const previewGlyph = CAT_META[cat]?.glyph || "✦";

  function submit() {
    setError("");
    if (!title.trim()) {
      setError("Добавьте заголовок, чтобы отправить статью.");
      return;
    }
    const fd = new FormData();
    fd.set("title", title);
    fd.set("category", cat);
    fd.set("excerpt", excerpt);
    fd.set("body", body);
    fd.set("tags", tags);
    start(async () => {
      const res = await createArticle(fd);
      if (res && !res.ok) setError(res.error || "Не удалось отправить статью.");
    });
  }

  const label: React.CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", color: "#79766f", marginBottom: 9 };
  const field: React.CSSProperties = { width: "100%", background: "rgba(12,12,14,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 13, color: "#d8d5cd", fontSize: 14.5, outline: "none", transition: "border-color .3s ease" };
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = "rgba(205,169,106,0.5)"; };
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; };

  return (
    <div style={{ paddingTop: 44 }}>
      <div style={{ marginBottom: 30 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Редактор</div>
        <h1 className="serif" style={{ fontWeight: 700, fontSize: 44, lineHeight: 1.05, margin: 0, color: "#f7f4ee" }}>Новая статья</h1>
        <p style={{ margin: "12px 0 0", fontSize: 15, color: "#9a978f", maxWidth: 560 }}>
          После отправки статья попадёт на проверку модератору. Как только её одобрят — она появится в общей ленте.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>
        <div style={{ background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 30 }}>
          <label style={label}>Заголовок</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} onFocus={focus} onBlur={blur} placeholder="О чём ваша статья?"
            style={{ ...field, padding: "15px 16px", color: "#f3f0e9", fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600 }} />

          <label style={{ ...label, margin: "24px 0 11px" }}>Категория</label>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
            {Object.keys(CATS).map((label) => {
              const col = CATS[label];
              const active = cat === label;
              return (
                <button key={label} onClick={() => setCat(label)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, border: `1px solid ${active ? hex(col, 0.5) : "rgba(255,255,255,0.1)"}`, background: active ? hex(col, 0.14) : "transparent", color: active ? col : "#9a978f", padding: "7px 13px", borderRadius: 30, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .2s ease" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: col, display: "inline-block" }} />
                  {label}
                </button>
              );
            })}
          </div>

          <label style={{ ...label, margin: "24px 0 9px" }}>Краткое описание</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} onFocus={focus} onBlur={blur} rows={2} placeholder="Анонс, который увидят в ленте…"
            style={{ ...field, padding: "13px 15px", lineHeight: 1.5, resize: "vertical" }} />

          <label style={{ ...label, margin: "24px 0 9px" }}>Текст статьи</label>
          <div style={{ display: "flex", gap: 4, background: "rgba(12,12,14,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none", borderRadius: "13px 13px 0 0", padding: "8px 10px" }}>
            {TOOLBAR.map((t) => (
              <button key={t} type="button" style={{ minWidth: 34, height: 30, border: "none", background: "transparent", color: "#9a978f", borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: "pointer", fontStyle: t === "i" ? "italic" : "normal", fontFamily: t === "i" ? "'Playfair Display', serif" : "'Manrope', sans-serif" }}>{t}</button>
            ))}
          </div>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} onFocus={focus} onBlur={blur} rows={9} placeholder="Начните писать…"
            style={{ ...field, borderRadius: "0 0 13px 13px", padding: "15px 16px", color: "#d8d5cd", fontSize: 15.5, lineHeight: 1.7, resize: "vertical" }} />

          <label style={{ ...label, margin: "24px 0 9px" }}>Теги</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} onFocus={focus} onBlur={blur} placeholder="внимание, фокус, эссе (через запятую)"
            style={{ ...field, padding: "13px 15px" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
            <button onClick={submit} disabled={pending}
              style={{ background: "#cda96a", color: "#1a1408", border: "none", borderRadius: 11, padding: "13px 26px", fontSize: 14.5, fontWeight: 700, cursor: "pointer", opacity: pending ? 0.8 : 1 }}>
              {pending ? "Отправка…" : "Отправить на проверку"}
            </button>
            {error && <span style={{ color: "#ef8f9b", fontSize: 13.5, fontWeight: 600 }}>{error}</span>}
          </div>
        </div>

        <div style={{ position: "sticky", top: 96 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", color: "#79766f", marginBottom: 12 }}>Предпросмотр в ленте</div>
          <article style={{ display: "flex", flexDirection: "column", background: "rgba(18,18,20,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ position: "relative", height: 130, background: `linear-gradient(150deg, ${hex(ccol, 0.34)}, ${hex(ccol, 0.06)} 72%, rgba(18,18,20,0.9))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="serif" style={{ fontSize: 48, color: hex(ccol, 0.72) }}>{previewGlyph}</span>
            </div>
            <div style={{ padding: "20px 22px" }}>
              <span style={badge(ccol)}>{cat}</span>
              <h4 className="serif" style={{ fontSize: 21, fontWeight: 600, lineHeight: 1.18, margin: "12px 0 9px", color: title ? "#f3f0e9" : "#5a574f" }}>{title || "Заголовок статьи"}</h4>
              <p style={{ fontSize: 14, color: "#9a978f", lineHeight: 1.55, margin: 0 }}>{excerpt || "Краткое описание появится здесь."}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
