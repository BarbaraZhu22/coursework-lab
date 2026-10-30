"use client";

import Link from "next/link";
import { Cat, moodFor } from "@/components/Cat";
import { scored, sectionHasRecord, sectionScored, totals, withoutSection } from "@/lib/score";
import { readStore, useStore, writeStore, type CursorKey } from "@/lib/storage";

const lanes = [
  { href: "/words", key: "words" as const, title: "认词", text: "欠拟合、验证集、噪声下限。先能用作业里的词说出拟合到了什么。" },
  { href: "/rules", key: "rules" as const, title: "规矩", text: "30/30/60、测试集只看一次、第 6 题之前不看真实函数。这些是丢分点。" },
  { href: "/torch", key: "torch" as const, title: "手写 PyTorch", text: "把 fit.py 的形状、网络、Adam、四行循环自己填出来。不写一遍，后面改 ReLU 会发虚。" },
  { href: "/path", key: "path" as const, title: "八题", text: "每一题为什么做、调用哪几个参数、报告里要写清什么。最好的 H 仍以你的图为准。" },
];

export default function HomePage() {
  const { store, ready } = useStore();
  const parts = ready ? sectionScored(store) : { words: 0, rules: 0, torch: 0, path: 0 };
  const points = ready ? scored(store) : 0;
  const percent = totals.all === 0 ? 0 : (points / totals.all) * 100;
  return (
    <main className="flex flex-col gap-5">
      <section className="rounded-3xl bg-[var(--card)] p-5 ring-1 ring-[var(--line)]">
        <div className="flex items-start gap-3">
          <Cat mood={moodFor(percent)} className="h-20 w-24 shrink-0" />
          <div>
            <h1 className="text-xl font-semibold">先知道为什么练，再自己把训练循环写出来</h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              训练只把训练误差压小。作业要你看见：训练误差最小的网络，常常不是预测新数据最好的那个。这个站的分数只记你对齐了多少，不是那 100 分。最好的 H、最好的 λ、噪声到底是多少，要你自己的图来说。
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Split name="训练 30" text="只在这里 backward" />
          <Split name="验证 30" text="选 H、早停、λ" />
          <Split name="测试 60" text="全部决定之后看一次" />
        </div>
      </section>

      <section className="grid gap-3">
        {lanes.map((lane) => (
          <div key={lane.href} className="rounded-3xl bg-white/80 p-4 ring-1 ring-[var(--line)]">
            <Link href={lane.href} className="block">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-semibold">{lane.title}</h2>
                <span className="text-sm text-[var(--muted)]">
                  {parts[lane.key]}/{totals[lane.key]}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{lane.text}</p>
            </Link>
            <button
              type="button"
              className="mt-2 text-sm text-[var(--muted)] underline disabled:no-underline disabled:opacity-40"
              disabled={!ready || !sectionHasRecord(store, lane.key)}
              onClick={() => clearSection(lane.key)}
            >
              只清空这一部分
            </button>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-white/80 p-4 text-sm leading-6 ring-1 ring-[var(--line)]">
        <p className="font-semibold">开工时就这三行</p>
        <pre className="mt-2 overflow-x-auto rounded-2xl bg-[#3f2d28] p-3 text-[#fff6ef]">{`cd coursework
python make_data.py
python exercise1.py`}</pre>
        <p className="mt-2 text-[var(--muted)]">
          截止 11 月 26 日 13:00，占单元成绩 30%。题目自己估计连写报告大约 6 到 8 小时。一次训练若要几分钟，就是写错了。清空只作用于上面点的那一部分，看过答案和已经对上的题会一起从那一部分拿掉，另外三部分还在。
        </p>
      </section>
    </main>
  );
}

function clearSection(key: CursorKey) {
  writeStore(withoutSection(readStore(), key));
}

function Split({ name, text }: { name: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-2 ring-1 ring-[var(--line)]">
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-[var(--muted)]">{text}</p>
    </div>
  );
}
