import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Tailwind는 postcss.config.mjs(@tailwindcss/postcss)로 처리한다.
  // 예전 turbopack 로더 방식은 globals.css를 고쳐도 반영되지 않아서 바꿨다.
};

export default nextConfig;
