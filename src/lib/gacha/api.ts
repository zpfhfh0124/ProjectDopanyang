// 화면이 뽑기를 요청하는 입구. 지금은 브라우저 안에서 engine.draw 를 바로 부른다.
// 출시 때는 이 함수만 서버 요청으로 바꾸면 된다. 예:
//   const res = await fetch("/api/draw", { method: "POST", body: JSON.stringify({ packId, count }) });
//   return res.json();   // 서버가 포인트·재고를 확인하고 추첨한 결과
// 화면 쪽 코드는 그대로 두고 결과만 받아 쓰도록 비동기 함수로 만들어 두었다.

import { getPack } from "@/data/packs";
import { draw, type DrawResult, type GachaState } from "./engine";

export async function requestDraw(state: GachaState, packId: number, count: number): Promise<DrawResult> {
  const pack = getPack(packId);
  if (!pack) throw new Error(`없는 팩: ${packId}`);
  return draw(state, pack, count);
}
