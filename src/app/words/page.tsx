"use client";

import { Deck } from "@/components/Deck";
import { words } from "@/lib/content";

export default function WordsPage() {
  return (
    <Deck
      cards={words}
      cursorKey="words"
      intro="这些词会写进报告。填的时候用英文也行，用中文也行。每一题的解释都要求你说出模型拟合到了什么，而不是只丢一个单词。"
    />
  );
}
