import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { getWorksForPage, getTotalWorkPages } from '@/lib/works';
import GalleryGrid from './GalleryGrid';

export default async function Gallery({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  // Если Mongo недоступна (например, локальные проблемы с DNS/SRV — см.
  // mongoose.ts), не роняем всю страницу целиком, а показываем секцию
  // с пустой галереей. Заодно это убирает побочный краш Turbopack про
  // "'Gallery' cannot have a negative time stamp" — он появлялся именно
  // из-за того, что компонент падал раз за разом.
  let items: Awaited<ReturnType<typeof getWorksForPage>> = [];
  let totalPages = 0;
  try {
    [items, totalPages] = await Promise.all([
      getWorksForPage(1),
      getTotalWorkPages(),
    ]);
  } catch (err) {
    console.error('Gallery: не вдалося завантажити роботи з MongoDB', err);
  }

  return (
    <section className="gallery" id="work">
      <div className="gallery-header">
        <p className="section-label">{dict.work.label}</p>
        <h2 className="section-title">{dict.work.title}</h2>
      </div>
      {items.length > 0 ? (
        <GalleryGrid
          locale={locale}
          dict={dict}
          initialItems={items}
          totalPages={totalPages}
        />
      ) : (
        <p style={{ padding: '0 48px', color: 'var(--mid)' }}>
          Не вдалося завантажити роботи. Спробуйте оновити сторінку.
        </p>
      )}
    </section>
  );
}
