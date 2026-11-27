import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "스페셜 · 도파냥" };

export default function SpecialPage() {
  return <ComingSoon title="스페셜" desc="이벤트와 특별 기획 팩이 들어올 자리예요." />;
}
