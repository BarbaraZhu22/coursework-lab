"use client";

import { CardView } from "@/components/CardView";
import { chapters } from "@/lib/content";
import { useStore } from "@/lib/storage";

export default function PathPage() {
  const { store, ready, update } = useStore();
  const index = Math.min(store.cursor.path ?? 0, chapters.length - 1);
  const chapter = chapters[index];

  function go(next: number) {
    update((draft) => {
      draft.cursor.path = Math.max(0, Math.min(chapters.length - 1, next));
    });
  }

  if (!ready) return <p className="text-sm text-[var(--muted)]">在把八题翻开…</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {chapters.map((item, itemIndex) => {
          const done = store.attempts[item.check.id]?.status === "scored";
          const active = itemIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => go(itemIndex)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                active ? "bg-[#4a322c] text-white" : "bg-white text-[var(--ink)] ring-1 ring-[var(--line)]"
              }`}
            >
              {item.n}
              {done ? " · 齐" : ""}
            </button>
          );
        })}
      </div>
      <article className="rounded-3xl bg-[var(--card)] p-5 ring-1 ring-[var(--line)]">
        <p className="text-sm text-[var(--muted)]">
          第 {chapter.n} 题 · {chapter.marks}
        </p>
        <h1 className="mt-1 text-xl font-semibold">{chapter.title}</h1>
        <p className="mt-3 leading-7">{chapter.why}</p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6">
          {chapter.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {chapter.code ? (
          <pre className="mt-3 overflow-x-auto rounded-2xl bg-[#3f2d28] p-4 text-sm leading-6 text-[#fff6ef]">{chapter.code}</pre>
        ) : null}
        <p className="mt-3 text-sm leading-6">
          <span className="font-semibold">不要做。 </span>
          {chapter.avoid}
        </p>
        <p className="mt-2 text-sm leading-6">
          <span className="font-semibold">报告里写清。 </span>
          {chapter.write}
        </p>
      </article>
      <CardView key={chapter.check.id} card={chapter.check} />
      <div className="flex justify-between">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="rounded-full px-4 py-2 disabled:opacity-40">
          上一题
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === chapters.length - 1}
          className="rounded-full bg-[#4a322c] px-4 py-2 text-white disabled:opacity-40"
        >
          下一题
        </button>
      </div>
    </div>
  );
}
