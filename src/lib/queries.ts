import "server-only";
import { prisma } from "./prisma";

const articleSelect = {
  id: true,
  title: true,
  excerpt: true,
  category: true,
  glyph: true,
  readTime: true,
  tags: true,
  createdAt: true,
  author: { select: { id: true, name: true, initials: true, color: true } },
  _count: { select: { likes: true, comments: true } },
} as const;

export async function getFeedArticles() {
  return prisma.article.findMany({
    where: { status: "APPROVED" },
    select: articleSelect,
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPopularArticles() {
  const list = await prisma.article.findMany({
    where: { status: "APPROVED" },
    select: articleSelect,
  });
  return list.sort((a, b) => b._count.likes - a._count.likes);
}

export async function getArticle(id: string) {
  return prisma.article.findFirst({
    where: { id, status: "APPROVED" },
    include: {
      author: { select: { id: true, name: true, initials: true, color: true, bio: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true, initials: true, color: true } } },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

export async function getRelated(category: string, excludeId: string) {
  let related = await prisma.article.findMany({
    where: { status: "APPROVED", category, id: { not: excludeId } },
    select: articleSelect,
    take: 3,
  });
  if (related.length < 3) {
    const more = await prisma.article.findMany({
      where: { status: "APPROVED", id: { not: excludeId } },
      select: articleSelect,
      take: 3 - related.length,
    });
    related = [...related, ...more.filter((m) => !related.some((r) => r.id === m.id))].slice(0, 3);
  }
  return related;
}

export async function getCategoryCounts() {
  const grouped = await prisma.article.groupBy({
    by: ["category"],
    where: { status: "APPROVED" },
    _count: { _all: true },
  });
  const map: Record<string, number> = {};
  grouped.forEach((g) => (map[g.category] = g._count._all));
  return map;
}

export async function getAuthorsWithStats() {
  const [users, grouped] = await Promise.all([
    prisma.user.findMany({
      include: { _count: { select: { followers: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.article.groupBy({
      by: ["authorId"],
      where: { status: "APPROVED" },
      _count: { _all: true },
    }),
  ]);
  const approvedCount: Record<string, number> = {};
  grouped.forEach((g) => (approvedCount[g.authorId] = g._count._all));

  return users
    .map((u) => ({
      id: u.id,
      name: u.name,
      initials: u.initials,
      color: u.color,
      bio: u.bio,
      role_tag: u.role_tag,
      articles: approvedCount[u.id] || 0,
      followers: u._count.followers,
      isBanned: u.isBanned,
      role: u.role,
    }))
    .filter((u) => u.articles > 0)
    .sort((a, b) => b.articles - a.articles);
}

export async function getLikedSet(userId: string | undefined, articleIds: string[]) {
  if (!userId || articleIds.length === 0) return new Set<string>();
  const likes = await prisma.like.findMany({
    where: { userId, articleId: { in: articleIds } },
    select: { articleId: true },
  });
  return new Set(likes.map((l) => l.articleId));
}

export async function isFollowing(userId: string | undefined, authorId: string) {
  if (!userId) return false;
  const f = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: userId, followingId: authorId } },
  });
  return !!f;
}

export async function getFollowingSet(userId: string | undefined, authorIds: string[]) {
  if (!userId || authorIds.length === 0) return new Set<string>();
  const fs = await prisma.follow.findMany({
    where: { followerId: userId, followingId: { in: authorIds } },
    select: { followingId: true },
  });
  return new Set(fs.map((f) => f.followingId));
}

export async function getProfileData(userId: string) {
  const [user, articles, totalLikes, comments] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.article.findMany({
      where: { authorId: userId },
      include: { _count: { select: { likes: true, comments: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.like.count({ where: { article: { authorId: userId } } }),
    prisma.comment.count({ where: { article: { authorId: userId } } }),
  ]);
  const followers = await prisma.follow.count({ where: { followingId: userId } });
  return { user, articles, totalLikes, comments, followers };
}

export async function getPendingArticles() {
  return prisma.article.findMany({
    where: { status: "PENDING" },
    include: { author: { select: { name: true, initials: true, color: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getAuthorProfile(authorId: string) {
  const user = await prisma.user.findUnique({ where: { id: authorId } });
  if (!user) return null;

  const [articles, followersCount, totalLikes] = await Promise.all([
    prisma.article.findMany({
      where: { authorId, status: "APPROVED" },
      include: { _count: { select: { likes: true, comments: true } } },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.follow.count({ where: { followingId: authorId } }),
    prisma.like.count({ where: { article: { authorId } } }),
  ]);

  return { user, articles, followersCount, totalLikes };
}

export async function getFollowingList(userId: string) {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        include: { _count: { select: { followers: true } } },
      },
    },
    orderBy: { id: "desc" },
  });
  return follows.map((f) => ({
    id: f.following.id,
    name: f.following.name,
    initials: f.following.initials,
    color: f.following.color,
    bio: f.following.bio,
    role_tag: f.following.role_tag,
    followers: f.following._count.followers,
  }));
}