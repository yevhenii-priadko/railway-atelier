import Link from "next/link";
import { requireAdminSession } from "@/lib/session";
import { getAllWorksForAdmin } from "@/lib/works";
import { logoutAction } from "./actions";
import WorksAdminList from "@/components/admin/WorksAdminList";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminSession();
  const works = await getAllWorksForAdmin();

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <h1 className="admin-title">Архів робіт</h1>
        <form action={logoutAction}>
          <button type="submit" className="admin-logout">
            Вийти
          </button>
        </form>
      </div>

      <Link href="/admin/works/new" className="admin-btn admin-add-link">
        + Додати роботу
      </Link>

      <WorksAdminList works={works} />
    </div>
  );
}
