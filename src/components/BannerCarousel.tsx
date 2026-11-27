"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** 가운데 배너 양옆에 이전/다음 배너가 보이는 폭(px) */
const PEEK = 20;
/** 배너 사이 간격(px) */
const GAP = 8;
const SIDE = PEEK + GAP;
/** 자동 넘김 간격(ms). 0이면 끔. */
const AUTO_INTERVAL = 4000;
const SLIDE_MS = 350;

/**
 * 순환 가로 배너. 마지막 다음은 처음, 처음 이전은 마지막으로 이어진다.
 * 양 끝에 복제 배너를 두고, 복제 배너에 닿으면 애니메이션 없이 진짜 배너로 옮긴다.
 * 손가락으로 밀면 한 장씩 붙고, 세로로 끌면 화면이 스크롤된다.
 */
export default function BannerCarousel({ slides }: { slides: ReactNode[] }) {
  const n = slides.length;
  const loop = n > 1;
  const items = loop ? [slides[n - 1], ...slides, slides[0]] : slides;

  // items 안의 위치. loop면 1..n이 진짜 배너.
  const [pos, setPos] = useState(loop ? 1 : 0);
  const [animate, setAnimate] = useState(true);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; startX: number; startY: number; t: number; horizontal: boolean | null } | null>(null);

  const go = useCallback(
    (delta: number) => {
      setAnimate(true);
      setPos((p) => {
        if (!loop) return Math.min(Math.max(p + delta, 0), n - 1);
        // 이전 이동이 끝나기 전에 또 넘기면 범위 안으로 먼저 돌려놓는다
        const base = p <= 0 ? n : p >= n + 1 ? 1 : p;
        return base + delta;
      });
    },
    [loop, n],
  );

  // 복제 배너에 도착하면 진짜 배너로 순간 이동
  const onTransitionEnd = () => {
    if (!loop) return;
    if (pos === 0 || pos === n + 1) {
      setAnimate(false);
      setPos(pos === 0 ? n : 1);
    }
  };

  // 순간 이동 다음 프레임에 애니메이션 다시 켜기
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  // 자동 넘김 (끌거나 화면이 숨겨져 있으면 멈춤)
  useEffect(() => {
    if (!loop || AUTO_INTERVAL <= 0 || dragging || paused) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") go(1);
    }, AUTO_INTERVAL);
    return () => window.clearInterval(id);
  }, [loop, dragging, paused, go, pos]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { id: e.pointerId, startX: e.clientX, startY: e.clientY, t: performance.now(), horizontal: null };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (d.horizontal === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      d.horizontal = Math.abs(dx) > Math.abs(dy);
      if (!d.horizontal) {
        drag.current = null;
        return;
      }
      rootRef.current?.setPointerCapture(e.pointerId);
      setDragging(true);
      setAnimate(false);
    }
    setDragX(dx);
  };

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId || !d.horizontal) return;
    const dx = e.clientX - d.startX;
    const width = (rootRef.current?.clientWidth ?? 360) - SIDE * 2;
    const fast = Math.abs(dx) / Math.max(performance.now() - d.t, 1) > 0.4;
    setDragging(false);
    setDragX(0);
    if (Math.abs(dx) > width * 0.2 || (fast && Math.abs(dx) > 10)) go(dx < 0 ? 1 : -1);
    else setAnimate(true);
  };

  const active = loop ? (((pos - 1) % n) + n) % n : pos;
  const step = `(100% - ${SIDE * 2 - GAP}px)`; // 배너 한 장 폭 + 간격

  return (
    <div
      ref={rootRef}
      className="relative select-none overflow-hidden"
      style={{ touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div
        className="flex"
        style={{
          gap: GAP,
          transform: `translateX(calc(${SIDE}px - ${pos} * ${step} + ${dragX}px))`,
          transition: animate && !dragging ? `transform ${SLIDE_MS}ms ease` : "none",
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {items.map((slide, i) => (
          <div
            key={i}
            className="aspect-[934/300] shrink-0 overflow-hidden rounded-[14px]"
            style={{ width: `calc(100% - ${SIDE * 2}px)` }}
            aria-hidden={i !== pos}
          >
            {slide}
          </div>
        ))}
      </div>

      {n > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`size-[7px] rounded-full transition-colors ${i === active ? "bg-[#14182b]/70" : "bg-[#14182b]/20"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
