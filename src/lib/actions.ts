"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { getCurrentUser } from "./auth";
import { CAT_META, CATEGORY_LIST } from "./theme";

function estimateReadTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 180));
}

export async function createArticle(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/create");

  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const tagsRaw = String(formData.get("tags") || "");

  if (!title || !body || !CATEGORY_LIST.includes(category)) {
    return { ok: false, error: "Заполните заголовок, текст и категорию." };
  }

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 8);

  await prisma.article.create({
    data: {
      title,
      excerpt: excerpt || body.slice(0, 160),
      body,
      category,
      tags,
      glyph: CAT_META[category]?.glyph || "✦",
      readTime: estimateReadTime(body),
      status: "PENDING",
      authorId: user.id,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/admin");
  redirect("/profile?submitted=1");
}

export async function toggleLike(articleId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "AUTH" };

  const existing = await prisma.like.findUnique({
    where: { userId_articleId: { userId: user.id, articleId } },
  });
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { userId: user.id, articleId } });
  }
  revalidatePath(`/article/${articleId}`);
  revalidatePath("/");
  revalidatePath("/popular");
  return { ok: true, liked: !existing };
}

export async function addComment(articleId: string, text: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "AUTH" };
  const t = text.trim();
  if (!t) return { ok: false, error: "EMPTY" };
  await prisma.comment.create({ data: { text: t, articleId, authorId: user.id } });
  revalidatePath(`/article/${articleId}`);
  return { ok: true };
}

export async function toggleFollow(authorId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "AUTH" };
  if (user.id === authorId) return { ok: false, error: "SELF" };

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: user.id, followingId: authorId } },
  });
  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({ data: { followerId: user.id, followingId: authorId } });
  }
  revalidatePath("/authors");
  revalidatePath(`/article`);
  return { ok: true, following: !existing };
}

export async function moderateArticle(articleId: string, action: "APPROVE" | "REJECT", reason?: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { ok: false, error: "FORBIDDEN" };

  if (action === "APPROVE") {
    await prisma.article.update({
      where: { id: articleId },
      data: { status: "APPROVED", publishedAt: new Date(), rejectReason: null },
    });
  } else {
    await prisma.article.update({
      where: { id: articleId },
      data: { status: "REJECTED", rejectReason: reason || "Отклонено модератором" },
    });
  }
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteArticle(articleId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { ok: false, error: "FORBIDDEN" };

  await prisma.article.delete({ where: { id: articleId } });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/popular");
  return { ok: true };
}

export async function toggleBanUser(userId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") return { ok: false, error: "FORBIDDEN" };
  if (admin.id === userId) return { ok: false, error: "SELF" };

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return { ok: false, error: "NOT_FOUND" };
  if (target.role === "ADMIN") return { ok: false, error: "CANT_BAN_ADMIN" };

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isBanned: !target.isBanned },
  });

  revalidatePath("/authors");
  revalidatePath(`/authors/${userId}`);
  revalidatePath("/admin");
  return { ok: true, isBanned: updated.isBanned };
}