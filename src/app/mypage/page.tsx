import type { Metadata } from "next";
import MyPage from "@/components/MyPage";

export const metadata: Metadata = { title: "마이페이지 · 도파냥" };

export default function MyPageRoute() {
  return <MyPage />;
}
