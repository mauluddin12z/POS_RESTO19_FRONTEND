// ============================================================
// SORTABLE TABLE HEADER
// ============================================================

import { ArrowDownUp } from "lucide-react";

export default function SortableTh({
  label,
  active,
  onClick,
  align = "left",
}: Readonly<{
  label: string;
  active: boolean;
  onClick: () => void;
  align?: "left" | "right";
}>) {
  return (
    <th
      className={`px-4 py-3 font-semibold ${
        align === "right" ? "text-right" : ""
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex cursor-pointer items-center gap-1 uppercase tracking-wide transition-colors hover:text-foreground ${
          active ? "text-foreground" : ""
        }`}
      >
        {label}
        <ArrowDownUp className="h-3 w-3" />
      </button>
    </th>
  );
}
