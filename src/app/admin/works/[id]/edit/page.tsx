import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/session";
import { getWorkById } from "@/lib/works";
import WorkForm from "@/components/admin/WorkForm";

export const dynamic = "force-dynamic";

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const work = await getWorkById(id);
  if (!work) notFound();

  return (
    <div className="admin-shell">
      <Link href="/admin" className="admin-back-link">
        ← До списку робіт
      </Link>
      <h1 className="admin-title" style={{ marginBottom: 20 }}>
        Редагувати роботу
      </h1>
      <WorkForm mode="edit" work={work} />
    </div>
  );
}
