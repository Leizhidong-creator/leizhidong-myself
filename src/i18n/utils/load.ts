import { namespaces } from "../messages";

import type { MessagesNamespace } from "../messages/types";
import type { Locale } from "../types";

type Messages = Record<string, string>;

const valueCache = new Map<string, Messages>();
const inflight = new Map<string, Promise<Messages>>();

const makeKey = (ns: MessagesNamespace, locale: Locale) => `${ns}:${locale}`;

const pickModule = (ns: MessagesNamespace, locale: Locale) => namespaces[ns][`./namespaces/${ns}/${locale}.json`];

export const clearTranslationCache = () => {
  valueCache.clear();
  inflight.clear();
};

export const getCachedTranslations = (ns: MessagesNamespace, locale: Locale): Messages | null => {
  const key = makeKey(ns, locale);
  return valueCache.get(key) ?? null;
};

export const loadTranslations = async (ns: MessagesNamespace, locale: Locale): Promise<Messages | null> => {
  try {
    const key = makeKey(ns, locale);

    // 1) Value cache hit
    const cached = valueCache.get(key);
    if (cached) return cached;

    // 2) In-flight dedupe
    const pending = inflight.get(key);
    if (pending) return pending;

    // 3) Start new load
    const modLoader = pickModule(ns, locale);
    if (!modLoader) return null;

    const p = (async () => {
      try {
        const mod = await modLoader(); // dynamic import
        const data: Messages = (mod as any).default ?? mod;
        valueCache.set(key, data);
        return data;
      } finally {
        inflight.delete(key); // always clear in-flight slot
      }
    })();

    inflight.set(key, p);
    return p;
  } catch (error) {
    console.error(`Error loading translations for namespace ${ns} and locale ${locale}:`, error);
    return null;
  }
};

export const loadMultipleTranslations = async (
  namespacesList: MessagesNamespace[],
  locale: Locale,
): Promise<Record<string, string>> => {
  const results: Record<string, string> = {};

  await Promise.all(
    namespacesList.map(async (ns) => {
      const translations = await loadTranslations(ns, locale);
      if (translations) {
        Object.assign(results, translations);
      }
    }),
  );

  return results;
};
