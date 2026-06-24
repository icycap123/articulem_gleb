"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleBanUser } from "@/lib/actions";

export default function BanUserButton({ userId, initialBanned }: { userId: string; initialBanned: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [banned, setBanned] = useState(initialBanned);
  const [confirming, setConfirming] = useState(false);

  function doToggle() {
    start(async () => {
      const res = await toggleBanUser(userId);
      if (res.ok) {
        setBanned(res.isBanned!);
        setConfirming(false);
        router.refresh();
      }
    });
  }

  if (banned) {
    return (
      <button onClick={doToggle} disabled={pending}
        style={{ background: "rgba(95,209,176,0.12)", color: "#5fd1b0", border: "1px solid rgba(95,209,176,0.35)", borderRadius: 9, padding: "8px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
        Разблокировать
      </button>
    );
  }

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} disabled={pending}
        style={{ background: "transparent", color: "#ef8f9b", border: "1px solid rgba(239,143,155,0.4)", borderRadius: 9, padding: "8px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
        Заблокировать
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button onClick={doToggle} disabled={pending}
        style={{ background: "#ef8f9b", color: "#2a0d12", border: "none", borderRadius: 9, padding: "8px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
        Точно?
      </button>
      <button onClick={() => setConfirming(false)} disabled={pending}
        style={{ background: "transparent", color: "#9a978f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, padding: "8px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
        Отмена
      </button>
    </div>
  );
}