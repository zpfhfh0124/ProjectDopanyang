import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "마이페이지 · 도파냥" };

export default function MyPage() {
  return <ComingSoon title="마이페이지" desc="내 정보, 충전 내역, 배송 신청이 들어올 자리예요." />;
}
