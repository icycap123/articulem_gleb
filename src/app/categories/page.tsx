import Reveal from "@/components/Reveal";
import CategoryCard from "@/components/CategoryCard";
import { getCategoryCounts } from "@/lib/queries";
import { CATS, CAT_META } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();

  return (
    <div style={{ paddingTop: 48 }}>
      <Reveal style={{ marginBottom: 34 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Разделы</div>
        <h1 className="serif" style={{ fontWeight: 700, fontSize: 46, lineHeight: 1.04, margin: 0, color: "#f7f4ee" }}>Категории</h1>
        <p style={{ margin: "14px 0 0", fontSize: 16, color: "#9a978f", maxWidth: 520 }}>Выберите тему и погрузитесь в подборку лучших материалов.</p>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
        {Object.keys(CATS).map((name, i) => (
          <Reveal key={name} delay={i * 60}>
            <CategoryCard name={name} glyph={CAT_META[name].glyph} desc={CAT_META[name].desc} col={CATS[name]} count={counts[name] || 0} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
