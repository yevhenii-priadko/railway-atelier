"use server";

import { getWorksForPage } from "@/lib/works";
import type { Work } from "@/lib/work-types";

/**
 * Lets the homepage gallery page through the works archive in place
 * instead of navigating to a separate page — Anton asked for this after
 * trying /admin for a bit; jumping to a dedicated archive page just to
 * flip pages felt like an unnecessary extra stop. This is the same public,
 * read-only data the homepage already fetches for page 1, so no session
 * check is needed here.
 */
export async function getWorksPageAction(page: number): Promise<Work[]> {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  return getWorksForPage(safePage);
}
