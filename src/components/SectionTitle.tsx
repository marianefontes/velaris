interface SectionTitleProps {
  eyebrow: string;
  title: string;
  badge?: string;
}

export function SectionTitle({ eyebrow, title, badge }: SectionTitleProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-white/5 pb-4">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant">{eyebrow}</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">{title}</h3>
      </div>
      {badge ? <span className="signature-pill ml-auto">{badge}</span> : null}
    </div>
  );
}
