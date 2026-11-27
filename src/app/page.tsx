import BannerCarousel from "@/components/BannerCarousel";
import HomePacks from "@/components/HomePacks";

// 배너 그림이 생기기 전까지 쓰는 임시 배너
const BANNERS = [
  { bg: "linear-gradient(135deg, #c9d3f5, #9fb2f0)", title: "도파냥 오픈", sub: "첫 뽑기를 시작해 보세요" },
  { bg: "linear-gradient(135deg, #f5cde0, #ef9fc4)", title: "매일 출석 코인", sub: "하루 한 번 브론즈 코인 지급" },
  { bg: "linear-gradient(135deg, #cdeedd, #8fd8b4)", title: "신규 팩 입고", sub: "이번 주 새로 들어온 팩" },
];

/** 오리파 탭 (홈) */
export default function Home() {
  return (
    <>
      <section className="pt-1.5" aria-label="배너">
        <BannerCarousel
          slides={BANNERS.map((b) => (
            <div key={b.title} className="flex h-full flex-col justify-center px-6" style={{ background: b.bg }}>
              <div className="text-xl font-extrabold text-[var(--text)]">{b.title}</div>
              <div className="mt-1 text-[13px] text-[var(--text)]/70">{b.sub}</div>
            </div>
          ))}
        />
      </section>

      <HomePacks />

      <p className="border-t border-[var(--border)] px-4 pb-8 pt-3 text-[12px] text-[var(--muted)]">
        데모예요. 실제 결제와 배송은 없고, 코인과 뽑은 카드는 이 브라우저에만 저장되는 가짜 데이터예요. 오른쪽 위
        코인을 누르면 100골드가 충전돼요.
      </p>
    </>
  );
}
