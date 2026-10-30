"use client";

import { Deck } from "@/components/Deck";
import { rules } from "@/lib/content";

export default function RulesPage() {
  return (
    <Deck
      cards={rules}
      cursorKey="rules"
      intro="这些是作业说明里已经写死的做法。图再漂亮，训练用错了数据、测试集看了两次，分会掉在这里。"
    />
  );
}
