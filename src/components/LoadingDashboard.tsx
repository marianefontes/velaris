export function LoadingDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-[28px] border border-white/5 bg-surface-container-high/60"
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="h-96 animate-pulse rounded-[32px] border border-white/5 bg-surface-container-high/60" />
        <div className="h-96 animate-pulse rounded-[32px] border border-white/5 bg-surface-container-high/60" />
      </div>
      <div className="h-80 animate-pulse rounded-[40px] border border-white/5 bg-surface-container-high/60" />
    </div>
  );
}
