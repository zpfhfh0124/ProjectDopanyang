import BannerCarousel from "@/components/BannerCarousel";
import CategoryTabs from "@/components/CategoryTabs";
import Header from "@/components/Header";
import PackCard from "@/components/PackCard";
import { CATEGORIES, PACKS } from "@/data/packs";

// 아직 코인을 얻는 방법이 없어서 보여 주기용 값
const DEMO_COINS = { gold: 12500, silver: 36, bronze: 8 };

// 배너 그림이 생기기 전까지 쓰는 임시 배너
const BANNERS = [
  { bg: "linear-gradient(135deg, #c9d3f5, #9fb2f0)", title: "도파냥 오픈", sub: "첫 뽑기를 시작해 보세요" },
  { bg: "linear-gradient(135deg, #f5cde0, #ef9fc4)", title: "매일 출석 코인", sub: "하루 한 번 브론즈 코인 지급" },
  { bg: "linear-gradient(135deg, #cdeedd, #8fd8b4)", title: "신규 팩 입고", sub: "이번 주 새로 들어온 팩" },
];

export default function Home() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[480px] bg-[var(--bg)]">
      {/* 타이틀: 스크롤해도 맨 위 */}
      <header className="sticky top-0 z-20 h-[var(--header-h)] bg-[var(--bg)] px-4 pt-3">
        <Header coins={DEMO_COINS} />
      </header>

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

      {/* 구분선 두 줄 사이 탭 바: 올라오다가 타이틀 바로 밑에 붙음 */}
      <nav
        className="sticky top-[var(--header-h)] z-10 mt-3.5 border-y border-[var(--border)] bg-[var(--bg)]"
        aria-label="카테고리"
      >
        <CategoryTabs tabs={CATEGORIES} />
      </nav>

      <p className="border-b border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-[13px] text-[var(--muted)]">
        UI 프로토타입이에요. 실제 결제, 뽑기, 배송은 없고 포인트와 카드는 모두 가짜 데이터예요.
      </p>

      <section className="flex flex-col gap-3.5 px-4 pb-6 pt-3.5" aria-label="팩 목록">
        {PACKS.map((p) => (
          <PackCard key={p.id} pack={p} />
        ))}
      </section>
    </main>
  );
}
