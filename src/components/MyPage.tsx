"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { coinText } from "@/components/Coins";
import { useGacha } from "@/components/gacha/GachaProvider";
import { CHECKIN_REWARD, CHECKIN_WEEK_BONUS, tierOf } from "@/lib/gacha/engine";

const TIER_COLOR: Record<string, string> = {
  Beginner: "#7d869c",
  Bronze: "#b8733a",
  Silver: "#8f9bb3",
  Gold: "#e0a100",
  Platinum: "#5b7cfa",
};

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 3.5L10.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 마이페이지: 프로필, 회원 등급, 출석 체크, 이벤트 배너, 메뉴 목록 */
export default function MyPage() {
  const { state, today, doCheckIn, notify, resetAll } = useGacha();
  const tier = tierOf(state.totalPulls);
  const soon = (name: string) => () => notify(`${name}은(는) 준비 중이에요.`);

  // 출석 도장: 오늘이나 어제 출석했으면 연속 일수만큼 찍힘
  const a = state.attendance;
  const yesterday = today ? new Date(Date.parse(today) - 86400000).toISOString().slice(0, 10) : null;
  const checkedToday = !!today && a?.last === today;
  const stamps = a && (checkedToday || a.last === yesterday) ? a.streak % 7 || (checkedToday ? 7 : 0) : 0;

  return (
    <section className="flex flex-col gap-3 px-4 pb-6 pt-1">
      <h1 className="text-lg font-bold text-[var(--text)]">마이페이지</h1>

      {/* 프로필 */}
      <div className="flex items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface)]">
          <Image src="/branding/logo.png" alt="" fill sizes="48px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold text-[var(--text)]">도파냥 회원</div>
          <button type="button" onClick={soon("프로필 보기")} className="flex items-center text-[12.5px] text-[var(--muted)]">
            프로필 보기 <Chevron />
          </button>
        </div>
      </div>

      {/* 회원 등급 */}
      <button
        type="button"
        onClick={soon("등급 혜택")}
        className="flex items-center gap-3 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-left"
      >
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white"
          style={{ background: TIER_COLOR[tier.name] }}
          aria-hidden
        >
          {tier.name[0]}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11.5px] text-[var(--muted)]">회원 등급</span>
          <span className="block text-[15px] font-bold text-[var(--text)]">{tier.name}</span>
          <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
            <span
              className="block h-full rounded-full"
              style={{ width: `${Math.round(tier.progress * 100)}%`, background: TIER_COLOR[tier.name] }}
            />
          </span>
          <span className="mt-1 block text-[11.5px] text-[var(--muted)]">
            {tier.next ? `${tier.next}까지 뽑기 ${tier.remaining.toLocaleString("ko-KR")}회 남았어요` : "가장 높은 등급이에요"}
          </span>
        </span>
        <Chevron />
      </button>

      {/* 출석 체크 */}
      <div className="rounded-[12px] bg-gradient-to-br from-[#5b7cfa] to-[#9b6bff] px-3.5 py-3 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11.5px] opacity-85">매일 미션</div>
            <div className="text-[15px] font-bold">출석 체크</div>
          </div>
          <button
            type="button"
            onClick={doCheckIn}
            disabled={checkedToday || !today}
            className="rounded-full bg-white px-3 py-1.5 text-[12.5px] font-bold text-[#5b4bd6] disabled:bg-white/40 disabled:text-white"
          >
            {checkedToday ? "오늘 출석 완료" : "오늘 출석하기"}
          </button>
        </div>
        <ol className="mt-3 flex justify-between">
          {Array.from({ length: 7 }, (_, i) => {
            const on = i < stamps;
            return (
              <li key={i} className="flex flex-col items-center gap-1">
                <span
                  className={`flex size-8 items-center justify-center rounded-full text-[11px] font-bold ${
                    on ? "bg-white text-[#5b4bd6]" : "bg-white/20 text-white/80"
                  }`}
                >
                  {on ? "✓" : i + 1}
                </span>
                <span className="text-[10px] opacity-85">{i === 6 ? "보너스" : `${i + 1}일`}</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-2 text-[11px] opacity-85">
          매일 {coinText(CHECKIN_REWARD)}, 7일 연속이면 {coinText(CHECKIN_WEEK_BONUS)}를 더 드려요. 하루 빠지면 처음부터예요.
        </p>
      </div>

      {/* 이벤트 배너 */}
      <button
        type="button"
        onClick={soon("이벤트")}
        className="relative flex h-20 items-center overflow-hidden rounded-[12px] bg-gradient-to-r from-[#ff5f6d] to-[#ffc371] px-4 text-left text-white"
      >
        <span className="relative z-10">
          <span className="block text-[11.5px] font-semibold opacity-90">EVENT</span>
          <span className="block text-[16px] font-extrabold">첫 충전하면 보너스 코인!</span>
        </span>
        <span aria-hidden className="absolute -right-4 -top-6 text-[88px] font-black leading-none text-white/20">
          %
        </span>
      </button>

      {/* 메뉴 */}
      <ul className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)]">
        <MenuRow href="/prizes" label="당첨 내역" hint={`보관 카드 ${state.prizes.length}장 · 누적 뽑기 ${state.totalPulls.toLocaleString("ko-KR")}회`} />
        <MenuRow onClick={soon("RUSH 티켓")} label="RUSH 티켓" hint="0장" />
        <MenuRow onClick={soon("쿠폰")} label="쿠폰" hint="0장" />
        <MenuRow onClick={soon("배송지 주소 설정")} label="배송지 주소 설정" hint="실물 카드를 받을 주소" />
        <MenuRow onClick={soon("계정 설정")} label="계정 설정" />
      </ul>

      <button
        type="button"
        onClick={() => {
          if (window.confirm("데모 데이터(코인, 보관 카드, 재고, 출석)를 모두 처음으로 돌릴까요?")) {
            resetAll();
            notify("데모 데이터를 처음으로 돌렸어요.");
          }
        }}
        className="self-center text-[12px] text-[var(--muted)] underline underline-offset-2"
      >
        데모 데이터 초기화
      </button>
    </section>
  );
}

function MenuRow({ label, hint, href, onClick }: { label: string; hint?: ReactNode; href?: string; onClick?: () => void }) {
  const inner = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-[var(--text)]">{label}</span>
        {hint && <span className="block truncate text-[11.5px] text-[var(--muted)]">{hint}</span>}
      </span>
      <Chevron />
    </>
  );
  const cls = "flex w-full items-center gap-2 px-3.5 py-3 text-left";
  return (
    <li className="border-b border-[var(--border)] last:border-b-0">
      {href ? (
        <Link href={href} className={cls}>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={cls}>
          {inner}
        </button>
      )}
    </li>
  );
}
