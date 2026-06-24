import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthorProfile, isFollowing } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { badge, avatar, thumb, thumbGlyph, catColor, hex, formatDate } from "@/lib/theme";
import FollowButton from "@/components/FollowButton";
import BanUserButton from "@/components/BanUserButton";

export const dynamic = "force-dynamic";

export default async function AuthorPage({ params }: { params: { id: string } }) {
  const data = await getAuthorProfile(params.id);
  if (!data) notFound();
  const { user, articles, followersCount, totalLikes } = data;

  const session = await getSession();
  const following = await isFollowing(session?.uid, user.id);
  const isSelf = session?.uid === user.id;
  const isAdminViewing = session?.role === "ADMIN" && user.role !== "ADMIN";

  return (
    <div style={{ paddingTop: 40 }}>
      <Link href="/authors" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#9a978f", fontSize: 14, fontWeight: 500, padding: "6px 0", marginBottom: 14 }}>← Все авторы</Link>

      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", padding: "40px 36px", background: `linear-gradient(135deg, ${hex(user.color, 0.28)}, rgba(10,10,11,0.9) 70%)` }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.05), transparent 60%)" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
          <div style={avatar(user.color, 84, 28)}>{user.initials}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 className="serif" style={{ fontWeight: 700, fontSize: 38, margin: 0, color: "#f7f4ee" }}>{user.name}</h1>
            <div style={{ fontSize: 14.5, color: hex(user.color, 0.95), fontWeight: 500, marginTop: 4 }}>@{user.username} · {user.role_tag || "Автор платформы"}</div>
            <p style={{ fontSize: 14.5, color: "#b9b6ad", lineHeight: 1.55, margin: "12px 0 0", maxWidth: 540 }}>{user.bio || "Автор платформы Articulem."}</p>
          </div>
          {!isSelf && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {isAdminViewing && <BanUserButton userId={user.id} initialBanned={user.isBanned} />}
              <FollowButton authorId={user.id} initialFollowing={following} isAuthed={!!session} color={user.color} big />
            </div>
          )}
        </div>
        <div style={{ position: "relative", display: "flex", gap: 36, marginTop: 30 }}>
          {([["статей", articles.length], ["подписчиков", followersCount], ["лайков", totalLikes]] as const).map(([l, v]) => (
            <div key={l}>
              <div className="serif" style={{ fontSize: 28, color: "#e6cfa0" }}>{v}</div>
              <div style={{ fontSize: 12, color: "#9a978f", textTransform: "uppercase", letterSpacing: ".5px", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 34 }}>
        <h3 className="serif" style={{ fontSize: 22, fontWeight: 600, margin: "0 0 18px", color: "#f0ede6" }}>Статьи автора</h3>
        {articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", color: "#79766f" }}>Пока нет опубликованных статей.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {articles.map((a) => {
              const col = catColor(a.category);
              return (
                <Link key={a.id} href={`/article/${a.id}`} style={{ display: "flex", gap: 18, background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 18 }}>
                  <div style={thumb(col, 74, 74)}><span style={thumbGlyph(col, 30)}>{a.glyph}</span></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                      <span style={badge(col)}>{a.category}</span>
                      <span style={{ fontSize: 12, color: "#79766f" }}>{formatDate(a.createdAt)}</span>
                    </div>
                    <div className="serif" style={{ fontSize: 19, fontWeight: 600, color: "#f0ede6", lineHeight: 1.2, marginBottom: 5 }}>{a.title}</div>
                    <div style={{ fontSize: 13.5, color: "#9a978f", lineHeight: 1.5 }}>{a.excerpt}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, fontSize: 13, color: "#79766f" }}>
                    <span>▲ {a._count.likes}</span>
                    <span>💬 {a._count.comments}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}