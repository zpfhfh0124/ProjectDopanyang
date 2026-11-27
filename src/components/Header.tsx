import Image from "next/image";

type Coins = { gold: number; silver: number; bronze: number };

const clamp = (n: number, max: number) => Math.min(Math.max(Math.floor(n), 0), max);

function CoinItem({ value, icon, label, digits }: { value: number; icon: string; label: string; digits: number }) {
  return (
    <span className="flex items-center gap-[3px]" aria-label={`${label} ${value}`}>
      <span
        className="text-right text-[13px] font-bold tabular-nums leading-none text-[var(--text)]"
        style={{ minWidth: `${digits}ch` }}
      >
        {value}
      </span>
      <Image src={icon} alt="" width={22} height={22} className="size-[22px]" />
    </span>
  );
}

/** 타이틀: 왼쪽 로고와 글자 로고, 오른쪽 위 금·은·동 코인 (골드 5자리, 실버·브론즈 2자리). */
export default function Header({ coins }: { coins: Coins }) {
  return (
    <div className="flex h-14 items-center gap-2">
      <Image src="/branding/logo.png" alt="" width={56} height={56} className="size-14 shrink-0" preload />
      <div className="min-w-0 max-w-[170px] flex-1">
        <Image src="/branding/wordmark.png" alt="도파냥" width={1087} height={200} className="h-auto w-full" preload />
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-[9px] self-start pt-1">
        <CoinItem value={clamp(coins.gold, 99999)} icon="/branding/coin-gold.png" label="골드" digits={5} />
        <CoinItem value={clamp(coins.silver, 99)} icon="/branding/coin-silver.png" label="실버" digits={2} />
        <CoinItem value={clamp(coins.bronze, 99)} icon="/branding/coin-bronze.png" label="브론즈" digits={2} />
      </div>
    </div>
  );
}
