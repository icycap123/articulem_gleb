import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  let data: any;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json({ error: "Неверный e-mail или пароль" }, { status: 401 });
  }
  if (user.isBanned) {
    return NextResponse.json({ error: "Этот аккаунт заблокирован" }, { status: 403 });
  }
  await createSession({ uid: user.id, role: user.role });
  return NextResponse.json({ ok: true, role: user.role });
}
