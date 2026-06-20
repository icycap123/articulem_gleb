import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getPendingArticles } from "@/lib/queries";
import { badge, avatar, thumb, thumbGlyph, catColor, formatDate } from "@/lib/theme";
import AdminActions from "@/components/AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/");

  const pending = await getPendingArticles();

  return (
    <div style={{ paddingTop: 44 }}>
      <div style={{ marginBottom: 30 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Модерация</div>
        <h1 className="serif" style={{ fontWeight: 700, fontSize: 44, lineHeight: 1.04, margin: 0, color: "#f7f4ee" }}>Очередь проверки</h1>
        <p style={{ margin: "12px 0 0", fontSize: 15, color: "#9a978f", maxWidth: 560 }}>
          Статьи ниже видны только их авторам. Одобрите — и материал появится в общей ленте; отклоните — автор увидит причину в своём профиле.
        </p>
      </div>

      {pending.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#79766f" }}>
          <div className="serif" style={{ fontSize: 30, color: "#5fd1b0", marginBottom: 10 }}>Очередь пуста</div>
          <div style={{ fontSize: 15 }}>Новых статей на проверку нет.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {pending.map((a) => {
            const col = catColor(a.category);
            return (
              <div key={a.id} style={{ display: "flex", gap: 22, alignItems: "flex-start", background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
                <div style={thumb(col, 90, 90)}><span style={thumbGlyph(col, 38)}>{a.glyph}</span></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span style={badge(col)}>{a.category}</span>
                    <span style={{ fontSize: 12.5, color: "#79766f" }}>{formatDate(a.createdAt)} · {a.readTime} мин</span>
                  </div>
                  <h3 className="serif" style={{ fontSize: 24, fontWeight: 600, color: "#f3f0e9", margin: "0 0 8px", lineHeight: 1.2 }}>{a.title}</h3>
                  <p style={{ fontSize: 14.5, color: "#9a978f", lineHeight: 1.6, margin: "0 0 14px" }}>{a.excerpt}</p>
                  <div style={{ fontSize: 14, color: "#b1aea6", lineHeight: 1.65, whiteSpace: "pre-wrap", maxHeight: 150, overflow: "hidden", maskImage: "linear-gradient(180deg,#000 70%,transparent)", WebkitMaskImage: "linear-gradient(180deg,#000 70%,transparent)" }}>
                    {a.body}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 11, marginTop: 16 }}>
                    <div style={avatar(a.author.color, 32, 11)}>{a.author.initials}</div>
                    <span style={{ fontSize: 13.5, color: "#d8d5cd", fontWeight: 600 }}>{a.author.name}</span>
                  </div>
                </div>
                <AdminActions articleId={a.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
