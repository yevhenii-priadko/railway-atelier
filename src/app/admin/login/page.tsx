import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/session";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminSession()) {
    redirect("/admin");
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box admin-panel">
        <h1>Railway Atelier · Адмінка</h1>
        <LoginForm />
      </div>
    </div>
  );
}
