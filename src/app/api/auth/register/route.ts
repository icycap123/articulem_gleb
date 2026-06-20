import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { initialsOf, colorFor } from "@/lib/theme";

export async function POST(req: Request) {
  let data: any;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");
  let username = String(data.username || "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "");

  if (name.length < 2) return NextResponse.json({ error: "Укажите имя" }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return NextResponse.json({ error: "Укажите корректный e-mail" }, { status: 400 });
  if (password.length < 6)
    return NextResponse.json({ error: "Пароль должен быть не короче 6 символов" }, { status: 400 });

  if (!username) username = "user" + Math.random().toString(36).slice(2, 7);

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) return NextResponse.json({ error: "Такой e-mail уже зарегистрирован" }, { status: 409 });

  // ensure unique username
  let candidate = username;
  for (let i = 0; i < 5; i++) {
    const taken = await prisma.user.findUnique({ where: { username: candidate } });
    if (!taken) break;
    candidate = username + Math.floor(Math.random() * 1000);
  }

  // The user record is auto-filled on registration.
  const user = await prisma.user.create({
    data: {
      name,
      email,
      username: candidate,
      password: await hashPassword(password),
      initials: initialsOf(name) || name.slice(0, 2).toUpperCase(),
      color: colorFor(email),
      bio: "Новый автор платформы Articulem.",
      role_tag: "Читатель · автор",
      role: "USER",
    },
  });

  await createSession({ uid: user.id, role: user.role });
  return NextResponse.json({ ok: true, username: user.username });
}
