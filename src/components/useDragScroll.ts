"use client";

import { useEffect, useRef } from "react";

/**
 * 가로로 넘치는 줄을 배너처럼 끌어서 넘기게 한다.
 * 손가락은 브라우저 기본 가로 스크롤을 그대로 쓰고, 마우스(펜)는 직접 끌어서 움직인다.
 * 놓을 때 속도만큼 조금 더 미끄러지고, 끌었을 때는 칩이 눌리지 않게 클릭을 막는다.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0; // px/ms
    let raf = 0;

    const stopGlide = () => cancelAnimationFrame(raf);

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      stopGlide();
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      lastT = performance.now();
      startScroll = el.scrollLeft;
      moved = false;
      velocity = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 5) return;
      if (!moved) {
        moved = true;
        el.setPointerCapture(e.pointerId);
        el.style.cursor = "grabbing";
      }
      el.scrollLeft = startScroll - dx;
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      velocity = 0.8 * ((lastX - e.clientX) / dt) + 0.2 * velocity;
      lastX = e.clientX;
      lastT = now;
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      el.style.cursor = "";
      if (!moved) return;
      // 놓은 뒤 관성으로 조금 더 미끄러짐
      let v = velocity * 16;
      const glide = () => {
        if (Math.abs(v) < 0.5) return;
        el.scrollLeft += v;
        v *= 0.92;
        raf = requestAnimationFrame(glide);
      };
      raf = requestAnimationFrame(glide);
    };

    // 끌기가 끝난 직후의 클릭은 칩 선택으로 치지 않는다
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      stopGlide();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);

  return ref;
}
