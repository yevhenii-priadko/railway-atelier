import type { Locale } from "@/i18n/config";

export interface ProjectTranslation {
  title: string;
  type: string;
  worksList: string[];
  summary: string;
  photoAlts: [string, string, string];
}

export interface Project {
  /** URL slug, also used as the stable sort key for prev/next + pagination */
  slug: string;
  maker: string;
  article: string;
  scale: string;
  images: [string, string, string];
  translations: Record<Locale, ProjectTranslation>;
}

/**
 * A gallery slot with no real project behind it yet — no photos, no
 * detail page, not clickable. Exists purely so the pagination/gallery can
 * be built and tested against a realistic production-sized archive (see
 * PLACEHOLDER_COUNT below) instead of just the 6 finished conversions.
 * ProjectCard renders this as a distinct "coming soon" stub card.
 */
export interface PlaceholderSlot {
  slug: string;
  placeholder: true;
}

export type WorksItem = Project | PlaceholderSlot;

export function isPlaceholder(item: WorksItem): item is PlaceholderSlot {
  return "placeholder" in item;
}

// Single source of truth for the "Роботи" / Works portfolio, ported from
// the six static project pages in /projects/*.html. Order here defines
// both the gallery/pagination order and the prev/next chain on project
// detail pages — no more hand-wired links that can break (see BUG-001 /
// BUG-002 in bug-report-002.docx).
export const projects: Project[] = [
  {
    slug: "roco-br01",
    maker: "Roco",
    article: "72161",
    scale: "HO",
    images: ["/images/hero-engine.jpg", "/images/train-tiffany.jpg", "/images/engine-red-train.jpg"],
    translations: {
      uk: {
        title: "BR 01 — Паровоз DRG",
        type: "Конверсія приводу",
        worksList: [
          "Повне очищення механіки",
          "Обслуговування редуктора",
          "Встановлення безщіткового двигуна",
          "Механічна доробка кріплень",
          "Налаштування декодера",
          "Обкатка та фінальне тестування",
        ],
        summary: "Локомотив отримав тихий і плавний хід, зберігши автентичний вигляд моделі.",
        photoAlts: ["BR 01 — загальний вигляд", "BR 01 — деталі механіки", "BR 01 — після конверсії"],
      },
      en: {
        title: "BR 01 — DRG Steam Locomotive",
        type: "Drive Conversion",
        worksList: [
          "Full mechanics cleaning",
          "Gearbox servicing",
          "Brushless motor installation",
          "Mechanical mount rework",
          "Decoder configuration",
          "Running-in & final testing",
        ],
        summary: "The locomotive gained a quiet, smooth run while keeping the model's authentic appearance.",
        photoAlts: ["BR 01 — overview", "BR 01 — mechanical details", "BR 01 — after conversion"],
      },
      de: {
        title: "BR 01 – DRG-Dampflokomotive",
        type: "Antriebskonvertierung",
        worksList: [
          "Vollständige Reinigung der Mechanik",
          "Getriebewartung",
          "Einbau eines bürstenlosen Motors",
          "Mechanische Halterungsanpassung",
          "Dekoder-Konfiguration",
          "Einfahren & Endtest",
        ],
        summary: "Die Lokomotive erhielt einen leisen, geschmeidigen Lauf und behielt dabei ihr authentisches Erscheinungsbild.",
        photoAlts: ["BR 01 – Gesamtansicht", "BR 01 – mechanische Details", "BR 01 – nach der Konvertierung"],
      },
    },
  },
  {
    slug: "piko-v60",
    maker: "PIKO",
    article: "57753",
    scale: "HO",
    images: ["/images/train-tiffany.jpg", "/images/engine.jpg", "/images/train1.jpg"],
    translations: {
      uk: {
        title: "DB V 60 — Тепловоз",
        type: "DCC + Sound",
        worksList: [
          "Повне очищення механіки",
          "Обслуговування редуктора",
          "Встановлення безщіткового двигуна",
          "Встановлення DCC-декодера зі звуком",
          "Налаштування декодера",
          "Обкатка та фінальне тестування",
        ],
        summary: "Тепловоз отримав тихий хід і реалістичний звуковий супровід, зберігши автентичний вигляд моделі.",
        photoAlts: ["DB V 60 — загальний вигляд", "DB V 60 — деталі механіки", "DB V 60 — після конверсії"],
      },
      en: {
        title: "DB V 60 — Diesel Locomotive",
        type: "DCC + Sound",
        worksList: [
          "Full mechanics cleaning",
          "Gearbox servicing",
          "Brushless motor installation",
          "DCC sound decoder installation",
          "Decoder configuration",
          "Running-in & final testing",
        ],
        summary: "The diesel locomotive gained a quiet run and realistic sound, while keeping the model's authentic appearance.",
        photoAlts: ["DB V 60 — overview", "DB V 60 — mechanical details", "DB V 60 — after conversion"],
      },
      de: {
        title: "DB V 60 – Diesellokomotive",
        type: "DCC + Sound",
        worksList: [
          "Vollständige Reinigung der Mechanik",
          "Getriebewartung",
          "Einbau eines bürstenlosen Motors",
          "Einbau eines DCC-Sounddecoders",
          "Dekoder-Konfiguration",
          "Einfahren & Endtest",
        ],
        summary: "Die Diesellokomotive erhielt einen leisen Lauf und einen realistischen Sound und behielt dabei ihr authentisches Erscheinungsbild.",
        photoAlts: ["DB V 60 – Gesamtansicht", "DB V 60 – mechanische Details", "DB V 60 – nach der Konvertierung"],
      },
    },
  },
  {
    slug: "fleischmann-e40",
    maker: "Fleischmann",
    article: "4340",
    scale: "HO",
    images: ["/images/engine-red-train.jpg", "/images/engine.jpg", "/images/train1.jpg"],
    translations: {
      uk: {
        title: "DB E 40 — Електровоз",
        type: "Конверсія + LED",
        worksList: [
          "Повне очищення механіки",
          "Обслуговування редуктора",
          "Встановлення безщіткового двигуна",
          "Встановлення LED-освітлення",
          "Налаштування декодера",
          "Обкатка та фінальне тестування",
        ],
        summary: "Електровоз отримав плавний тихий хід і сучасне освітлення, зберігши автентичний вигляд моделі.",
        photoAlts: ["DB E 40 — загальний вигляд", "DB E 40 — деталі механіки", "DB E 40 — після конверсії"],
      },
      en: {
        title: "DB E 40 — Electric Locomotive",
        type: "Conversion + LED",
        worksList: [
          "Full mechanics cleaning",
          "Gearbox servicing",
          "Brushless motor installation",
          "LED lighting installation",
          "Decoder configuration",
          "Running-in & final testing",
        ],
        summary: "The electric locomotive gained a smooth, quiet run and modern lighting, while keeping the model's authentic appearance.",
        photoAlts: ["DB E 40 — overview", "DB E 40 — mechanical details", "DB E 40 — after conversion"],
      },
      de: {
        title: "DB E 40 – Elektrolokomotive",
        type: "Konvertierung + LED",
        worksList: [
          "Vollständige Reinigung der Mechanik",
          "Getriebewartung",
          "Einbau eines bürstenlosen Motors",
          "Einbau der LED-Beleuchtung",
          "Dekoder-Konfiguration",
          "Einfahren & Endtest",
        ],
        summary: "Die Elektrolokomotive erhielt einen ruhigen, leisen Lauf und eine moderne Beleuchtung und behielt dabei ihr authentisches Erscheinungsbild.",
        photoAlts: ["DB E 40 – Gesamtansicht", "DB E 40 – mechanische Details", "DB E 40 – nach der Konvertierung"],
      },
    },
  },
  {
    slug: "arnold-br50",
    maker: "Arnold",
    article: "HN9047",
    scale: "N",
    images: ["/images/train1.jpg", "/images/engine.jpg", "/images/hero-engine.jpg"],
    translations: {
      uk: {
        title: "BR 50 — Вантажний паровоз",
        type: "Конверсія приводу",
        worksList: [
          "Повне очищення механіки",
          "Обслуговування редуктора",
          "Встановлення безщіткового двигуна",
          "Механічна доробка кріплень",
          "Налаштування декодера",
          "Обкатка та фінальне тестування",
        ],
        summary: "Паровоз отримав рівний тихий хід навіть при роботі з важким составом, зберігши автентичний вигляд моделі.",
        photoAlts: ["BR 50 — загальний вигляд", "BR 50 — деталі механіки", "BR 50 — після конверсії"],
      },
      en: {
        title: "BR 50 — Freight Steam Locomotive",
        type: "Drive Conversion",
        worksList: [
          "Full mechanics cleaning",
          "Gearbox servicing",
          "Brushless motor installation",
          "Mechanical mount rework",
          "Decoder configuration",
          "Running-in & final testing",
        ],
        summary: "The steam locomotive gained a smooth, quiet run even when hauling heavy trains, while keeping the model's authentic appearance.",
        photoAlts: ["BR 50 — overview", "BR 50 — mechanical details", "BR 50 — after conversion"],
      },
      de: {
        title: "BR 50 – Güterzug-Dampflokomotive",
        type: "Antriebskonvertierung",
        worksList: [
          "Vollständige Reinigung der Mechanik",
          "Getriebewartung",
          "Einbau eines bürstenlosen Motors",
          "Mechanische Halterungsanpassung",
          "Dekoder-Konfiguration",
          "Einfahren & Endtest",
        ],
        summary: "Die Dampflokomotive erhielt einen gleichmäßigen, leisen Lauf, auch bei schweren Zügen, und behielt dabei ihr authentisches Erscheinungsbild.",
        photoAlts: ["BR 50 – Gesamtansicht", "BR 50 – mechanische Details", "BR 50 – nach der Konvertierung"],
      },
    },
  },
  {
    slug: "roco-br218",
    maker: "Roco",
    article: "73891",
    scale: "HO",
    images: ["/images/engine.jpg", "/images/hero-engine.jpg", "/images/train1.jpg"],
    translations: {
      uk: {
        title: "BR 218 — Тепловоз",
        type: "Механіка + DCC",
        worksList: [
          "Повне очищення механіки",
          "Обслуговування редуктора",
          "Встановлення безщіткового двигуна",
          "Встановлення та налаштування DCC-декодера",
          "Обкатка та фінальне тестування",
        ],
        summary: "Тепловоз отримав плавний тихий хід і стабільну роботу на всьому діапазоні швидкостей.",
        photoAlts: ["BR 218 — загальний вигляд", "BR 218 — деталі механіки", "BR 218 — після конверсії"],
      },
      en: {
        title: "BR 218 — Diesel Locomotive",
        type: "Mechanics + DCC",
        worksList: [
          "Full mechanics cleaning",
          "Gearbox servicing",
          "Brushless motor installation",
          "DCC decoder installation & configuration",
          "Running-in & final testing",
        ],
        summary: "The diesel locomotive gained a smooth, quiet run and stable performance across the entire speed range.",
        photoAlts: ["BR 218 — overview", "BR 218 — mechanical details", "BR 218 — after conversion"],
      },
      de: {
        title: "BR 218 – Diesellokomotive",
        type: "Mechanik + DCC",
        worksList: [
          "Vollständige Reinigung der Mechanik",
          "Getriebewartung",
          "Einbau eines bürstenlosen Motors",
          "Einbau und Konfiguration des DCC-Dekoders",
          "Einfahren & Endtest",
        ],
        summary: "Die Diesellokomotive erhielt einen ruhigen, leisen Lauf und eine stabile Leistung über den gesamten Geschwindigkeitsbereich.",
        photoAlts: ["BR 218 – Gesamtansicht", "BR 218 – mechanische Details", "BR 218 – nach der Konvertierung"],
      },
    },
  },
  {
    slug: "marklin-v200",
    maker: "Märklin",
    article: "3021",
    scale: "HO",
    images: ["/images/hero-engine.jpg", "/images/engine.jpg", "/images/train1.jpg"],
    translations: {
      uk: {
        title: "DB V 200 — Тепловоз",
        type: "Повна конверсія",
        worksList: [
          "Повне очищення механіки",
          "Обслуговування редуктора",
          "Встановлення безщіткового двигуна",
          "Механічна доробка кріплень",
          "Встановлення та налаштування DCC-декодера",
          "Обкатка та фінальне тестування",
        ],
        summary: "Тепловоз отримав повністю оновлений привід і плавний тихий хід, зберігши автентичний вигляд моделі.",
        photoAlts: ["DB V 200 — загальний вигляд", "DB V 200 — деталі механіки", "DB V 200 — після конверсії"],
      },
      en: {
        title: "DB V 200 — Diesel Locomotive",
        type: "Full Conversion",
        worksList: [
          "Full mechanics cleaning",
          "Gearbox servicing",
          "Brushless motor installation",
          "Mechanical mount rework",
          "DCC decoder installation & configuration",
          "Running-in & final testing",
        ],
        summary: "The diesel locomotive received a fully renewed drive and a smooth, quiet run, while keeping the model's authentic appearance.",
        photoAlts: ["DB V 200 — overview", "DB V 200 — mechanical details", "DB V 200 — after conversion"],
      },
      de: {
        title: "DB V 200 – Diesellokomotive",
        type: "Komplettkonvertierung",
        worksList: [
          "Vollständige Reinigung der Mechanik",
          "Getriebewartung",
          "Einbau eines bürstenlosen Motors",
          "Mechanische Halterungsanpassung",
          "Einbau und Konfiguration des DCC-Dekoders",
          "Einfahren & Endtest",
        ],
        summary: "Die Diesellokomotive erhielt einen komplett erneuerten Antrieb und einen ruhigen, leisen Lauf und behielt dabei ihr authentisches Erscheinungsbild.",
        photoAlts: ["DB V 200 – Gesamtansicht", "DB V 200 – mechanische Details", "DB V 200 – nach der Konvertierung"],
      },
    },
  },
];

export const PROJECTS_PER_PAGE = 4;

// Temporary placeholder slots, appended after the real projects, so the
// gallery/pagination can be exercised at a realistic ~production page
// count (32 items / 4 per page = 8 pages) instead of just today's 6 real
// conversions (2 pages) — see chat: too few pages to trust the pagination
// fixes, and the client wants to see how an 8-page archive actually
// behaves before more real work gets added. Delete this block (and
// PLACEHOLDER_COUNT) once there are enough real projects to not need it.
const PLACEHOLDER_COUNT = 26; // 6 real + 26 placeholder = 32 total
const placeholderSlots: PlaceholderSlot[] = Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
  slug: `placeholder-${i + 1}`,
  placeholder: true,
}));

function getAllWorksItems(): WorksItem[] {
  return [...projects, ...placeholderSlots];
}

export function getTotalWorkPages(): number {
  return Math.max(1, Math.ceil(getAllWorksItems().length / PROJECTS_PER_PAGE));
}

export function getProjectsForPage(page: number): WorksItem[] {
  const start = (page - 1) * PROJECTS_PER_PAGE;
  return getAllWorksItems().slice(start, start + PROJECTS_PER_PAGE);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectNeighbors(slug: string): { prev: Project | null; next: Project | null } {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}
