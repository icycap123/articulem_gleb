"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { moderateArticle } from "@/lib/actions";

export default function AdminActions({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");

  function approve() {
    start(async () => {
      await moderateArticle(articleId, "APPROVE");
      router.refresh();
    });
  }
  function reject() {
    start(async () => {
      await moderateArticle(articleId, "REJECT", reason.trim() || undefined);
      setShowReason(false);
      setReason("");
      router.refresh();
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch", minWidth: 180 }}>
      <button onClick={approve} disabled={pending}
        style={{ background: "#5fd1b0", color: "#08251d", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", opacity: pending ? 0.75 : 1 }}>
        ✓ Одобрить
      </button>
      {!showReason ? (
        <button onClick={() => setShowReason(true)} disabled={pending}
          style={{ background: "transparent", color: "#ef8f9b", border: "1px solid rgba(239,143,155,0.4)", borderRadius: 10, padding: "10px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
          ✕ Отклонить
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Причина (необязательно)"
            style={{ background: "rgba(12,12,14,0.7)", border: "1px solid rgba(239,143,155,0.35)", borderRadius: 9, padding: "9px 12px", color: "#e9e7e2", fontSize: 13, outline: "none" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={reject} disabled={pending}
              style={{ flex: 1, background: "#ef8f9b", color: "#2a0d12", border: "none", borderRadius: 9, padding: "9px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Отклонить
            </button>
            <button onClick={() => { setShowReason(false); setReason(""); }} disabled={pending}
              style={{ background: "transparent", color: "#9a978f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, padding: "9px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
