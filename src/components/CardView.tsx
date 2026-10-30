"use client";

import { useEffect, useState } from "react";
import type { Card } from "@/lib/content";
import { matches } from "@/lib/score";
import { emptyAttempt, readStore, useStore, type Attempt } from "@/lib/storage";

export function CardView({ card }: { card: Card }) {
  const { store, update } = useStore();
  const attempt = store.attempts[card.id] ?? emptyAttempt();
  const [cheer, setCheer] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote("");
    setCheer(false);
  }, [card.id]);

  useEffect(() => {
    if (!cheer) return;
    const timer = window.setTimeout(() => setCheer(false), 1600);
    return () => window.clearTimeout(timer);
  }, [cheer]);

  function patch(fn: (prev: Attempt) => Attempt | undefined) {
    update((draft) => {
      const prev = draft.attempts[card.id] ?? emptyAttempt();
      const next = fn(prev);
      if (next) draft.attempts[card.id] = next;
    });
  }

  function grade() {
    const current = readStore().attempts[card.id] ?? emptyAttempt();
    if (current.status === "scored") return;
    if (!isCorrect(card, current)) {
      setNote("还有空没对。可以再改，或者看答案。");
      return;
    }
    if (current.status === "peeked") {
      setNote("写对了。这题之前看过答案，不再加分。");
      return;
    }
    patch((prev) => ({ ...prev, status: "scored" }));
    setNote("对上了。");
    setCheer(true);
  }

  function peek() {
    const current = readStore().attempts[card.id] ?? emptyAttempt();
    if (current.status !== "scored") {
      patch((prev) => (prev.status === "scored" ? prev : { ...prev, status: "peeked" }));
    }
    setNote("");
  }

  const revealed = attempt.status === "scored" || attempt.status === "peeked";

  return (
    <article className="relative rounded-3xl bg-[var(--card)] p-5 ring-1 ring-[var(--line)]">
      {cheer ? <Cheer /> : null}
      <p className="text-base leading-7">{card.prompt}</p>
      <div className="mt-4">
        {card.type === "fill" ? (
          <input
            value={attempt.values.answer ?? ""}
            disabled={attempt.status === "scored"}
            onChange={(event) =>
              patch((prev) =>
                prev.status === "scored" ? prev : { ...prev, values: { ...prev.values, answer: event.target.value } },
              )
            }
            className="w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2"
            placeholder="写在这里"
          />
        ) : null}
        {card.type === "choice" ? (
          <div className="flex flex-col gap-2">
            {card.options.map((option, index) => {
              const selected = attempt.values.choice === String(index);
              return (
                <button
                  key={option}
                  type="button"
                  disabled={attempt.status === "scored"}
                  onClick={() =>
                    patch((prev) =>
                      prev.status === "scored"
                        ? prev
                        : { ...prev, values: { ...prev.values, choice: String(index) } },
                    )
                  }
                  className={`rounded-2xl px-3 py-2 text-left ring-1 ${
                    selected ? "bg-[#4a322c] text-white ring-[#4a322c]" : "bg-white ring-[var(--line)]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : null}
        {card.type === "order" ? (
          <OrderBoard
            card={card}
            order={attempt.order}
            locked={attempt.status === "scored"}
            onPush={(id) =>
              patch((prev) =>
                prev.status === "scored" || prev.order.includes(id) ? prev : { ...prev, order: [...prev.order, id] },
              )
            }
            onPop={() =>
              patch((prev) =>
                prev.status === "scored" ? prev : { ...prev, order: prev.order.slice(0, -1) },
              )
            }
          />
        ) : null}
        {card.type === "code" ? (
          <div className="flex flex-col gap-3">
            <pre className="overflow-x-auto rounded-2xl bg-[#3f2d28] p-4 text-sm leading-6 text-[#fff6ef]">
              {card.template.replace(/\{\{(\w+)\}\}/g, "____")}
            </pre>
            {card.blanks.map((blank) => (
              <label key={blank.id} className="block text-sm">
                <span className="mb-1 block text-[var(--muted)]">{blank.label}</span>
                <input
                  value={attempt.values[blank.id] ?? ""}
                  disabled={attempt.status === "scored"}
                  onChange={(event) =>
                    patch((prev) =>
                      prev.status === "scored"
                        ? prev
                        : { ...prev, values: { ...prev.values, [blank.id]: event.target.value } },
                    )
                  }
                  className="w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2 font-mono"
                  spellCheck={false}
                  autoCapitalize="off"
                />
              </label>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={grade}
          disabled={attempt.status === "scored"}
          className="rounded-full bg-[var(--coral)] px-4 py-2 text-white disabled:opacity-50"
        >
          对一下
        </button>
        <button type="button" onClick={peek} className="rounded-full bg-white px-4 py-2 ring-1 ring-[var(--line)]">
          看答案
        </button>
        {attempt.status === "scored" ? <span className="self-center text-sm text-[var(--leaf)]">这题计入对齐</span> : null}
        {attempt.status === "peeked" ? (
          <span className="self-center text-sm text-[var(--muted)]">看过答案，这一题不再加分</span>
        ) : null}
      </div>
      {note ? <p className="mt-3 text-sm text-[var(--muted)]">{note}</p> : null}
      {revealed ? (
        <div className="mt-4 rounded-2xl bg-white/80 p-3 text-sm leading-6">
          {card.type === "fill" ? <p className="mb-1 font-semibold">{card.canonical}</p> : null}
          {"locked" in card && card.locked ? (
            <pre className="mb-2 overflow-x-auto whitespace-pre-wrap font-mono text-[13px] text-[var(--leaf)]">{card.locked}</pre>
          ) : null}
          <p>{card.explain}</p>
        </div>
      ) : null}
    </article>
  );
}

function isCorrect(card: Card, attempt: Attempt) {
  if (card.type === "fill") return matches(attempt.values.answer ?? "", card.accept);
  if (card.type === "choice") return Number(attempt.values.choice) === card.answer;
  if (card.type === "order") {
    return attempt.order.length === card.answer.length && attempt.order.every((id, index) => id === card.answer[index]);
  }
  return card.blanks.every((blank) => matches(attempt.values[blank.id] ?? "", blank.accept));
}

function OrderBoard({
  card,
  order,
  locked,
  onPush,
  onPop,
}: {
  card: Extract<Card, { type: "order" }>;
  order: string[];
  locked: boolean;
  onPush: (id: string) => void;
  onPop: () => void;
}) {
  const byId = new Map(card.items.map((item) => [item.id, item.text]));
  return (
    <div className="flex flex-col gap-3">
      <ol className="min-h-24 rounded-2xl bg-white p-3 font-mono text-sm leading-6 ring-1 ring-[var(--line)]">
        {order.length === 0 ? <li className="text-[var(--muted)]">按正确顺序点下面的行</li> : null}
        {order.map((id, index) => (
          <li key={id}>
            {index + 1}. {byId.get(id)}
          </li>
        ))}
      </ol>
      <div className="flex flex-col gap-2">
        {card.items.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={locked || order.includes(item.id)}
            onClick={() => onPush(item.id)}
            className="rounded-2xl bg-white px-3 py-2 text-left font-mono text-sm ring-1 ring-[var(--line)] disabled:opacity-40"
          >
            {item.text}
          </button>
        ))}
      </div>
      <button type="button" onClick={onPop} disabled={locked || order.length === 0} className="self-start text-sm text-[var(--muted)]">
        撤销上一行
      </button>
    </div>
  );
}

function Cheer() {
  const bits = ["✦", "猫", "✦", "♪", "✦"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((bit, index) => (
        <span
          key={bit + index}
          className="cheer-bit text-2xl"
          style={{ left: `${12 + index * 16}%`, animationDuration: `${1.3 + index * 0.1}s` }}
        >
          {bit}
        </span>
      ))}
      <p className="cheer-banner rounded-full bg-white px-4 py-2 text-sm font-semibold shadow">对上了</p>
    </div>
  );
}
