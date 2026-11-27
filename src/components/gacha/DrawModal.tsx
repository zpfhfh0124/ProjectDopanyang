"use client";

import { useEffect, useState } from "react";
import { CoinAmount } from "@/components/Coins";
import { GRADES, type Pack } from "@/data/packs";
import type { Prize } from "@/lib/gacha/engine";
import PrizeCard, { GRADE_STYLE } from "./PrizeCard";

const PACK_MS = 1300; // 팩 흔들림 → 개봉까지

/**
 * 개봉 연출과 결과 화면.
 * 1) 팩이 흔들리다 빛나며 열린다 (누르면 바로 열림)
 * 2) 카드가 한 장씩 뒤집힌다 (모두 열기로 건너뛰기). S상이 나오면 섬광
 * 3) 보관하기 / 코인으로 전환
 */
export default function DrawModal({
  pack,
  results,
  onKeep,
  onConvert,
}: {
  pack: Pack;
  results: Prize[];
  onKeep: () => void;
  onConvert: () => void;
}) {
  const count = results.length;
  const [phase, setPhase] = useState<"pack" | "reveal">("pack");
  const [shown, setShown] = useState(0); // 뒤집힌 장 수
  const allShown = shown >= count;
  const total = results.reduce((s, p) => s + p.value, 0);
  const hasS = results.some((p) => p.grade === "S");
  const sShown = results.slice(0, shown).some((p) => p.grade === "S");

  // 1) 팩 개봉
  useEffect(() => {
    if (phase !== "pack") return;
    const t = window.setTimeout(() => setPhase("reveal"), PACK_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // 2) 차례로 뒤집기
  useEffect(() => {
    if (phase !== "reveal" || allShown) return;
    const step = count === 1 ? 250 : count <= 10 ? 230 : 28;
    const t = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 300 : step);
    return () => window.clearTimeout(t);
  }, [phase, shown, allShown, count]);

  // 뒤에 있는 화면이 스크롤되지 않게
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const size = count === 1 ? "lg" : count <= 10 ? "md" : "sm";
  // 등급별 장 수: 이미 뒤집힌 카드만 센다 (미리 S상이 있는지 들키지 않게)
  const opened = results.slice(0, shown);
  const counts = GRADES.map((g) => ({ g, n: opened.filter((p) => p.grade === g).length })).filter((x) => x.n > 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0a0c18]/80 backdrop-blur-sm" role="dialog" aria-modal>
      {phase === "pack" ? (
        <button
          type="button"
          onClick={() => setPhase("reveal")}
          className="flex flex-col items-center gap-5 text-white"
          aria-label="바로 개봉"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 팩 그림은 교체가 쉽게 그대로 쓴다 */}
          <img src={pack.art} alt="" className="gacha-pack-shake w-[230px] rounded-2xl shadow-2xl" draggable={false} />
          <div className="text-sm font-semibold opacity-80">
            {pack.name} {count}회 개봉 중… <span className="opacity-60">(누르면 바로)</span>
          </div>
        </button>
      ) : (
        <div className="gacha-pop mx-3 flex max-h-[92dvh] w-full max-w-[456px] flex-col overflow-hidden rounded-2xl bg-[var(--surface)]">
          {sShown && hasS && <div className="gacha-flash pointer-events-none fixed inset-0 z-10 bg-white" />}

          <div className="flex items-center justify-between px-4 pb-2 pt-4">
            <div>
              <div className="text-[17px] font-bold text-[var(--text)]">
                {pack.name} {count}회 결과
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {counts.map(({ g, n }) => (
                  <span
                    key={g}
                    className="rounded-full px-2 py-0.5 text-[11.5px] font-bold text-white"
                    style={{ background: GRADE_STYLE[g] }}
                  >
                    {g}상 {n}
                  </span>
                ))}
              </div>
            </div>
            {!allShown && (
              <button
                type="button"
                onClick={() => setShown(count)}
                className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--text)]"
              >
                모두 열기
              </button>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3">
            <div
              className={`grid ${
                count === 1 ? "mx-auto w-[170px] grid-cols-1 py-4" : count <= 10 ? "grid-cols-5 gap-2" : "grid-cols-10 gap-1"
              }`}
            >
              {results.map((p, i) => (
                <PrizeCard key={p.uid} grade={p.grade} value={p.value} revealed={i < shown} size={size} />
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border)] px-4 pb-4 pt-3">
            <div className="mb-3 flex items-center justify-between text-[13px] text-[var(--muted)]">
              <span>받은 카드 가치 합계</span>
              <span className="text-[15px] font-bold text-[var(--text)]">
                {allShown ? <CoinAmount amount={total} size={16} /> : "…"}
              </span>
            </div>
            <div className="flex h-11 gap-2">
              <button
                type="button"
                disabled={!allShown}
                onClick={onKeep}
                className="flex-1 rounded-lg border border-[var(--border)] text-sm font-bold text-[var(--text)] disabled:opacity-40"
              >
                보관하기
              </button>
              <button
                type="button"
                disabled={!allShown}
                onClick={onConvert}
                className="flex-1 rounded-lg bg-[var(--accent)] text-sm font-bold text-white disabled:opacity-40"
              >
                코인으로 전환
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
