"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteArticle } from "@/lib/actions";

export default function DeleteArticleButton({ articleId, redirectTo }: { articleId: string; redirectTo?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function doDelete() {
    start(async () => {
      await deleteArticle(articleId);
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    });
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        disabled={pending}
        style={{ background: "transparent", color: "#ef8f9b", border: "1px solid rgba(239,143,155,0.4)", borderRadius: 10, padding: "10px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
      >
        🗑 Удалить
      </button>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 12.5, color: "#ef8f9b" }}>Удалить навсегда?</span>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={doDelete} disabled={pending}
          style={{ flex: 1, background: "#ef8f9b", color: "#2a0d12", border: "none", borderRadius: 9, padding: "9px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Да, удалить
        </button>
        <button onClick={() => setConfirming(false)} disabled={pending}
          style={{ background: "transparent", color: "#9a978f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, padding: "9px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Отмена
        </button>
      </div>
    </div>
  );
}