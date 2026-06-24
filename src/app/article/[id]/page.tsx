import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getRelated, getLikedSet, isFollowing } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { badge, avatar, thumbGlyph, catColor, hex, formatDate, FONT_SERIF } from "@/lib/theme";
import LikeButton from "@/components/LikeButton";
import FollowButton from "@/components/FollowButton";
import { SaveButton, CommentForm } from "@/components/CommentInteractions";
import DeleteArticleButton from "@/components/DeleteArticleButton";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);
  if (!article) notFound();

  const session = await getSession();
  const col = catColor(article.category);
  const [liked, related, following] = await Promise.all([
    getLikedSet(session?.uid, [article.id]),
    getRelated(article.category, article.id),
    isFollowing(session?.uid, article.authorId),
  ]);

  const paragraphs = (article.body as string).split(/\n{2,}|\n/).map((s: string) => s.trim()).filter(Boolean);
  const P: React.CSSProperties = { fontSize: 18, lineHeight: 1.78, color: "#c6c3bb", margin: "0 0 22px" };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <div style={{ paddingTop: 34 }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#9a978f", fontSize: 14, fontWeight: 500, padding: "6px 0" }}>← Все статьи</Link>
      </div>

      <article style={{ marginTop: 14 }}>
        <div style={{ position: "relative", height: 260, borderRadius: 22, overflow: "hidden", background: `linear-gradient(150deg, ${hex(col, 0.4)}, ${hex(col, 0.08)} 65%, #0a0a0b)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="serif" style={{ fontSize: 130, color: hex(col, 0.55), textShadow: `0 8px 50px ${hex(col, 0.5)}` }}>{article.glyph}</span>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(10,10,11,0.85))" }} />
          <span style={{ position: "absolute", left: 26, bottom: 24, ...badge(col) }}>{article.category}</span>
        </div>

        <h1 className="serif" style={{ fontWeight: 700, fontSize: 44, lineHeight: 1.1, margin: "30px 0 18px", color: "#f7f4ee", letterSpacing: "-0.5px" }}>{article.title}</h1>

        <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={avatar(col, 42, 14)}>{article.author.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#e9e7e2" }}>{article.author.name}</div>
            <div style={{ fontSize: 13, color: "#79766f" }}>{formatDate(article.createdAt)} · {article.readTime} мин чтения</div>
          </div>
          {session?.role === "ADMIN" && <DeleteArticleButton articleId={article.id} redirectTo="/" />}
          <LikeButton articleId={article.id} initialLikes={article._count.likes} initialLiked={liked.has(article.id)} color={col} isAuthed={!!session} size="lg" />
          <SaveButton />
        </div>

        <div style={{ marginTop: 32 }}>
          {paragraphs.map((p: string, i: number) => (
            <p key={i} style={P}>{p}</p>
          ))}
        </div>

        {article.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 30, paddingTop: 26, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {(article.tags as string[]).map((t: string) => (
              <span key={t} style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#9a978f", padding: "6px 13px", borderRadius: 9, fontSize: 13 }}>#{t}</span>
            ))}
          </div>
        )}
      </article>

      <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 34, background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
        <div style={avatar(col, 56, 18)}>{article.author.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#f0ede6", marginBottom: 4 }}>{article.author.name}</div>
          <div style={{ fontSize: 13.5, color: "#9a978f", lineHeight: 1.5 }}>{article.author.bio || "Автор платформы Articulem."}</div>
        </div>
        {session?.uid !== article.authorId && (
          <FollowButton authorId={article.authorId} initialFollowing={following} isAuthed={!!session} color={col} big />
        )}
      </div>

      <div style={{ marginTop: 40 }}>
        <h3 className="serif" style={{ fontSize: 24, fontWeight: 600, margin: "0 0 22px", color: "#f0ede6" }}>
          Комментарии <span style={{ color: "#79766f", fontWeight: 400 }}>· {article.comments.length}</span>
        </h3>
        <CommentForm articleId={article.id} isAuthed={!!session} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {(article.comments as any[]).map((c: any) => (
            <div key={c.id} style={{ display: "flex", gap: 14 }}>
              <div style={avatar(c.author.color, 40, 13)}>{c.author.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#dcd9d1" }}>{c.author.name}</span>
                  <span style={{ fontSize: 12, color: "#6f6c65" }}>{formatDate(c.createdAt)}</span>
                </div>
                <p style={{ fontSize: 14.5, color: "#b1aea6", lineHeight: 1.6, margin: 0 }}>{c.text}</p>
              </div>
            </div>
          ))}
          {article.comments.length === 0 && (
            <div style={{ fontSize: 14.5, color: "#79766f" }}>Пока нет комментариев. Будьте первым.</div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h3 className="serif" style={{ fontSize: 24, fontWeight: 600, margin: "0 0 22px", color: "#f0ede6" }}>Похожие материалы</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {related.map((r) => {
              const rc = catColor(r.category);
              return (
                <Link key={r.id} href={`/article/${r.id}`} style={{ background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                  <div style={{ position: "relative", height: 96, background: `linear-gradient(150deg, ${hex(rc, 0.34)}, ${hex(rc, 0.06)} 72%, rgba(18,18,20,0.9))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: FONT_SERIF, fontSize: 42, color: hex(rc, 0.72) }}>{r.glyph}</span>
                  </div>
                  <div style={{ padding: "15px 16px" }}>
                    <span style={badge(rc)}>{r.category}</span>
                    <div className="serif" style={{ fontSize: 16, fontWeight: 600, color: "#eceae3", lineHeight: 1.25, marginTop: 9 }}>{r.title}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
