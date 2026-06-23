import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getPendingArticles } from "@/lib/queries";
import { catColor } from "@/lib/theme";
import ArticleModerationCard from "@/components/ArticleModerationCard";

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
          {pending.map((a) => (
            <ArticleModerationCard key={a.id} a={a} col={catColor(a.category)} />
          ))}
        </div>
      )}
    </div>
  );
}