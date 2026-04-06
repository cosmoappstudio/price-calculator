"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SimplePriceScenario } from "@/types";
import { formatUsd } from "@/utils/formatCurrency";

export function PriceCard({
  scenario,
  onTransfer,
}: {
  scenario: SimplePriceScenario;
  onTransfer: () => void;
}) {
  const ideal = scenario.name === "İdeal";

  return (
    <Card
      className={
        ideal
          ? "border-2 border-success shadow-lg shadow-success/10"
          : "border border-border"
      }
    >
      <CardHeader className="text-center">
        {ideal ? (
          <div className="mb-2">
            <span className="rounded-full bg-success px-3 py-1 text-xs font-medium text-white">
              Önerilen
            </span>
          </div>
        ) : null}
        <CardTitle className="text-xl">{scenario.name}</CardTitle>
        <div className="mt-4">
          <p className="font-mono text-5xl font-bold text-primary">{formatUsd(scenario.price)}</p>
          <p className="mt-1 text-sm text-muted-foreground">/ ay · brüt liste</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{scenario.description}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          +{(scenario.profitMargin * 100).toFixed(0)}% hedef üzeri (başa baş)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-muted p-3">
            <span className="text-sm text-muted-foreground">Aylık kar</span>
            <span className="font-mono text-lg font-bold">
              {formatUsd(scenario.monthlyProfit)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Net kar marjı</span>
            <span className="font-semibold">{scenario.profitMarginPercent.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Yıllık kar</span>
            <span className="font-semibold">{formatUsd(scenario.yearlyProfit)}</span>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-border bg-background p-3">
          <p className="mb-2 text-xs font-semibold">Değerlendirme</p>
          {scenario.name === "Minimum" && (
            <p className="text-xs text-muted-foreground">
              Pazar girişi için uygun. Düşük risk, düşük kar.
            </p>
          )}
          {scenario.name === "İdeal" && (
            <p className="text-xs text-success">Dengeli büyüme. Hem rekabetçi hem karlı.</p>
          )}
          {scenario.name === "Maksimize" && (
            <p className="text-xs text-muted-foreground">
              Premium pozisyon. Yüksek kar, talep testi gerekir.
            </p>
          )}
        </div>
        <Button className="mt-4 w-full" variant={ideal ? "default" : "outline"} onClick={onTransfer}>
          {ideal ? "Ana hesaplayıcıda kullan" : "Ana hesaplayıcıda kullan"}
        </Button>
      </CardContent>
    </Card>
  );
}
