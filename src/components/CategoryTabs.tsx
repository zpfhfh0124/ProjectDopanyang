"use client";

import { useRef, useState } from "react";

/**
 * 카테고리 탭 바. 넘치면 가로로 밀고, 누르면 굵은 글자 + 빨간 밑줄로 선택된다.
 * 아직 팩 거르기는 없고 선택 상태만 바뀐다 (onSelect로 받을 수 있음).
 */
export default function CategoryTabs({
  tabs,
  initial = 0,
  onSelect,
}: {
  tabs: string[];
  initial?: number;
  onSelect?: (index: number) => void;
}) {
  const [selected, setSelected] = useState(initial);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    setSelected(i);
    onSelect?.(i);
    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  };

  return (
    <div className="no-scrollbar flex h-11 overflow-x-auto px-1.5" role="tablist">
      {tabs.map((name, i) => {
        const on = i === selected;
        return (
          <button
            key={name}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            aria-selected={on}
            onClick={() => select(i)}
            className={`relative shrink-0 whitespace-nowrap px-2.5 text-[15px] ${
              on ? "font-bold text-[var(--text)]" : "text-[var(--muted)]"
            }`}
          >
            {name}
            {on && <span className="absolute inset-x-0 bottom-0 h-[2.5px] bg-[var(--tab-red)]" />}
          </button>
        );
      })}
    </div>
  );
}
