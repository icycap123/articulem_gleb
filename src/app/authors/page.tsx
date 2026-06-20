import Reveal from "@/components/Reveal";
import AuthorCard from "@/components/AuthorCard";
import { getAuthorsWithStats, getFollowingSet } from "@/lib/queries";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AuthorsPage() {
  const session = await getSession();
  const authors = await getAuthorsWithStats();
  const followingSet = await getFollowingSet(session?.uid, authors.map((a) => a.id));

  return (
    <div style={{ paddingTop: 48 }}>
      <Reveal style={{ marginBottom: 34 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Сообщество</div>
        <h1 className="serif" style={{ fontWeight: 700, fontSize: 46, lineHeight: 1.04, margin: 0, color: "#f7f4ee" }}>Авторы</h1>
        <p style={{ margin: "14px 0 0", fontSize: 16, color: "#9a978f", maxWidth: 520 }}>Люди, которые наполняют Articulem смыслом. Подпишитесь, чтобы не пропускать их тексты.</p>
      </Reveal>

      {authors.length === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 20px", color: "#79766f" }}>
          <div className="serif" style={{ fontSize: 26, color: "#cda96a", marginBottom: 8 }}>Пока нет авторов</div>
          <div style={{ fontSize: 14.5 }}>Как только появятся одобренные статьи — их авторы появятся здесь.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
          {authors.map((a, i) => (
            <Reveal key={a.id} delay={i * 50}>
              <AuthorCard
                id={a.id}
                name={a.name}
                initials={a.initials}
                color={a.color}
                bio={a.bio}
                roleTag={a.role_tag}
                articles={a.articles}
                followers={a.followers}
                following={followingSet.has(a.id)}
                isAuthed={!!session}
                isSelf={session?.uid === a.id}
              />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
