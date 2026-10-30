"use client";

import { Deck } from "@/components/Deck";
import { torchSteps, type Card } from "@/lib/content";
import { useStore } from "@/lib/storage";

export default function TorchPage() {
  const { store } = useStore();
  const index = Math.min(store.cursor.torch ?? 0, torchSteps.length - 1);
  const lines = torchSteps.slice(0, index + 1).map((card) => {
    const status = store.attempts[card.id]?.status;
    if (status === "scored" || status === "peeked") return snippet(card);
    if (card === torchSteps[index]) return pending(card);
    return "";
  });
  return (
    <div className="flex flex-col gap-4">
      <pre className="overflow-x-auto rounded-3xl bg-[#3f2d28] p-4 text-sm leading-6 text-[#fff6ef]">
        <span className="text-[#f0c7b4]"># 你正在补的 fit.py</span>
        {"\n"}
        {lines.filter(Boolean).join("\n\n") || "# 从第一题开始，写对的行会留在这里"}
      </pre>
      <Deck
        cards={torchSteps}
        cursorKey="torch"
        intro="前 7 题直接调用 fit.train。这一页把那个函数拆开，让你自己写形状、网络、优化器和循环。写对一行，上面的函数就长一行。"
      />
    </div>
  );
}

function snippet(card: Card) {
  if (card.type === "code") return card.locked;
  return card.locked ?? "";
}

function pending(card: Card) {
  if (card.type === "code") return card.template.replace(/\{\{(\w+)\}\}/g, "____");
  return "# 这一题先选对或排对，写好的行会出现在这里";
}
