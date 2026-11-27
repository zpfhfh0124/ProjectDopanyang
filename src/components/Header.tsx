"use client";

import Image from "next/image";
import { COIN_ICON, COIN_NAME, splitCoins } from "@/components/Coins";
import { useGacha } from "@/components/gacha/GachaProvider";

const clamp = (n: number, max: number) => Math.min(Math.max(Math.floor(n), 0), max);

function CoinItem({ kind, value, digits }: { kind: keyof typeof COIN_ICON; value: number; digits: number }) {
  return (
    <span className="flex items-center gap-[3px]">
      <span
        className="text-right text-[13px] font-bold tabular-nums leading-none text-[var(--text)]"
        style={{ minWidth: `${digits}ch` }}
      >
        {value}
      </span>
      <Image src={COIN_ICON[kind]} alt={COIN_NAME[kind]} width={22} height={22} className="size-[22px]" loading="eager" />
    </span>
  );
}

/**
 * 타이틀: 왼쪽 로고와 글자 로고, 오른쪽 위 보유 재화 (골드 5자리, 실버·브론즈 2자리).
 * 재화 숫자는 뽑기 상태와 연결돼 뽑거나 전환할 때 바로 바뀐다.
 * 데모: 코인을 누르면 100골드 충전.
 */
export default function Header() {
  const { state, charge } = useGacha();
  const c = splitCoins(state.points);

  return (
    <div className="flex h-14 items-center gap-2">
      <Image src="/branding/logo.png" alt="" width={56} height={56} className="size-14 shrink-0" preload />
      <div className="min-w-0 max-w-[170px] flex-1">
        <Image src="/branding/wordmark.png" alt="도파냥" width={1087} height={200} className="h-auto w-full" preload />
      </div>
      <button
        type="button"
        onClick={() => charge(1_000_000)}
        title="데모: 누르면 100골드(1,000,000원) 충전"
        aria-label={`보유 재화 ${c.gold}골드 ${c.silver}실버 ${c.bronze}브론즈. 누르면 100골드 충전(데모)`}
        className="ml-auto flex shrink-0 items-center gap-[9px] self-start rounded-full pt-1 active:opacity-70"
      >
        <CoinItem kind="gold" value={clamp(c.gold, 99999)} digits={5} />
        <CoinItem kind="silver" value={clamp(c.silver, 99)} digits={2} />
        <CoinItem kind="bronze" value={clamp(c.bronze, 99)} digits={2} />
      </button>
    </div>
  );
}
