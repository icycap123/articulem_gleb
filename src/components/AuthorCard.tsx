"use client";

import Link from "next/link";
import { avatar, hex } from "@/lib/theme";
import FollowButton from "./FollowButton";
import BanUserButton from "./BanUserButton";

export default function AuthorCard({
  id,
  name,
  initials,
  color,
  bio,
  roleTag,
  articles,
  followers,
  following,
  isAuthed,
  isSelf,
  isAdminViewing,
  isBanned,
}: {
  id: string;
  name: string;
  initials: string;
  color: string;
  bio: string | null;
  roleTag: string | null;
  articles: number;
  followers: number;
  following: boolean;
  isAuthed: boolean;
  isSelf: boolean;
  isAdminViewing?: boolean;
  isBanned?: boolean;
}) {
  return (
    <div
      style={{ background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 26, transition: "border-color .3s ease, transform .35s ease, box-shadow .35s ease" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = hex(color, 0.4); e.currentTarget.style.boxShadow = `0 18px 50px -22px ${hex(color, 0.5)}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <Link href={`/authors/${id}`} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18, textDecoration: "none" }}>
        <div style={avatar(color, 60, 20)}>{initials}</div>
        <div style={{ flex: 1 }}>
          <div className="serif" style={{ fontSize: 21, fontWeight: 600, color: "#f3f0e9" }}>{name}</div>
          <div style={{ fontSize: 13, color: hex(color, 0.9), fontWeight: 500, marginTop: 2 }}>{roleTag || "Автор платформы"}</div>
        </div>
      </Link>
      <p style={{ fontSize: 14, color: "#9a978f", lineHeight: 1.55, margin: "0 0 20px", minHeight: 44 }}>{bio || "Автор платформы Articulem."}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div>
          <span className="serif" style={{ fontSize: 20, color: "#e6cfa0" }}>{articles}</span>
          <span style={{ fontSize: 12.5, color: "#79766f", marginLeft: 6 }}>статей</span>
        </div>
        <div>
          <span className="serif" style={{ fontSize: 20, color: "#e6cfa0" }}>{followers}</span>
          <span style={{ fontSize: 12.5, color: "#79766f", marginLeft: 6 }}>подписчиков</span>
        </div>
        {!isSelf && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            {isAdminViewing && <BanUserButton userId={id} initialBanned={!!isBanned} />}
            <FollowButton authorId={id} initialFollowing={following} isAuthed={isAuthed} color={color} />
          </div>
        )}
      </div>
      {isBanned && (
        <div style={{ marginTop: 14, fontSize: 12, color: "#ef8f9b", background: "rgba(239,143,155,0.08)", border: "1px solid rgba(239,143,155,0.2)", borderRadius: 8, padding: "6px 10px", display: "inline-block" }}>
          Заблокирован
        </div>
      )}
    </div>
  );
}
