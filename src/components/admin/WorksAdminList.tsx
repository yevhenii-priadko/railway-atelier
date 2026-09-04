"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteWorkAction, reorderWorksAction } from "@/app/admin/actions";
import type { Work } from "@/lib/work-types";

export default function WorksAdminList({ works }: { works: Work[] }) {
  const [items, setItems] = useState(works);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);

    startTransition(async () => {
      await reorderWorksAction(next.map((w) => w.id));
      router.refresh();
    });
  }

  function handleDelete(work: Work) {
    if (!confirm(`Видалити «${work.translations.uk.title}»? Це незворотно.`)) return;
    const formData = new FormData();
    formData.set("id", work.id);
    startTransition(async () => {
      await deleteWorkAction(formData);
      setItems((prev) => prev.filter((w) => w.id !== work.id));
      router.refresh();
    });
  }

  if (items.length === 0) {
    return <p className="admin-empty">Робіт ще немає — натисніть «Додати роботу», щоб внести першу.</p>;
  }

  return (
    <div className="admin-list">
      {items.map((work, index) => (
        <div className="admin-card" key={work.id}>
          <div className="admin-card-order">
            <button
              type="button"
              className="admin-btn-icon"
              onClick={() => move(index, -1)}
              disabled={index === 0 || isPending}
              aria-label="Підняти вище"
              title="Підняти вище"
            >
              ↑
            </button>
            <button
              type="button"
              className="admin-btn-icon"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1 || isPending}
              aria-label="Опустити нижче"
              title="Опустити нижче"
            >
              ↓
            </button>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={work.photos[0]} alt="" className="admin-card-thumb" />

          <div className="admin-card-info">
            <div className="admin-card-title">{work.translations.uk.title}</div>
            <div className="admin-card-meta">
              {work.maker} · {work.article} · {work.scale}
            </div>
          </div>

          <div className="admin-card-actions">
            <Link href={`/admin/works/${work.id}/edit`} className="admin-btn admin-btn-secondary">
              Редагувати
            </Link>
            <button
              type="button"
              className="admin-btn-danger"
              onClick={() => handleDelete(work)}
              disabled={isPending}
            >
              Видалити
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
