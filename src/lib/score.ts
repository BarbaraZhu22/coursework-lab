import { allCards, chapters, rules, torchSteps, words } from "@/lib/content";
import type { Store } from "@/lib/storage";

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

export function norm(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "").replace(/[()（）]/g, "");
}

export function matches(value: string, accept: string[]) {
  const got = norm(value);
  return got.length > 0 && accept.some((item) => norm(item) === got);
}
