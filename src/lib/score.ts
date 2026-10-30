import { allCards, chapters, rules, torchSteps, words } from "@/lib/content";
import type { CursorKey, Store } from "@/lib/storage";

const known = new Set(allCards.map((card) => card.id));

export const totals = {
  words: words.length,
  rules: rules.length,
  torch: torchSteps.length,
  path: chapters.length,
  all: allCards.length,
};

function count(store: Store, ids: string[]) {
  return ids.filter((id) => store.attempts[id]?.status === "scored").length;
}

export function scored(store: Store) {
  return Object.entries(store.attempts).filter(([id, attempt]) => known.has(id) && attempt.status === "scored")
    .length;
}

export function sectionScored(store: Store) {
  return {
    words: count(store, words.map((card) => card.id)),
    rules: count(store, rules.map((card) => card.id)),
    torch: count(store, torchSteps.map((card) => card.id)),
    path: count(store, chapters.map((chapter) => chapter.check.id)),
  };
}

export function sectionIds(key: CursorKey) {
  if (key === "words") return words.map((card) => card.id);
  if (key === "rules") return rules.map((card) => card.id);
  if (key === "torch") return torchSteps.map((card) => card.id);
  return chapters.map((chapter) => chapter.check.id);
}

export function sectionHasRecord(store: Store, key: CursorKey) {
  return sectionIds(key).some((id) => store.attempts[id]);
}

export function withoutSection(store: Store, key: CursorKey): Store {
  const drop = new Set(sectionIds(key));
  const attempts: Store["attempts"] = {};
  for (const [id, attempt] of Object.entries(store.attempts)) {
    if (!drop.has(id)) attempts[id] = attempt;
  }
  return { attempts, cursor: { ...store.cursor, [key]: 0 } };
}

export function norm(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "").replace(/[()（）]/g, "");
}

export function matches(value: string, accept: string[]) {
  const got = norm(value);
  return got.length > 0 && accept.some((item) => norm(item) === got);
}
