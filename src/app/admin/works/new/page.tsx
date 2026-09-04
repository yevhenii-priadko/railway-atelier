import Link from "next/link";
import { requireAdminSession } from "@/lib/session";
import WorkForm from "@/components/admin/WorkForm";

export const dynamic = "force-dynamic";

export default async function NewWorkPage() {
  await requireAdminSession();

  return (
    <div className="admin-shell">
      <Link href="/admin" className="admin-back-link">
        ← До списку робіт
      </Link>
      <h1 className="admin-title" style={{ marginBottom: 20 }}>
        Додати роботу
      </h1>
      <WorkForm mode="create" />
    </div>
  );
}
