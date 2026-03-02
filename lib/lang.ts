"use server";

import { cookies } from "next/headers";

export const LANG_COOKIE = "app_lang";

export async function getLanguage(): Promise<"en" | "ur"> {
  const cookieStore = await cookies();
  const lang = cookieStore.get(LANG_COOKIE)?.value;
  return lang === "ur" ? "ur" : "en";
}

export async function setLanguage(lang: "en" | "ur") {
  const cookieStore = await cookies();
  cookieStore.set(LANG_COOKIE, lang, { maxAge: 60 * 60 * 24 * 365, path: "/" });
}
