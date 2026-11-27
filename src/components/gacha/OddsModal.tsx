"use client";

import { GRADES, type Pack } from "@/data/packs";
import { liveOdds, liveRtp, packState, type GachaState } from "@/lib/gacha/engine";
import { GRADE_STYLE } from "./PrizeCard";

const num = (n: number) => n.toLocaleString("ko-KR");

/** 확률표: 등급 / 확률(재고 방식은 남은 개수도) / 포인트 가치, 총 환원율 */
export default function OddsModal({ pack, state, onClose }: { pack: Pack; state: GachaState; onClose: () => void }) {
  const odds = liveOdds(state, pack);
  const ps = packState(state, pack);
  const rows = GRADES.filter((g) => pack.value[g] !== undefined);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0a0c18]/60 px-4"
      role="dialog"
      aria-modal
      onClick={onClose}
    >
      <div className="gacha-pop w-full max-w-[420px] rounded-2xl bg-[var(--surface)] p-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-[17px] font-bold text-[var(--text)]">{pack.name} 확률</div>
        <div className="mt-0.5 text-[12px] text-[var(--muted)]">
          {pack.stock ? "재고 방식: 남은 카드 중에서 뽑아요. 뽑을수록 확률이 바뀌어요." : "확률 방식: 매번 같은 확률로 뽑아요."}
        </div>

        <table className="mt-3 w-full text-[13px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
              <th className="py-1.5 font-semibold">등급</th>
              <th className="py-1.5 text-right font-semibold">확률</th>
              <th className="py-1.5 text-right font-semibold">포인트 가치</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((g) => (
              <tr key={g} className="border-b border-[var(--border)] text-[var(--text)]">
                <td className="py-2">
                  <span className="rounded px-1.5 py-0.5 text-[12px] font-bold text-white" style={{ background: GRADE_STYLE[g] }}>
                    {g}상
                  </span>
                </td>
                <td className="py-2 text-right tabular-nums">
                  {odds[g].toFixed(2)}%
                  {ps.stock && <span className="ml-1 text-[11.5px] text-[var(--muted)]">({num(ps.stock[g] ?? 0)}개)</span>}
                </td>
                <td className="py-2 text-right tabular-nums">{num(pack.value[g] ?? 0)}pt</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 text-[12.5px] text-[var(--muted)]">
          총 환원율 {liveRtp(state, pack).toFixed(1)}% (서비스 내 포인트 기준) · 남은 수량 {num(ps.left)} / {num(pack.total)}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 h-10 w-full rounded-lg bg-[var(--text)] text-sm font-bold text-white"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
