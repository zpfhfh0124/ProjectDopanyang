"use client";

import Link from "next/link";
import { useState } from "react";
import { CoinAmount, wonText } from "@/components/Coins";
import { useGacha } from "@/components/gacha/GachaProvider";
import PrizeCard from "@/components/gacha/PrizeCard";
import { GRADES, type Grade } from "@/data/packs";

/** 획득 상품: 보관 중인 카드 목록 (최근 순). 등급으로 거르고, 한 장씩 또는 모두 코인으로 전환. */
export default function PrizeList() {
  const { state, convertPrizes } = useGacha();
  const [grade, setGrade] = useState<Grade | null>(null);
  const prizes = grade ? state.prizes.filter((p) => p.grade === grade) : state.prizes;
  const total = prizes.reduce((s, p) => s + p.value, 0);
  const counts = GRADES.map((g) => ({ g, n: state.prizes.filter((p) => p.grade === g).length })).filter((x) => x.n > 0);

  if (state.prizes.length === 0) {
    return (
      <section className="flex min-h-[60dvh] flex-col items-center justify-center gap-2 px-8 text-center">
        <h1 className="text-lg font-bold text-[var(--text)]">획득 상품</h1>
        <p className="text-[13px] text-[var(--muted)]">아직 보관 중인 카드가 없어요. 뽑기 결과에서 보관하기를 누르면 여기 모여요.</p>
        <Link href="/" className="mt-2 rounded-full bg-[var(--accent)] px-4 py-2 text-[13px] font-bold text-white">
          뽑으러 가기
        </Link>
      </section>
    );
  }

  return (
    <section className="px-4 pb-6 pt-2">
      <div className="flex items-end justify-between">
        <h1 className="text-lg font-bold text-[var(--text)]">
          획득 상품 <span className="text-[14px] font-semibold text-[var(--muted)]">{state.prizes.length}장</span>
        </h1>
      </div>

      {/* 등급으로 거르기 (하나만) */}
      <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto">
        <GradeChip label="전체" on={grade === null} onClick={() => setGrade(null)} />
        {counts.map(({ g, n }) => (
          <GradeChip key={g} label={`${g}상 ${n}`} on={grade === g} onClick={() => setGrade(grade === g ? null : g)} />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5">
        <div className="text-[12.5px] text-[var(--muted)]">
          {grade ? `${grade}상` : "전체"} {prizes.length}장 가치
          <div className="mt-0.5 flex items-center gap-1.5 text-[15px] font-bold text-[var(--text)]">
            <CoinAmount amount={total} size={15} />
            <span className="text-[12px] font-normal text-[var(--muted)]">({wonText(total)})</span>
          </div>
        </div>
        <button
          type="button"
          disabled={prizes.length === 0}
          onClick={() => convertPrizes(prizes.map((p) => p.uid))}
          className="rounded-lg bg-[var(--accent)] px-3 py-2 text-[13px] font-bold text-white disabled:opacity-40"
        >
          모두 코인으로 전환
        </button>
      </div>

      <ul className="mt-3 grid grid-cols-3 gap-2.5">
        {prizes.map((p) => (
          <li key={p.uid} className="flex flex-col gap-1">
            <PrizeCard grade={p.grade} value={p.value} revealed size="md" />
            <div className="truncate text-[11.5px] text-[var(--muted)]">{p.packName}</div>
            <button
              type="button"
              onClick={() => convertPrizes([p.uid])}
              className="h-7 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[11.5px] font-semibold text-[var(--text)]"
            >
              코인으로 전환
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function GradeChip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`h-7 shrink-0 rounded-full border px-3 text-[12.5px] ${
        on ? "border-[var(--text)] bg-[var(--text)] font-semibold text-white" : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
      }`}
    >
      {label}
    </button>
  );
}
