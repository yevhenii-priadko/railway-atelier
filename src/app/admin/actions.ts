"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE_NAME,
  checkPassword,
  createSessionToken,
  requireAdminForAction,
} from "@/lib/session";
import { createWork, deleteWork, generateUniqueSlug, getWorkById, reorderWorks, updateWork } from "@/lib/works";
import { parseWorkFields, parsePhotos } from "@/lib/work-form";

export interface ActionState {
  error?: string;
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");

  let ok: boolean;
  try {
    ok = checkPassword(password);
  } catch (e) {
    return { error: (e as Error).message };
  }
  if (!ok) {
    return { error: "Невірний пароль." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}

function revalidatePublicPages() {
  // Public works pages are rendered dynamically (no cache to bust in
  // practice), but this is cheap insurance in case that ever changes.
  revalidatePath("/[locale]", "layout");
}

export async function createWorkAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminForAction();

  try {
    const fields = parseWorkFields(formData);
    const photos = await parsePhotos(formData, null);
    const slug = await generateUniqueSlug(`${fields.maker}-${fields.article}`);
    await createWork({ slug, ...fields, photos });
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/admin");
  revalidatePublicPages();
  redirect("/admin");
}

export async function updateWorkAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminForAction();

  const id = String(formData.get("workId") ?? "");
  try {
    const existing = await getWorkById(id);
    if (!existing) throw new Error("Роботу не знайдено.");

    const fields = parseWorkFields(formData);
    const photos = await parsePhotos(formData, existing.photos);
    await updateWork(id, { slug: existing.slug, ...fields, photos });
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/admin");
  revalidatePublicPages();
  redirect("/admin");
}

export async function deleteWorkAction(formData: FormData): Promise<void> {
  await requireAdminForAction();
  const id = String(formData.get("id") ?? "");
  await deleteWork(id);
  revalidatePath("/admin");
  revalidatePublicPages();
}

export async function reorderWorksAction(orderedIds: string[]): Promise<void> {
  await requireAdminForAction();
  await reorderWorks(orderedIds);
  revalidatePath("/admin");
  revalidatePublicPages();
}
