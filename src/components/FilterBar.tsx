"use client";

import { useState } from "react";
import { useDragScroll } from "@/components/useDragScroll";
import { FILTER_TAGS, SORTS, type SortId } from "@/data/packs";

function SlidersIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M3 5.5h8M15 5.5h2M3 14.5h2M9 14.5h8" strokeLinecap="round" />
      <circle cx="13" cy="5.5" r="2" />
      <circle cx="7" cy="14.5" r="2" />
    </svg>
  );
}

function UpDownIcon() {
  return (
    <svg viewBox="0 0 12 16" className="h-3.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M2.5 6 6 2.5 9.5 6M2.5 10 6 13.5 9.5 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`h-7 shrink-0 whitespace-nowrap rounded-full border px-3 text-[12.5px] transition-colors ${
        on
          ? "border-[var(--text)] bg-[var(--text)] font-semibold text-white"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
      }`}
    >
      {label}
    </button>
  );
}

/**
 * 탭 아래 필터 바: [필터 버튼] [가로로 미는 태그 칩들] | [정렬 선택]
 * 칩 줄은 스크롤바 없이 손가락이나 마우스로 끌어서 넘긴다.
 * 칩은 여러 개 켤 수 있고, 켠 태그를 모두 가진 팩만 남는다.
 * 필터 버튼을 누르면 칩 전체를 한눈에 보는 펼침 판이 열린다.
 */
export default function FilterBar({
  selected,
  onToggle,
  onReset,
  sort,
  onSort,
}: {
  selected: string[];
  onToggle: (tag: string) => void;
  onReset: () => void;
  sort: SortId;
  onSort: (sort: SortId) => void;
}) {
  const [open, setOpen] = useState(false);
  const chipRow = useDragScroll<HTMLDivElement>();
  const count = selected.length;

  return (
    <div className="border-t border-[var(--border)]">
      <div className="flex h-11 items-center">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`flex shrink-0 items-center gap-1 pl-4 pr-2 text-[13.5px] font-bold ${
            count > 0 || open ? "text-[var(--tab-red)]" : "text-[var(--text)]"
          }`}
        >
          <SlidersIcon />
          필터
          {count > 0 && (
            <span className="ml-0.5 flex size-[18px] items-center justify-center rounded-full bg-[var(--tab-red)] text-[11px] text-white">
              {count}
            </span>
          )}
        </button>

        <div
          ref={chipRow}
          className="no-scrollbar flex min-w-0 flex-1 cursor-grab select-none items-center gap-1.5 overflow-x-auto overscroll-x-contain pr-3"
        >
          {FILTER_TAGS.map((tag) => (
            <Chip key={tag} label={tag} on={selected.includes(tag)} onClick={() => onToggle(tag)} />
          ))}
        </div>

        <div className="relative flex h-full shrink-0 items-center border-l border-[var(--border)]">
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortId)}
            aria-label="정렬"
            className="h-full max-w-[128px] cursor-pointer appearance-none [field-sizing:content] bg-transparent pl-3 pr-7 text-[13px] font-bold text-[var(--text)] outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 text-[var(--text)]">
            <UpDownIcon />
          </span>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 pb-3 pt-2.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-bold text-[var(--text)]">태그로 거르기</span>
            <button
              type="button"
              onClick={onReset}
              disabled={count === 0}
              className="text-[12.5px] text-[var(--muted)] underline-offset-2 enabled:hover:underline disabled:opacity-40"
            >
              초기화
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTER_TAGS.map((tag) => (
              <Chip key={tag} label={tag} on={selected.includes(tag)} onClick={() => onToggle(tag)} />
            ))}
          </div>
          <p className="mt-2 text-[11.5px] text-[var(--muted)]">여러 개를 고르면 모두 해당하는 팩만 보여요.</p>
        </div>
      )}
    </div>
  );
}
