"use client";

import { useMemo } from "react";
import { formatCount, formatUsd } from "@/utils/formatCurrency";
import { TooltipIcon } from "./TooltipIcon";

type Format = "currency" | "percent" | "number" | "ratio";

export function MetricRow({
  label,
  value,
  format = "number",
  badge,
  tooltip,
}: {
  label: string;
  value: string | number;
  format?: Format;
  badge?: "success" | "warning" | "danger";
  tooltip?: string;
}) {
  const formatted = useMemo(() => {
    if (typeof value === "string") return value;
    switch (format) {
      case "currency":
        return formatUsd(value);
      case "percent":
        return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
      case "ratio":
        return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}×`;
      default:
        return formatCount(value);
    }
  }, [value, format]);

  const badgeColor =
    badge === "success"
      ? "text-success"
      : badge === "warning"
        ? "text-warning"
        : badge === "danger"
          ? "text-danger"
          : "";

  const emoji =
    badge === "success" ? "🟢" : badge === "warning" ? "🟡" : badge === "danger" ? "🔴" : "";

  return (
    <div className="flex items-center justify-between gap-2 py-1 text-sm">
      <span className="flex items-center gap-1 text-muted-foreground">
        {label}
        {tooltip ? <TooltipIcon content={tooltip} /> : null}
      </span>
      <span className={`font-semibold tabular-nums ${badgeColor}`}>
        {formatted}
        {badge ? <span className="ml-1">{emoji}</span> : null}
      </span>
    </div>
  );
}
