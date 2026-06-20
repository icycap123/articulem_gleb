"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFollow } from "@/lib/actions";
import { hex } from "@/lib/theme";

export default function FollowButton({
  authorId,
  initialFollowing,
  isAuthed,
  color,
  big = false,
}: {
  authorId: string;
  initialFollowing: boolean;
  isAuthed: boolean;
  color: string;
  big?: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, start] = useTransition();

  function onClick() {
    if (!isAuthed) {
      router.push("/login");
      return;
    }
    const next = !following;
    setFollowing(next);
    start(async () => {
      await toggleFollow(authorId);
    });
  }

  const style: React.CSSProperties = big
    ? {
        border: `1px solid ${following ? "rgba(255,255,255,0.14)" : "rgba(205,169,106,0.5)"}`,
        background: following ? "transparent" : "#cda96a",
        color: following ? "#b9b6ad" : "#1a1408",
        borderRadius: 11,
        padding: "10px 20px",
        fontSize: 13.5,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all .25s ease",
        whiteSpace: "nowrap",
        opacity: pending ? 0.85 : 1,
      }
    : {
        marginLeft: "auto",
        border: `1px solid ${following ? "rgba(255,255,255,0.14)" : hex(color, 0.5)}`,
        background: following ? "transparent" : hex(color, 0.16),
        color: following ? "#9a978f" : color,
        borderRadius: 10,
        padding: "7px 16px",
        fontSize: 12.5,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all .25s ease",
        whiteSpace: "nowrap",
        opacity: pending ? 0.85 : 1,
      };

  return (
    <button onClick={onClick} style={style}>
      {following ? (big ? "Вы подписаны" : "Подписан") : "Подписаться"}
    </button>
  );
}
