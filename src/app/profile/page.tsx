import { redirect } from "next/navigation";
import ProfileClient, { type ProfileArticle } from "@/components/ProfileClient";
import { getCurrentUser } from "@/lib/auth";
import { getProfileData, getFollowingList } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ searchParams }: { searchParams: { submitted?: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/profile");

  const { articles, totalLikes, comments, followers } = await getProfileData(user.id);
  const followingList = await getFollowingList(user.id);

  const likedRows = await prisma.like.findMany({
    where: { userId: user.id },
    orderBy: { id: "desc" },
    include: {
      article: {
        include: {
          author: { select: { name: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
    },
  });

  const toItem = (a: any): ProfileArticle => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    glyph: a.glyph,
    status: a.status,
    rejectReason: a.rejectReason ?? null,
    likes: a._count.likes,
    comments: a._count.comments,
    date: formatDate(a.createdAt),
  });

  const published = articles.filter((a) => a.status === "APPROVED").map(toItem);
  const review = articles.filter((a) => a.status !== "APPROVED").map(toItem);
  const liked: ProfileArticle[] = likedRows
    .filter((l) => l.article && l.article.status === "APPROVED")
    .map((l) => ({
      id: l.article.id,
      title: l.article.title,
      excerpt: l.article.excerpt,
      category: l.article.category,
      glyph: l.article.glyph,
      status: l.article.status,
      rejectReason: null,
      likes: l.article._count.likes,
      comments: l.article._count.comments,
      date: formatDate(l.article.createdAt),
      authorName: l.article.author.name,
    }));

  return (
    <ProfileClient
      name={user.name}
      username={user.username}
      initials={user.initials}
      color={user.color}
      bio={user.bio}
      roleTag={user.role_tag}
      stats={{ articles: published.length, followers, likes: totalLikes, comments }}
      published={published}
      review={review}
      liked={liked}
      following={followingList}
      submitted={searchParams.submitted === "1"}
    />
  );
}
