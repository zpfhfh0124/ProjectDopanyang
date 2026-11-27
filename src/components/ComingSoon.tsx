/** 아직 만들지 않은 탭의 준비 중 화면 */
export default function ComingSoon({ title, desc }: { title: string; desc: string }) {
  return (
    <section className="flex min-h-[60dvh] flex-col items-center justify-center gap-2 px-8 text-center">
      <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-[var(--surface)] text-3xl shadow-sm">🛠️</div>
      <h1 className="text-lg font-bold text-[var(--text)]">{title}</h1>
      <p className="text-[13px] text-[var(--muted)]">{desc}</p>
      <p className="mt-1 text-[12px] text-[var(--muted)]">준비 중이에요.</p>
    </section>
  );
}
