import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "RUSH · 도파냥" };

export default function RushPage() {
  return <ComingSoon title="RUSH" desc="정해진 시간 동안 열리는 한정 뽑기가 들어올 자리예요." />;
}
