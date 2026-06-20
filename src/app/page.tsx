import FeedClient, { type FeedCard } from "@/components/FeedClient";
import { getFeedArticles, getAuthorsWithStats, getLikedSet } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { formatDate } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: { searchParams: { cat?: string } }) {
  const session = await getSession();
  const [articles, authors] = await Promise.all([getFeedArticles(), getAuthorsWithStats()]);
  const liked = await getLikedSet(session?.uid, articles.map((a) => a.id));

  // featured = most-liked; rest go in the feed
  const sortedByLikes = [...articles].sort((a, b) => b._count.likes - a._count.likes);
  const featuredSrc = sortedByLikes[0];

  const cards: FeedCard[] = articles
    .filter((a) => a.id !== featuredSrc?.id)
    .map((a) => ({
      id: a.id,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      glyph: a.glyph,
      readTime: a.readTime,
      authorName: a.author.name,
      authorInitials: a.author.initials,
      date: formatDate(a.createdAt),
      likes: a._count.likes,
      comments: a._count.comments,
      liked: liked.has(a.id),
      ts: new Date(a.createdAt).getTime(),
    }));

  const featured = featuredSrc
    ? {
        id: featuredSrc.id,
        title: featuredSrc.title,
        excerpt: featuredSrc.excerpt,
        category: featuredSrc.category,
        glyph: featuredSrc.glyph,
        readTime: featuredSrc.readTime,
        authorName: featuredSrc.author.name,
        authorInitials: featuredSrc.author.initials,
        date: formatDate(featuredSrc.createdAt),
      }
    : null;

  const popularMini = sortedByLikes.slice(0, 5).map((p) => ({
    id: p.id,
    title: p.title,
    author: p.author.name,
    likes: p._count.likes,
  }));

  const authorsMini = authors.slice(0, 4).map((au) => ({
    id: au.id,
    name: au.name,
    initials: au.initials,
    role: au.role_tag || "Автор платформы",
    count: au.articles,
    color: au.color,
  }));

  const tagSet = new Set<string>();
  articles.forEach((a) => (a.tags as string[]).forEach((t: string) => tagSet.add(t)));
  const tags = Array.from(tagSet).slice(0, 12);

  return (
    <FeedClient
      cards={cards}
      featured={featured}
      popularMini={popularMini}
      authorsMini={authorsMini}
      tags={tags}
      stats={{ articles: articles.length, authors: authors.length }}
      isAuthed={!!session}
      initialCat={searchParams.cat && Object.prototype.hasOwnProperty.call({ "Технологии":1,"Наука":1,"Культура":1,"Дизайн":1,"Психология":1,"Путешествия":1,"Финансы":1 }, searchParams.cat) ? searchParams.cat : "Все"}
    />
  );
}
