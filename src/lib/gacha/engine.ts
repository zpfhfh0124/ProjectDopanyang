// 추첨 규칙. Unity 프로토타입 GachaEngine.cs 와 같은 규칙이다.
// 브라우저 API에 의존하지 않는 순수 함수라서, 출시 때 그대로 서버(API 라우트)로 옮기면 된다.
// 지금은 데모라 브라우저에서 돌리지만, 출시 땐 포인트·재고·추첨을 반드시 서버가 정해야 한다.

import { GRADES, oddsOf, rtp, type Grade, type Pack, type PerGrade } from "@/data/packs";

export type PackState = { left: number; stock?: PerGrade };

export type Prize = {
  uid: number;
  packId: number;
  packName: string;
  grade: Grade;
  value: number;
};

export type GachaState = {
  points: number;
  nextUid: number;
  totalPulls: number;
  /** 보관 중인 카드 (최근 순) */
  prizes: Prize[];
  /** 팩 id → 남은 수량과 재고 */
  packs: Record<number, PackState>;
};

export const STARTING_POINTS = 5000;

export const initialState = (): GachaState => ({
  points: STARTING_POINTS,
  nextUid: 0,
  totalPulls: 0,
  prizes: [],
  packs: {},
});

export function packState(state: GachaState, pack: Pack): PackState {
  return state.packs[pack.id] ?? { left: pack.total, stock: pack.stock ? { ...pack.stock } : undefined };
}

export const liveOdds = (state: GachaState, pack: Pack) => oddsOf(pack, packState(state, pack).stock);
export const liveRtp = (state: GachaState, pack: Pack) => rtp(pack, packState(state, pack).stock);

export type DrawError = "NOT_ENOUGH_POINTS" | "SOLD_OUT";

export function checkDraw(state: GachaState, pack: Pack, count: number): DrawError | null {
  if (packState(state, pack).left < count) return "SOLD_OUT";
  if (state.points < pack.price * count) return "NOT_ENOUGH_POINTS";
  return null;
}

/** 등급 하나를 뽑는다. 재고 방식은 남은 재고 비율, 확률 방식은 확률표를 쓴다. */
export function roll(pack: Pack, ps: PackState, random: () => number): Grade {
  if (ps.stock) {
    const total = GRADES.reduce((sum, g) => sum + (ps.stock![g] ?? 0), 0);
    let y = Math.floor(random() * Math.max(1, total));
    for (const g of GRADES) {
      y -= ps.stock[g] ?? 0;
      if (y < 0) return g;
    }
    return GRADES.find((g) => (ps.stock![g] ?? 0) > 0) ?? "D";
  }
  let x = random() * 100;
  for (const g of GRADES) {
    x -= pack.odds?.[g] ?? 0;
    if (x < 0) return g;
  }
  return "C";
}

export type DrawResult = { ok: true; state: GachaState; results: Prize[] } | { ok: false; error: DrawError };

/** count 번 뽑는다. state는 바꾸지 않고 새 state를 돌려준다. */
export function draw(state: GachaState, pack: Pack, count: number, random: () => number = Math.random): DrawResult {
  const error = checkDraw(state, pack, count);
  if (error) return { ok: false, error };

  const current = packState(state, pack);
  const ps: PackState = { left: current.left, stock: current.stock ? { ...current.stock } : undefined };
  let nextUid = state.nextUid;
  const results: Prize[] = [];

  for (let i = 0; i < count; i++) {
    const grade = roll(pack, ps, random);
    if (ps.stock) ps.stock[grade] = (ps.stock[grade] ?? 0) - 1;
    ps.left--;
    results.push({ uid: ++nextUid, packId: pack.id, packName: pack.name, grade, value: Math.max(0, pack.value[grade] ?? 0) });
  }

  return {
    ok: true,
    results,
    state: {
      ...state,
      points: state.points - pack.price * count,
      nextUid,
      totalPulls: state.totalPulls + count,
      prizes: [...results].reverse().concat(state.prizes),
      packs: { ...state.packs, [pack.id]: ps },
    },
  };
}

/** 카드들을 포인트로 전환한다 (보관함에서 빠짐). */
export function sell(state: GachaState, uids: number[]): GachaState {
  const set = new Set(uids);
  const gained = state.prizes.filter((p) => set.has(p.uid)).reduce((sum, p) => sum + p.value, 0);
  return { ...state, points: state.points + gained, prizes: state.prizes.filter((p) => !set.has(p.uid)) };
}

export function restock(state: GachaState, pack: Pack): GachaState {
  const packs = { ...state.packs };
  delete packs[pack.id];
  return { ...state, packs };
}
