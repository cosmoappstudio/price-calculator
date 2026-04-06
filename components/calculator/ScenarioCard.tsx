"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricRow } from "@/components/shared/MetricCard";
import type { PriceScenarioResult } from "@/types";
import {
  getLtvCacBadge,
  getProfitMarginBadge,
  getRoasBadge,
} from "@/utils/calculator";
import { formatUsd } from "@/utils/formatCurrency";

export function ScenarioCard({
  scenario,
  onUsePrice,
}: {
  scenario: PriceScenarioResult;
  onUsePrice: (price: number) => void;
}) {
  const { metrics: m, name, multiplier, price } = scenario;
  const pct = ((multiplier - 1) * 100).toFixed(0);
  const pctLabel = multiplier > 1 ? `+${pct}%` : multiplier < 1 ? `${pct}%` : "Baz";

  return (
    <Card className="flex flex-col border-border">
      <CardHeader>
        <CardTitle className="text-base">{name}</CardTitle>
        <p className="font-mono text-4xl font-bold text-primary">{formatUsd(price)}</p>
        <span className="text-sm text-muted-foreground">{pctLabel} liste fiyatı</span>
      </CardHeader>
      <CardContent className="mt-auto flex flex-1 flex-col gap-4">
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Temel metrikler
          </h4>
          <MetricRow label="Brüt kar" value={m.grossProfit} format="currency" />
          <MetricRow label="Brüt marj" value={m.grossMargin} format="percent" />
        </section>
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Müşteri ekonomisi
          </h4>
          <MetricRow label="LTV" value={m.ltv} format="currency" />
          <MetricRow label="CAC" value={m.cac} format="currency" />
          <MetricRow
            label="LTV:CAC"
            value={m.ltvCacRatio}
            format="ratio"
            badge={getLtvCacBadge(m.ltvCacRatio)}
          />
        </section>
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Performans
          </h4>
          <MetricRow label="ROAS" value={m.roas} format="percent" badge={getRoasBadge(m.roas)} />
          <MetricRow label="ROI" value={m.roi} format="percent" />
        </section>
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Gelir & kar
          </h4>
          <MetricRow label="MRR" value={m.mrr} format="currency" />
          <MetricRow label="ARR" value={m.arr} format="currency" />
          <MetricRow label="Aylık kar" value={m.monthlyProfit} format="currency" />
          <MetricRow label="Yıllık kar" value={m.yearlyProfit} format="currency" />
          <MetricRow
            label="Kar marjı"
            value={m.profitMargin}
            format="percent"
            badge={getProfitMarginBadge(m.profitMargin)}
          />
        </section>
        <div className="border-t border-border pt-2">
          <MetricRow label="Geri ödeme" value={`${m.paybackPeriodMonths.toFixed(1)} ay`} />
        </div>
        <Button className="mt-auto w-full" onClick={() => onUsePrice(price)}>
          Bu fiyatı ana girdi olarak kullan
        </Button>
      </CardContent>
    </Card>
  );
}
