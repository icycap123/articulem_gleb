import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type AuthorSeed = { name: string; initials: string; color: string; role_tag: string; bio: string; slug: string };

const AUTHORS: AuthorSeed[] = [
  { name: "Дина Орлова", initials: "ДО", color: "#ef8f9b", role_tag: "Психология · нейронаука", bio: "Исследует, как работает память и внимание. Автор колонки о тихих привычках.", slug: "dina" },
  { name: "Артём Власов", initials: "АВ", color: "#6ea8fe", role_tag: "Технологии · общество", bio: "Пишет о том, как технологии меняют поведение людей и институты.", slug: "artem" },
  { name: "Мария Лебедева", initials: "МЛ", color: "#c79be0", role_tag: "Культура · эссеистика", bio: "Эссеист. Темы — внимание, тишина и эстетика повседневности.", slug: "maria" },
  { name: "Игорь Зотов", initials: "ИЗ", color: "#5fd1b0", role_tag: "Наука · физика", bio: "Объясняет сложную физику простым языком. Любит большие вопросы.", slug: "igor" },
  { name: "Лена Краузе", initials: "ЛК", color: "#f0b46a", role_tag: "Дизайн · интерфейсы", bio: "Продуктовый дизайнер. Верит, что хороший интерфейс незаметен.", slug: "lena" },
  { name: "Сергей Дань", initials: "СД", color: "#cda96a", role_tag: "Финансы · экономика", bio: "Разбирает рынки без паники и хайпа. Сторонник скучных инвестиций.", slug: "sergey" },
  { name: "Павел Гром", initials: "ПГ", color: "#88cf9a", role_tag: "Путешествия · урбанистика", bio: "Ездит по городам и ищет, чему они учатся у природы.", slug: "pavel" },
  { name: "Ольга Вин", initials: "ОВ", color: "#f0b46a", role_tag: "Дизайн · типографика", bio: "Любит шрифты и верит, что у каждой буквы есть голос.", slug: "olga" },
];

type ArticleSeed = {
  title: string; excerpt: string; cat: string; author: string; date: string; read: number; glyph: string; tags: string[]; featured?: boolean;
};

const DATA: ArticleSeed[] = [
  { title: "Внимание — это новая валюта эпохи", excerpt: "Мы платим минутами и фокусом за каждый бесплатный сервис. Большое эссе о том, как вернуть себе право решать, куда смотреть.", cat: "Культура", author: "Мария Лебедева", date: "2026-04-10", read: 12, glyph: "❝", tags: ["внимание", "фокус", "эссе"], featured: true },
  { title: "Почему мы доверяем алгоритмам больше, чем себе", excerpt: "Рекомендательные системы тихо переписывают наши вкусы. Разбираемся, где заканчивается удобство и начинается потеря воли.", cat: "Технологии", author: "Артём Власов", date: "2026-04-09", read: 7, glyph: "⌁", tags: ["ИИ", "алгоритмы", "выбор"] },
  { title: "Тишина как новая роскошь", excerpt: "В мире, где внимание продаётся по миллисекундам, молчание становится самым дорогим товаром. Эссе о праве на паузу.", cat: "Культура", author: "Мария Лебедева", date: "2026-04-08", read: 6, glyph: "❝", tags: ["внимание", "эссе", "тишина"] },
  { title: "Квантовые компьютеры выходят из лабораторий", excerpt: "Первые коммерческие кубиты уже считают то, что классике не под силу. Что это значит для шифрования и медицины.", cat: "Наука", author: "Игорь Зотов", date: "2026-04-06", read: 9, glyph: "◈", tags: ["физика", "будущее", "технологии"] },
  { title: "Минимализм в интерфейсах: меньше, но честнее", excerpt: "Пустота — не отсутствие дизайна, а его высшая форма. Как убирать элементы, не теряя смысла.", cat: "Дизайн", author: "Лена Краузе", date: "2026-04-05", read: 5, glyph: "▢", tags: ["минимализм", "UX", "интерфейсы"] },
  { title: "Как мозг придумывает воспоминания", excerpt: "Память — не архив, а конструктор. Каждый раз вспоминая, мы переписываем прошлое. Нейробиология самообмана.", cat: "Психология", author: "Дина Орлова", date: "2026-04-03", read: 8, glyph: "✺", tags: ["память", "мозг", "сознание"] },
  { title: "Города, которые учатся у природы", excerpt: "Биомиметика в урбанистике: здания дышат, улицы охлаждаются сами. Репортаж из самых живых городов планеты.", cat: "Путешествия", author: "Павел Гром", date: "2026-04-02", read: 7, glyph: "❋", tags: ["урбанистика", "природа", "города"] },
  { title: "Тихая революция пассивных инвестиций", excerpt: "Индексные фонды забрали триллионы у активных управляющих. Почему ничегонеделание оказалось лучшей стратегией.", cat: "Финансы", author: "Сергей Дань", date: "2026-04-01", read: 6, glyph: "₿", tags: ["инвестиции", "фонды", "экономика"] },
  { title: "Шрифты, которые звучат", excerpt: "У каждой гарнитуры есть голос. Разбираем, как форма буквы управляет интонацией текста ещё до его прочтения.", cat: "Дизайн", author: "Ольга Вин", date: "2026-03-30", read: 5, glyph: "Ag", tags: ["типографика", "шрифты", "дизайн"] },
  { title: "Сон как главный навык XXI века", excerpt: "Не продуктивность, а восстановление определяет успех. Как культура выгорания проигрывает культуре отдыха.", cat: "Психология", author: "Дина Орлова", date: "2026-03-28", read: 6, glyph: "☾", tags: ["сон", "отдых", "привычки"] },
  { title: "Закат больших соцсетей", excerpt: "Пользователи уходят в маленькие комнаты и закрытые чаты. Большая площадь умирает — наступает эпоха камерности.", cat: "Технологии", author: "Артём Власов", date: "2026-03-26", read: 7, glyph: "◍", tags: ["соцсети", "общество", "интернет"] },
  { title: "Вкус как форма мышления", excerpt: "Почему то, что мы едим, формирует то, как мы думаем. Кулинария на стыке антропологии и нейронауки.", cat: "Культура", author: "Мария Лебедева", date: "2026-03-24", read: 5, glyph: "✦", tags: ["еда", "культура", "антропология"] },
  { title: "Энергия из воздуха: миф или прорыв", excerpt: "Установки, добывающие электричество из влажности атмосферы, прошли первые полевые испытания. Скепсис и надежда.", cat: "Наука", author: "Игорь Зотов", date: "2026-03-22", read: 8, glyph: "⚡", tags: ["энергия", "климат", "наука"] },
];

const PENDING_DEMO: ArticleSeed[] = [
  { title: "Что мы теряем, ускоряя всё", excerpt: "Скорость стала ценностью сама по себе. Но за каждую сэкономленную минуту мы платим вниманием и глубиной.", cat: "Культура", author: "Мария Лебедева", date: "2026-04-12", read: 6, glyph: "✦", tags: ["скорость", "внимание", "эссе"] },
  { title: "Карты внимания: как устроен фокус", excerpt: "Можно ли натренировать концентрацию как мышцу? Свежие данные нейронауки о том, как мы удерживаем фокус.", cat: "Психология", author: "Дина Орлова", date: "2026-04-11", read: 7, glyph: "✺", tags: ["фокус", "мозг", "привычки"] },
];

function bodyFor(a: ArticleSeed): string {
  return [
    a.excerpt,
    "Это сложнее, чем кажется на первый взгляд. За простым наблюдением скрывается целая система привычек, технологий и решений, которые мы принимаем не задумываясь. Стоит остановиться — и картина меняется.",
    "Где проходит граница",
    "Любой удобный инструмент незаметно становится привычкой, а привычка — частью среды. Мы перестаём замечать, как именно он влияет на наш выбор. Именно эта незаметность и есть главный эффект: то, что не вызывает сопротивления, формирует нас сильнее всего.",
    "«Мы становимся тем, чему уделяем внимание. И всё чаще решаем это не мы».",
    "Хорошая новость в том, что осознанность возвращает контроль. Достаточно задать себе простой вопрос: служит ли это мне — или я служу этому? Ответ редко бывает однозначным, но сама привычка спрашивать уже меняет поведение.",
    "Что с этим делать",
    "Не нужно отказываться от технологий или удобства. Нужно вернуть себе авторство решений: выбирать осознанно, ставить паузы, оставлять место тишине. Маленькие изменения в режиме внимания дают непропорционально большой эффект со временем.",
    "В конечном счёте речь идёт о свободе — не громкой и декларативной, а тихой и ежедневной. О праве самому решать, куда смотреть. И, может быть, именно это сегодня и есть настоящая роскошь.",
  ].join("\n\n");
}

const SAMPLE_COMMENTS = [
  "Очень точно подмечено, спасибо за текст.",
  "Не соглашусь с выводом, но аргументы сильные.",
  "Перечитал дважды — есть над чем подумать.",
  "Давно ждал такой материал на платформе.",
  "Хочется продолжения этой темы.",
];

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@articulem.app").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
  const authorPassword = "author12345";

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      email: adminEmail,
      username: "admin",
      name: "Администратор",
      password: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
      initials: "АД",
      color: "#cda96a",
      bio: "Модератор и хранитель ленты Articulem.",
      role_tag: "Модерация",
    },
  });

  // Authors
  const authorMap = new Map<string, string>(); // name -> id
  for (const a of AUTHORS) {
    const u = await prisma.user.upsert({
      where: { email: `${a.slug}@articulem.app` },
      update: {},
      create: {
        email: `${a.slug}@articulem.app`,
        username: a.slug,
        name: a.name,
        password: await bcrypt.hash(authorPassword, 10),
        role: "USER",
        initials: a.initials,
        color: a.color,
        bio: a.bio,
        role_tag: a.role_tag,
      },
    });
    authorMap.set(a.name, u.id);
  }

  const existingApproved = await prisma.article.count({ where: { status: "APPROVED" } });
  if (existingApproved > 0) {
    console.log("Статьи уже засеяны — пропускаю наполнение контентом.");
    console.log(`Готово. Админ: ${adminEmail} / ${adminPassword}`);
    return;
  }

  // Approved articles
  const createdIds: string[] = [];
  let featuredId = "";
  for (const a of DATA) {
    const published = new Date(a.date + "T10:00:00Z");
    const art = await prisma.article.create({
      data: {
        title: a.title,
        excerpt: a.excerpt,
        body: bodyFor(a),
        category: a.cat,
        tags: a.tags,
        glyph: a.glyph,
        readTime: a.read,
        status: "APPROVED",
        authorId: authorMap.get(a.author)!,
        createdAt: published,
        publishedAt: published,
      },
    });
    createdIds.push(art.id);
    if (a.featured) featuredId = art.id;
  }

  // Pending demo articles (so the admin queue is not empty on first run)
  for (const a of PENDING_DEMO) {
    const created = new Date(a.date + "T10:00:00Z");
    await prisma.article.create({
      data: {
        title: a.title,
        excerpt: a.excerpt,
        body: bodyFor(a),
        category: a.cat,
        tags: a.tags,
        glyph: a.glyph,
        readTime: a.read,
        status: "PENDING",
        authorId: authorMap.get(a.author)!,
        createdAt: created,
      },
    });
  }

  // Likes: everyone likes the featured; others get a spread of likes
  const pendingLikes: { uid: string; articleId: string }[] = [];
  const allUserIds = [admin.id, ...authorMap.values()];
  for (const uid of allUserIds) {
    if (featuredId) {
      await prisma.like.upsert({
        where: { userId_articleId: { userId: uid, articleId: featuredId } },
        update: {},
        create: { userId: uid, articleId: featuredId },
      });
    }
  }
  // spread likes deterministically
  createdIds.forEach((articleId, idx) => {
    // skip featured (already maxed)
    if (articleId === featuredId) return;
    const likeCount = ((createdIds.length - idx) % allUserIds.length);
    for (let j = 0; j < likeCount; j++) {
      const uid = allUserIds[(idx + j) % allUserIds.length];
      // fire-and-collect promises sequentially below
      pendingLikes.push({ uid, articleId });
    }
  });
  for (const l of pendingLikes) {
    await prisma.like.upsert({
      where: { userId_articleId: { userId: l.uid, articleId: l.articleId } },
      update: {},
      create: { userId: l.uid, articleId: l.articleId },
    });
  }

  // A few comments on the first several articles
  for (let i = 0; i < Math.min(6, createdIds.length); i++) {
    const articleId = createdIds[i];
    const n = 1 + (i % 3);
    for (let k = 0; k < n; k++) {
      const uid = allUserIds[(i + k + 1) % allUserIds.length];
      await prisma.comment.create({
        data: { articleId, authorId: uid, text: SAMPLE_COMMENTS[(i + k) % SAMPLE_COMMENTS.length] },
      });
    }
  }

  console.log("Сидирование завершено.");
  console.log(`Статей одобрено: ${createdIds.length}, на проверке: ${PENDING_DEMO.length}`);
  console.log(`Админ: ${adminEmail} / ${adminPassword}`);
  console.log(`Демо-авторы: <slug>@articulem.app / ${authorPassword} (например maria@articulem.app)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
