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
 * 칩은 하나만 고를 수 있다. 고르면 줄에는 [필터 아이콘] [고른 칩 ×]만 남고,
 * ×를 누르면 해제되어 칩 목록으로 돌아온다. 필터 버튼은 칩 전체를 보는 펼침 판을 연다.
 */
export default function FilterBar({
  selected,
  onSelect,
  sort,
  onSort,
}: {
  selected: string | null;
  onSelect: (tag: string | null) => void;
  sort: SortId;
  onSort: (sort: SortId) => void;
}) {
  const [open, setOpen] = useState(false);
  const chipRow = useDragScroll<HTMLDivElement>();

  // 같은 칩을 다시 누르면 해제, 다른 칩이면 그걸로 바꿈
  const pick = (tag: string) => {
    onSelect(selected === tag ? null : tag);
    setOpen(false);
  };

  return (
    <div className="border-t border-[var(--border)]">
      <div className="flex h-11 items-center">
        <button
          type="button"
          aria-expanded={open}
          aria-label="필터 펼치기"
          onClick={() => setOpen((o) => !o)}
          className={`flex shrink-0 items-center gap-1 pl-4 pr-2 text-[13.5px] font-bold ${
            open ? "text-[var(--tab-red)]" : "text-[var(--text)]"
          }`}
        >
          <SlidersIcon />
          {!selected && "필터"}
        </button>

        {selected && (
          <div className="flex min-w-0 flex-1 items-center pr-3">
            <button
              type="button"
              onClick={() => onSelect(null)}
              aria-label={`${selected} 필터 해제`}
              className="flex h-7 items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] pl-3 pr-2 text-[12.5px] font-semibold text-[var(--tab-red)]"
            >
              {selected}
              <span aria-hidden className="text-[14px] leading-none text-[var(--muted)]">
                ×
              </span>
            </button>
          </div>
        )}
        {/* 칩 줄은 끌기 연결이 풀리지 않게 늘 두고, 고른 동안만 숨긴다 */}
        <div
          ref={chipRow}
          className={`no-scrollbar min-w-0 flex-1 cursor-grab select-none items-center gap-1.5 overflow-x-auto overscroll-x-contain pr-3 ${
            selected ? "hidden" : "flex"
          }`}
        >
          {FILTER_TAGS.map((tag) => (
            <Chip key={tag} label={tag} on={false} onClick={() => pick(tag)} />
          ))}
        </div>

        <div className="relative flex h-full shrink-0 items-center border-l border-[var(--border)]">
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortId)}
            aria-label="정렬"
            className="h-full w-[5.6rem] cursor-pointer appearance-none bg-transparent pl-2.5 pr-6 text-[13px] font-bold text-[var(--text)] outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 text-[var(--text)]">
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
              onClick={() => {
                onSelect(null);
                setOpen(false);
              }}
              disabled={!selected}
              className="text-[12.5px] text-[var(--muted)] underline-offset-2 enabled:hover:underline disabled:opacity-40"
            >
              초기화
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTER_TAGS.map((tag) => (
              <Chip key={tag} label={tag} on={selected === tag} onClick={() => pick(tag)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
