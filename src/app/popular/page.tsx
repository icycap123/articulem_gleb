import PopularClient, { type PopItem } from "@/components/PopularClient";
import { getPopularArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PopularPage() {
  const articles = await getPopularArticles();
  const items: PopItem[] = articles.map((a) => ({
    id: a.id,
    title: a.title,
    author: a.author.name,
    category: a.category,
    likes: a._count.likes,
    comments: a._count.comments,
    glyph: a.glyph,
    ts: new Date(a.createdAt).getTime(),
  }));
  return <PopularClient items={items} />;
}
