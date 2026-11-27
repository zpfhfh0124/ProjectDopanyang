import { CoinAmount } from "@/components/Coins";
import type { Grade } from "@/data/packs";

/** 등급별 카드 색 (Unity 프로토타입과 같은 색) */
export const GRADE_STYLE: Record<Grade, string> = {
  S: "linear-gradient(135deg, #e8a200 0%, #ff6b9d 50%, #6b8cff 100%)",
  A: "#d6336c",
  B: "#2f7bff",
  C: "#7d869c",
  D: "#7d869c",
};

/**
 * 결과 카드 한 장. revealed 가 false면 뒷면, true가 되면 뒤집혀 앞면이 보인다.
 * size: lg(1장), md(10장), sm(100장)
 */
export default function PrizeCard({
  grade,
  value,
  revealed,
  size,
}: {
  grade: Grade;
  value: number;
  revealed: boolean;
  size: "lg" | "md" | "sm";
}) {
  const s = grade === "S";
  return (
    <div className="aspect-[5/7] w-full [perspective:600px]">
      <div
        className="relative size-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: revealed ? "rotateY(0deg)" : "rotateY(180deg)" }}
      >
        {/* 앞면 */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden text-white [backface-visibility:hidden] ${
            size === "sm" ? "rounded-[4px]" : "rounded-[10px]"
          } ${s && revealed ? "gacha-s-glow" : ""}`}
          style={{ background: GRADE_STYLE[grade] }}
        >
          {s && <div className="gacha-shine absolute inset-0" />}
          <div
            className={`relative font-black leading-none drop-shadow ${
              size === "lg" ? "text-6xl" : size === "md" ? "text-2xl" : "text-[11px]"
            }`}
          >
            {grade}
          </div>
          {size !== "sm" && (
            <>
              <div className={`relative font-bold opacity-90 ${size === "lg" ? "mt-1 text-base" : "text-[10px]"}`}>
                {grade}상
              </div>
              <div className={`relative font-semibold opacity-90 ${size === "lg" ? "mt-3 text-sm" : "mt-0.5 text-[9px]"}`}>
                <CoinAmount amount={value} size={size === "lg" ? 14 : 9} className={size === "lg" ? "gap-1" : "gap-0.5"} />
              </div>
            </>
          )}
        </div>

        {/* 뒷면 */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-[#1b1f36] [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            size === "sm" ? "rounded-[4px]" : "rounded-[10px] border-2 border-white/15"
          }`}
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,.06) 0 6px, transparent 6px 12px)",
          }}
        >
          {size !== "sm" && <span className="text-lg font-black text-white/30">?</span>}
        </div>
      </div>
    </div>
  );
}
