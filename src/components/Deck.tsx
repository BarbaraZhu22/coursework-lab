"use client";

import type { Card } from "@/lib/content";
import { CardView } from "@/components/CardView";
import { withoutSection } from "@/lib/score";
import { readStore, useStore, writeStore, type CursorKey } from "@/lib/storage";

export function Deck({
  cards,
  cursorKey,
  intro,
}: {
  cards: Card[];
  cursorKey: CursorKey;
  intro?: string;
}) {
  const { store, ready, update } = useStore();
  const index = Math.min(store.cursor[cursorKey] ?? 0, cards.length - 1);
  const card = cards[index];

  function go(next: number) {
    const clamped = Math.max(0, Math.min(cards.length - 1, next));
    update((draft) => {
      draft.cursor[cursorKey] = clamped;
    });
  }

  if (!ready || !card) return <p className="text-sm text-[var(--muted)]">在把题目翻开…</p>;

  return (
    <div className="flex flex-col gap-4">
      {intro ? <p className="text-sm leading-6 text-[var(--muted)]">{intro}</p> : null}
      <div className="flex items-center justify-between text-sm text-[var(--muted)]">
        <span>
          {index + 1} / {cards.length}
        </span>
        <span>{cards.filter((item) => store.attempts[item.id]?.status === "scored").length} 题已对齐</span>
      </div>
      <CardView key={card.id} card={card} />
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="text-sm text-[var(--muted)] underline disabled:no-underline disabled:opacity-40"
          disabled={cards.every((item) => !store.attempts[item.id])}
          onClick={() => writeStore(withoutSection(readStore(), cursorKey))}
        >
          只清空这一部分
        </button>
        <span className="flex gap-2">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="rounded-full px-4 py-2 disabled:opacity-40">
          上一题
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === cards.length - 1}
          className="rounded-full bg-[#4a322c] px-4 py-2 text-white disabled:opacity-40"
        >
          下一题
        </button>
        </span>
      </div>
    </div>
  );
}
