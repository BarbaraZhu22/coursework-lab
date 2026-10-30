"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cat, moodFor } from "@/components/Cat";
import { scored, sectionScored, totals } from "@/lib/score";
import { useStore } from "@/lib/storage";

const links = [
  { href: "/", label: "地图" },
  { href: "/words", label: "认词" },
  { href: "/rules", label: "规矩" },
  { href: "/torch", label: "手写" },
  { href: "/path", label: "八题" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { store, ready } = useStore();
  const points = ready ? scored(store) : 0;
  const torchPoints = ready ? sectionScored(store).torch : 0;
  const mood = moodFor(totals.all === 0 ? 0 : (points / totals.all) * 100);
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 pb-16 pt-5">
      <div className="sticky top-0 z-30 -mx-4 mb-4 bg-[var(--cream)]/90 px-4 py-2 backdrop-blur-md">
        <div className="flex items-end justify-between gap-3 rounded-full bg-white/90 px-4 py-2 ring-1 ring-[var(--line)]">
          <p className="text-sm">
            对齐 <span className="text-xl font-semibold">{points}</span>
          </p>
          <p className="text-sm text-[var(--muted)]">
            共 <span className="font-semibold text-[var(--ink)]">{totals.all}</span>
          </p>
          <p className="text-xs text-[var(--muted)]">
            手写 {torchPoints}/{totals.torch}
          </p>
        </div>
      </div>
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Cat mood={mood} className="h-14 w-16 shrink-0" />
          <span>
            <span className="block text-lg font-semibold tracking-tight">作业对齐</span>
            <span className="block text-sm text-[var(--muted)]">SEMTM0051 · 欠拟合与留出数据</span>
          </span>
        </Link>
        <nav className="flex flex-wrap gap-1.5 sm:justify-end">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  active ? "bg-[#4a322c] text-white" : "bg-white/80 text-[var(--ink)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      {children}
    </div>
  );
}
