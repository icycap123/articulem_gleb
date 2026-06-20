"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addComment } from "@/lib/actions";

export function SaveButton() {
  const [saved, setSaved] = useState(false);
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 14,
    fontWeight: 600,
    padding: "9px 16px",
    borderRadius: 11,
    cursor: "pointer",
    border: `1px solid ${saved ? "rgba(205,169,106,0.45)" : "rgba(255,255,255,0.1)"}`,
    background: saved ? "rgba(205,169,106,0.16)" : "rgba(255,255,255,0.02)",
    color: saved ? "#e6cfa0" : "#cdcac2",
    transition: "all .2s ease",
  };
  return (
    <button onClick={() => setSaved((s) => !s)} style={style}>
      {saved ? "✓ Сохранено" : "☆ Сохранить"}
    </button>
  );
}

export function CommentForm({ articleId, isAuthed }: { articleId: string; isAuthed: boolean }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [pending, start] = useTransition();

  if (!isAuthed) {
    return (
      <div style={{ padding: "16px 18px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 13, color: "#9a978f", fontSize: 14.5, marginBottom: 28 }}>
        Чтобы оставить комментарий,{" "}
        <a href="/login" style={{ color: "#e6cfa0", fontWeight: 600 }}>войдите</a>{" "}
        в аккаунт.
      </div>
    );
  }

  function submit() {
    const t = text.trim();
    if (!t) return;
    start(async () => {
      await addComment(articleId, t);
      setText("");
      router.refresh();
    });
  }

  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
      <div style={{ flex: 1 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Поделитесь мнением…"
          rows={2}
          onFocus={(e) => { e.target.style.borderColor = "rgba(205,169,106,0.5)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
          style={{ width: "100%", background: "rgba(20,20,22,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 13, padding: "13px 15px", color: "#e9e7e2", fontSize: 14.5, outline: "none", resize: "vertical", transition: "border-color .3s ease" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button
            onClick={submit}
            disabled={pending}
            style={{ background: "#cda96a", color: "#1a1408", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", opacity: pending ? 0.8 : 1 }}
          >
            {pending ? "Отправка…" : "Отправить"}
          </button>
        </div>
      </div>
    </div>
  );
}
