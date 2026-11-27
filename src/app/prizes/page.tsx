import type { Metadata } from "next";
import PrizeList from "@/components/PrizeList";

export const metadata: Metadata = { title: "획득 상품 · 도파냥" };

export default function PrizesPage() {
  return <PrizeList />;
}
