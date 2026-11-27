// 팩 마스터 데이터. Unity 프로토타입(GachaCatalog.cs)의 값을 그대로 옮겼다.
// 나중에는 서버에서 받아 온다.

export type Grade = "S" | "A" | "B" | "C" | "D";

export const GRADES: Grade[] = ["S", "A", "B", "C", "D"];

type PerGrade = Partial<Record<Grade, number>>;

export type Pack = {
  id: number;
  category: string;
  name: string;
  price: number;
  total: number;
  /** 남은 수량. 지금은 처음 값 그대로. */
  left: number;
  themeColor: string;
  /** 재고 방식: 등급별 남은 개수. 확률 방식이면 없음. */
  stock?: PerGrade;
  /** 확률 방식: 등급별 확률(%). */
  odds?: PerGrade;
  /** 등급별 포인트 가치. 없는 등급은 빠짐. */
  value: PerGrade;
  /** 직접 붙이는 필터 태그. 가격·방식·환원율 태그는 packTags()가 데이터로 계산해 더한다. */
  tags: string[];
};

export const PACKS: Pack[] = [
  {
    id: 1,
    category: "포켓몬",
    name: "오리지널 팩",
    price: 100,
    total: 2084,
    left: 2084,
    themeColor: "#2f5bff",
    stock: { S: 100, D: 1984 },
    value: { S: 1000, D: 50 },
    tags: ["신규"],
  },
  {
    id: 2,
    category: "포켓몬",
    name: "마일드 오리파",
    price: 10000,
    total: 667,
    left: 667,
    themeColor: "#6b3fd6",
    stock: { S: 100, D: 567 },
    value: { S: 50000, D: 2400 },
    tags: ["이벤트"],
  },
  {
    id: 3,
    category: "포켓몬",
    name: "하이클래스 오리파",
    price: 300,
    total: 500,
    left: 500,
    themeColor: "#0f8a6a",
    odds: { S: 2, A: 8, B: 30, C: 60 },
    value: { S: 5000, A: 900, B: 250, C: 60 },
    tags: ["신규"],
  },
  {
    id: 4,
    category: "포켓몬",
    name: "전설의 포켓몬",
    price: 250000,
    total: 90,
    left: 90,
    themeColor: "#b4291f",
    stock: { S: 1, A: 5, B: 24, D: 60 },
    value: { S: 1800000, A: 1000000, B: 500000, D: 6000 },
    tags: ["이벤트", "소량 한정"],
  },
];

/** 등급별 확률(%). 재고 방식은 남은 재고 비율. */
export function oddsOf(pack: Pack): Record<Grade, number> {
  const result = { S: 0, A: 0, B: 0, C: 0, D: 0 } as Record<Grade, number>;
  if (pack.stock) {
    const total = GRADES.reduce((sum, g) => sum + (pack.stock![g] ?? 0), 0);
    if (total > 0) for (const g of GRADES) result[g] = ((pack.stock[g] ?? 0) / total) * 100;
  } else if (pack.odds) {
    for (const g of GRADES) result[g] = pack.odds[g] ?? 0;
  }
  return result;
}

/** 환원율(%) = 등급별 (확률 × 포인트 가치) 합 ÷ 1회 가격 */
export function rtp(pack: Pack): number {
  const odds = oddsOf(pack);
  const expected = GRADES.reduce((sum, g) => sum + (odds[g] / 100) * (pack.value[g] ?? 0), 0);
  return (expected / pack.price) * 100;
}

/** 필터 칩 순서. 직접 붙이는 태그와 계산 태그를 섞어 보여 준다. */
export const FILTER_TAGS = [
  "신규",
  "이벤트",
  "환원율 95%↑",
  "1천pt 이하",
  "10만pt 이상",
  "소량 한정",
  "재고 방식",
  "확률 방식",
] as const;

/** 팩에 붙은 태그 전체: 직접 붙인 태그 + 데이터로 계산한 태그 */
export function packTags(pack: Pack): string[] {
  const tags = [...pack.tags];
  if (rtp(pack) >= 95) tags.push("환원율 95%↑");
  if (pack.price <= 1000) tags.push("1천pt 이하");
  if (pack.price >= 100000) tags.push("10만pt 이상");
  tags.push(pack.stock ? "재고 방식" : "확률 방식");
  return tags;
}

export const SORTS = [
  { id: "recommended", label: "추천순" },
  { id: "price-asc", label: "낮은 가격순" },
  { id: "price-desc", label: "높은 가격순" },
  { id: "rtp-desc", label: "환원율 높은순" },
  { id: "left-asc", label: "남은 수량 적은순" },
] as const;

export type SortId = (typeof SORTS)[number]["id"];

export function sortPacks(packs: Pack[], sort: SortId): Pack[] {
  const list = [...packs];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rtp-desc":
      return list.sort((a, b) => rtp(b) - rtp(a));
    case "left-asc":
      return list.sort((a, b) => a.left / a.total - b.left / b.total);
    default:
      return list;
  }
}

export const CATEGORIES =["홈", "포켓몬", "원피스", "하비", "피규어", "유희왕", "바이스 슈발츠"];
