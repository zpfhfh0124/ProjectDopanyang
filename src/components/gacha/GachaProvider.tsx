"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Pack } from "@/data/packs";
import { coinText, wonText } from "@/components/Coins";
import { requestDraw } from "@/lib/gacha/api";
import { checkIn, initialState, restock, sell, type GachaState, type Prize } from "@/lib/gacha/engine";

/** 이 기기 시간 기준 오늘 날짜 (YYYY-MM-DD) */
export const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
import DrawModal from "./DrawModal";
import OddsModal from "./OddsModal";

// 데모용 저장 (브라우저 localStorage). 출시 땐 서버가 저장한다.
const SAVE_KEY = "dopanyang.gacha.v1";

type Opening = { pack: Pack; count: number; results: Prize[] };

type GachaContextValue = {
  state: GachaState;
  busy: boolean;
  startDraw: (pack: Pack, count: number) => void;
  showOdds: (pack: Pack) => void;
  charge: (amount: number) => void;
  restockPack: (pack: Pack) => void;
  /** 보관 카드를 코인으로 전환 */
  convertPrizes: (uids: number[]) => void;
  /** 오늘 날짜 YYYY-MM-DD (화면이 뜨기 전엔 null) */
  today: string | null;
  /** 오늘 출석 (하루 한 번 코인 지급) */
  doCheckIn: () => void;
  /** 화면 아래 짧은 알림 */
  notify: (msg: string) => void;
  resetAll: () => void;
};

const GachaContext = createContext<GachaContextValue | null>(null);

export function useGacha() {
  const ctx = useContext(GachaContext);
  if (!ctx) throw new Error("useGacha는 GachaProvider 안에서만 쓸 수 있어요");
  return ctx;
}

export default function GachaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GachaState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [today, setToday] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [opening, setOpening] = useState<Opening | null>(null);
  const [oddsPack, setOddsPack] = useState<Pack | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>(0);

  // 저장된 데모 데이터 불러오기 (서버 렌더와 어긋나지 않게 화면이 뜬 뒤에)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 브라우저 저장값은 화면이 뜬 뒤에만 읽을 수 있다
      if (raw) setState({ ...initialState(), ...JSON.parse(raw) });
    } catch {
      /* 저장값이 깨졌으면 처음 상태로 */
    }
    setLoaded(true);
    // 오늘 날짜도 화면이 뜬 뒤에 읽는다 (미리 만든 페이지에 날짜가 굳지 않게)
    setToday(todayString());
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  const say = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const startDraw = useCallback(
    async (pack: Pack, count: number) => {
      if (busy) return;
      setBusy(true);
      try {
        const res = await requestDraw(state, pack.id, count);
        if (!res.ok) {
          say(res.error === "SOLD_OUT" ? "남은 수량이 부족해요." : "코인이 부족해요.");
          return;
        }
        setState(res.state);
        setOpening({ pack, count, results: res.results });
      } finally {
        setBusy(false);
      }
    },
    [busy, say, state],
  );

  const sellPrizes = (uids: number[]) => setState((s) => sell(s, uids));

  const value: GachaContextValue = {
    state,
    busy,
    startDraw,
    showOdds: setOddsPack,
    charge: (amount) => {
      setState((s) => ({ ...s, points: s.points + amount }));
      say(`${coinText(amount)}(${wonText(amount)}) 충전했어요 (데모)`);
    },
    restockPack: (pack) => setState((s) => restock(s, pack)),
    convertPrizes: (uids) => {
      const set = new Set(uids);
      const total = state.prizes.filter((p) => set.has(p.uid)).reduce((s, p) => s + p.value, 0);
      sellPrizes(uids);
      say(`${uids.length}장을 ${coinText(total)}로 전환했어요`);
    },
    today,
    doCheckIn: () => {
      const res = checkIn(state, todayString());
      if (!res) return say("오늘은 이미 출석했어요.");
      setState(res.state);
      say(`출석 ${res.streak}일째! ${coinText(res.reward)} 받았어요`);
    },
    notify: say,
    resetAll: () => setState(initialState()),
  };

  return (
    <GachaContext.Provider value={value}>
      {children}
      {opening && (
        <DrawModal
          key={opening.results[0]?.uid}
          pack={opening.pack}
          results={opening.results}
          onConvert={() => {
            const total = opening.results.reduce((s, p) => s + p.value, 0);
            sellPrizes(opening.results.map((p) => p.uid));
            setOpening(null);
            say(`${coinText(total)}로 전환했어요`);
          }}
          onKeep={() => {
            setOpening(null);
            say(`보관함에 ${opening.results.length}장을 넣었어요`);
          }}
        />
      )}
      {oddsPack && <OddsModal pack={oddsPack} state={state} onClose={() => setOddsPack(null)} />}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--bottom-nav-h)+16px+env(safe-area-inset-bottom))] z-[70] flex justify-center px-4">
          <div className="rounded-lg bg-[var(--text)]/92 px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </GachaContext.Provider>
  );
}
