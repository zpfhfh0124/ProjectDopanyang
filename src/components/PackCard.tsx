"use client";

import Image from "next/image";
import type { Pack } from "@/data/packs";
import { checkDraw, liveRtp, packState } from "@/lib/gacha/engine";
import { useGacha } from "@/components/gacha/GachaProvider";

const num = (n: number) => n.toLocaleString("ko-KR");

const DRAW_BUTTONS = [
  { count: 1, label: "1회", className: "bg-[var(--accent)]" },
  { count: 10, label: "10회", className: "bg-[var(--accent)]" },
  { count: 100, label: "100회", className: "bg-[#111111]" },
];

/** 팩 카드: 팩 그림, 이름과 확률 보기, 1회 가격, 환원율, 남은 수량 막대, 1회/10회/100회 뽑기 버튼. */
export default function PackCard({ pack }: { pack: Pack }) {
  const { state, busy, startDraw, showOdds, restockPack } = useGacha();
  const ps = packState(state, pack);
  const ratio = pack.total > 0 ? ps.left / pack.total : 0;
  const soldOut = ps.left <= 0;

  return (
    <article className="overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)]">
      {/* 팩 그림: public/packs/ 의 파일. 바꾸려면 data/packs.ts 의 art 값을 고친다 */}
      <div className="relative aspect-[1402/1122] w-full overflow-hidden" style={{ background: pack.themeColor }}>
        <Image
          src={pack.art}
          alt={`${pack.name} 팩 그림`}
          fill
          sizes="(max-width: 480px) 100vw, 480px"
          className={`object-cover ${soldOut ? "grayscale" : ""}`}
          unoptimized={pack.art.endsWith(".svg")}
        />
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-2xl font-black tracking-widest text-white">
            매진
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 px-3.5 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold leading-[26px] text-[var(--text)]">{pack.name}</h3>
          <button
            type="button"
            onClick={() => showOdds(pack)}
            className="text-[12.5px] text-[var(--muted)] underline underline-offset-2"
          >
            확률 보기
          </button>
        </div>
        <Meta left={`1회 ${num(pack.price)}pt`} right={`환원율 ${Math.round(liveRtp(state, pack))}%`} />
        <div className="h-1.5 overflow-hidden rounded-[3px] bg-[var(--border)]">
          <div className="h-full rounded-[3px] bg-[var(--accent)] transition-[width]" style={{ width: `${ratio * 100}%` }} />
        </div>
        <Meta left="남은 수량" right={`${num(ps.left)} / ${num(pack.total)}`} />

        {soldOut ? (
          <button
            type="button"
            onClick={() => restockPack(pack)}
            className="h-10 rounded-lg border border-[var(--border)] text-sm font-bold text-[var(--text)]"
          >
            재입고 (테스트)
          </button>
        ) : (
          <div className="flex h-10 gap-2">
            {DRAW_BUTTONS.map((b) => {
              const blocked = checkDraw(state, pack, b.count);
              return (
                <button
                  key={b.count}
                  type="button"
                  disabled={busy}
                  onClick={() => startDraw(pack, b.count)}
                  title={blocked === "SOLD_OUT" ? "남은 수량이 부족해요" : blocked ? "포인트가 부족해요" : undefined}
                  className={`flex-1 rounded-lg text-sm font-bold text-white active:brightness-90 ${b.className} ${
                    blocked ? "opacity-40" : ""
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

function Meta({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex h-5 items-center justify-between text-[13px] text-[var(--muted)]">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}
