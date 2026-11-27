import { rtp, type Pack } from "@/data/packs";

const num = (n: number) => n.toLocaleString("ko-KR");

/** 팩 카드: 그림 자리, 이름, 1회 가격, 환원율, 남은 수량 막대, 1회/10회/확률 버튼. */
export default function PackCard({ pack }: { pack: Pack }) {
  const ratio = pack.total > 0 ? pack.left / pack.total : 0;

  return (
    <article className="overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)]">
      {/* 팩 그림이 생기기 전까지는 팩 색 배경에 카테고리 글자 */}
      <div
        className="relative flex aspect-[1402/1122] w-full items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(120% 90% at 20% 10%, color-mix(in srgb, ${pack.themeColor} 55%, white) 0%, ${pack.themeColor} 55%, color-mix(in srgb, ${pack.themeColor} 70%, black) 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.6px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="relative text-center text-white">
          <div className="text-[34px] font-extrabold leading-tight drop-shadow">{pack.category}</div>
          <div className="mt-1 text-sm font-semibold opacity-85">{pack.name}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-3.5 py-3">
        <h3 className="text-base font-bold leading-[26px] text-[var(--text)]">{pack.name}</h3>
        <Meta left={`1회 ${num(pack.price)}pt`} right={`환원율 ${Math.round(rtp(pack))}%`} />
        <div className="h-1.5 overflow-hidden rounded-[3px] bg-[var(--border)]">
          <div className="h-full rounded-[3px] bg-[var(--accent)]" style={{ width: `${ratio * 100}%` }} />
        </div>
        <Meta left="남은 수량" right={`${num(pack.left)} / ${num(pack.total)}`} />
        <div className="flex h-10 gap-2">
          <button className="flex-1 rounded-lg bg-[var(--accent)] text-sm font-bold text-white active:brightness-90">
            1회
          </button>
          <button className="flex-1 rounded-lg bg-[var(--accent)] text-sm font-bold text-white active:brightness-90">
            10회
          </button>
          <button className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm font-bold text-[var(--text)] active:bg-[var(--bg)]">
            확률
          </button>
        </div>
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
