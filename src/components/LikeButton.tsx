"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleLike } from "@/lib/actions";
import { hex } from "@/lib/theme";

export default function LikeButton({
  articleId,
  initialLikes,
  initialLiked,
  color,
  isAuthed,
  size = "sm",
}: {
  articleId: string;
  initialLikes: number;
  initialLiked: boolean;
  color: string;
  isAuthed: boolean;
  size?: "sm" | "lg";
}) {
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [pending, start] = useTransition();

  function onClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthed) {
      router.push("/login");
      return;
    }
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    start(async () => {
      await toggleLike(articleId);
    });
  }

  const lg = size === "lg";
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: lg ? 6 : 5,
    fontSize: lg ? 14 : 13,
    fontWeight: 600,
    padding: lg ? "9px 16px" : "5px 11px",
    borderRadius: lg ? 11 : 9,
    cursor: "pointer",
    border: `1px solid ${liked ? hex(color, lg ? 0.45 : 0.4) : "rgba(255,255,255,0.08)"}`,
    background: liked ? hex(color, lg ? 0.18 : 0.16) : "rgba(255,255,255,0.02)",
    color: liked ? color : lg ? "#cdcac2" : "#9a978f",
    transition: "all .2s ease",
    opacity: pending ? 0.85 : 1,
  };

  return (
    <button onClick={onClick} style={style} aria-pressed={liked}>
      ▲ {likes}
    </button>
  );
}
