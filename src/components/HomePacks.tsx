"use client";

import { useMemo, useState } from "react";
import CategoryTabs from "@/components/CategoryTabs";
import FilterBar from "@/components/FilterBar";
import PackCard from "@/components/PackCard";
import { useGacha } from "@/components/gacha/GachaProvider";
import { CATEGORIES, PACKS, packTags, sortPacks, type SortId } from "@/data/packs";
import { liveRtp, packState } from "@/lib/gacha/engine";

/** 탭 줄 + 필터 바(타이틀 밑에 고정), 안내 한 줄, 걸러지고 정렬된 팩 목록 */
export default function HomePacks() {
  const [selected, setSelected] = useState<string | null>(null);
  const [sort, setSort] = useState<SortId>("recommended");

  const { state } = useGacha();

  const packs = useMemo(() => {
    const filtered = selected ? PACKS.filter((p) => packTags(p).includes(selected)) : PACKS;
    return sortPacks(filtered, sort, (p) => ({
      rtp: liveRtp(state, p),
      leftRatio: packState(state, p).left / p.total,
    }));
  }, [selected, sort, state]);

  return (
    <>
      {/* 구분선 사이 탭 바 + 필터 바: 올라오다가 타이틀 바로 밑에 붙음 */}
      <nav
        className="sticky top-[var(--header-h)] z-10 mt-3.5 border-y border-[var(--border)] bg-[var(--bg)]"
        aria-label="카테고리와 필터"
      >
        <CategoryTabs tabs={CATEGORIES} />
        <FilterBar selected={selected} onSelect={setSelected} sort={sort} onSort={setSort} />
      </nav>

      <p className="flex gap-1 px-4 pt-2.5 text-[11.5px] leading-snug text-[var(--muted)]">
        <span aria-hidden className="text-[var(--tab-red)]">ⓘ</span>
        환원율과 등급 가치는 이 서비스 안의 코인 기준이에요. 실제 카드 거래 시세와 같다는 보장은 없어요.
      </p>

      <section className="flex flex-col gap-3.5 px-4 pb-4 pt-3" aria-label="팩 목록">
        {packs.map((p) => (
          <PackCard key={p.id} pack={p} />
        ))}
        {packs.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-[var(--border)] py-10 text-[13px] text-[var(--muted)]">
            조건에 맞는 팩이 없어요.
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 font-semibold text-[var(--text)]"
            >
              필터 초기화
            </button>
          </div>
        )}
      </section>
    </>
  );
}
