import Image from "next/image";

// 재화 규칙: 금·은·동은 한 가지 재화의 단위예요 (동전처럼).
//   1 실버 = 100 브론즈, 1 골드 = 100 실버 (= 10,000 브론즈)
// 내부에서는 가장 작은 단위(브론즈) 하나의 숫자로 계산하고, 보여 줄 때만 나눠요.
// 그래서 헤더 칸이 골드 5자리, 실버·브론즈 2자리예요.

export const BRONZE_PER_SILVER = 100;
export const BRONZE_PER_GOLD = 10000;

export type CoinParts = { gold: number; silver: number; bronze: number };

export function splitCoins(amount: number): CoinParts {
  const a = Math.max(0, Math.floor(amount));
  return {
    gold: Math.floor(a / BRONZE_PER_GOLD),
    silver: Math.floor((a % BRONZE_PER_GOLD) / BRONZE_PER_SILVER),
    bronze: a % BRONZE_PER_SILVER,
  };
}

export const COIN_ICON = {
  gold: "/branding/coin-gold.png",
  silver: "/branding/coin-silver.png",
  bronze: "/branding/coin-bronze.png",
} as const;

export const COIN_NAME = { gold: "골드", silver: "실버", bronze: "브론즈" } as const;

/** 글자로 쓴 금액: "25골드 1실버" (0인 단위는 뺌) */
export function coinText(amount: number): string {
  const p = splitCoins(amount);
  const parts = (["gold", "silver", "bronze"] as const).filter((k) => p[k] > 0).map((k) => `${p[k].toLocaleString("ko-KR")}${COIN_NAME[k]}`);
  return parts.length ? parts.join(" ") : `0${COIN_NAME.bronze}`;
}

/** 아이콘으로 쓴 금액: [25 골드아이콘] [1 실버아이콘] (0인 단위는 뺌) */
export function CoinAmount({ amount, size = 14, className = "" }: { amount: number; size?: number; className?: string }) {
  const p = splitCoins(amount);
  let keys = (["gold", "silver", "bronze"] as const).filter((k) => p[k] > 0);
  if (keys.length === 0) keys = ["bronze"];
  return (
    <span className={`inline-flex items-center gap-1.5 tabular-nums ${className}`} aria-label={coinText(amount)}>
      {keys.map((k) => (
        <span key={k} className="inline-flex items-center gap-[2px]">
          {p[k].toLocaleString("ko-KR")}
          <Image src={COIN_ICON[k]} alt="" width={size} height={size} style={{ width: size, height: size }} loading="eager" />
        </span>
      ))}
    </span>
  );
}
