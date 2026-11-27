"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 하단 탭 아이콘 (자체 제작, 22px 선 아이콘)
const icons = {
  // 오리파: 윗부분이 톱니 모양인 카드 팩
  oripa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="M6 4l1.5 1.2L9 4l1.5 1.2L12 4l1.5 1.2L15 4l1.5 1.2L18 4v16l-1.5-1.2L15 20l-1.5-1.2L12 20l-1.5-1.2L9 20l-1.5-1.2L6 20z" />
      <path d="M12 8.5l1.1 2.2 2.4.3-1.8 1.6.5 2.4-2.2-1.2-2.2 1.2.5-2.4-1.8-1.6 2.4-.3z" fill="currentColor" stroke="none" />
    </svg>
  ),
  // RUSH: 번개
  rush: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="M13.5 2.5L5 13.5h6l-1.5 8 8.5-11h-6z" />
    </svg>
  ),
  // 스페셜: 리본 달린 상자
  special: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M3 9h18M12 9v11M12 9C10 5 6.5 5.5 7.5 7.5 8.3 9 12 9 12 9zM12 9c2-4 5.5-3.5 4.5-1.5C15.7 9 12 9 12 9z" />
    </svg>
  ),
  // 획득 상품: 겹친 카드
  prizes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <rect x="8" y="4" width="11" height="15" rx="2" />
      <path d="M8 7.5L5.2 8.3a1.5 1.5 0 00-1 1.8l2.7 10a1.5 1.5 0 001.8 1l7-1.9" />
    </svg>
  ),
  // 마이페이지: 사람
  mypage: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20.5c.8-4 3.8-6 7.5-6s6.7 2 7.5 6" strokeLinecap="round" />
    </svg>
  ),
};

const TABS = [
  { href: "/", label: "오리파", icon: icons.oripa },
  { href: "/rush", label: "RUSH", icon: icons.rush },
  { href: "/special", label: "스페셜", icon: icons.special },
  { href: "/prizes", label: "획득 상품", icon: icons.prizes },
  { href: "/mypage", label: "마이페이지", icon: icons.mypage },
];

/** 화면 맨 아래 고정 탭 바. 지금 보는 탭은 빨간 아이콘·글자. */
export default function BottomNav() {
  const path = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] border-t border-[var(--border)] bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex h-[var(--bottom-nav-h)]">
        {TABS.map((t) => {
          const on = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
                  on ? "text-[var(--tab-red)]" : "text-[var(--text)]"
                }`}
              >
                <span className="size-[22px]">{t.icon}</span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
