// ============================================================
// STAT CARD
// ============================================================

export default function StatCard({
  icon,
  label,
  value,
  hint,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}>) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>

      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>

      {hint && (
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}
