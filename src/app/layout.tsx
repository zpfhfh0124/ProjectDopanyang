import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import GachaProvider from "@/components/gacha/GachaProvider";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "도파냥",
  description: "카드팩 뽑기",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eef1f7",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="antialiased">
      <body>
        {/* 코인·보관 카드 상태는 모든 탭이 함께 쓴다 */}
        <GachaProvider>
          {/* 아래 여백: 하단 탭 바에 내용이 가리지 않게 */}
          <main className="mx-auto min-h-dvh w-full max-w-[480px] bg-[var(--bg)] pb-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom))]">
            {/* 타이틀: 스크롤해도 맨 위. 오른쪽 위 코인이 보유 재화 */}
            <header className="sticky top-0 z-20 h-[var(--header-h)] bg-[var(--bg)] px-4 pt-3">
              <Header />
            </header>
            {children}
          </main>
          <BottomNav />
        </GachaProvider>
      </body>
    </html>
  );
}
