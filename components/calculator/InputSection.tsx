"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TooltipIcon } from "@/components/shared/TooltipIcon";
import type { CalculatorInputs } from "@/types";

export function InputSection({
  inputs,
  onChange,
}: {
  inputs: CalculatorInputs;
  onChange: (p: Partial<CalculatorInputs>) => void;
}) {
  const row = (children: ReactNode) => (
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  );

  return (
    <div className="space-y-4">
      {row(
        <>
          <div>
            <Label className="mb-2 flex items-center gap-1">
              Aylık yeni müşteri
              <TooltipIcon content="Dönem içinde kazandığınız yeni müşteri sayısı." />
            </Label>
            <Input
              type="number"
              min={0}
              value={inputs.monthlyCustomers || ""}
              onChange={(e) => onChange({ monthlyCustomers: +e.target.value })}
            />
          </div>
          <div>
            <Label className="mb-2 flex items-center gap-1">
              Ortalama sipariş / abonelik (USD)
              <TooltipIcon content="Senaryo fiyatları buna göre ±% çarpan uygulanır." />
            </Label>
            <Input
              type="number"
              min={0}
              value={inputs.avgOrderValue || ""}
              onChange={(e) => onChange({ avgOrderValue: +e.target.value })}
            />
          </div>
        </>
      )}
      {row(
        <>
          <div>
            <Label className="mb-2 flex items-center gap-1">
              Müşteri ömrü (ay)
              <TooltipIcon content="LTV hesabında kullanılan ortalama süre." />
            </Label>
            <Input
              type="number"
              min={0.1}
              step={0.1}
              value={inputs.customerLifetimeMonths || ""}
              onChange={(e) => onChange({ customerLifetimeMonths: +e.target.value })}
            />
          </div>
          <div>
            <Label className="mb-2 flex items-center gap-1">
              Tekrar satın alma oranı
              <TooltipIcon content="0–1 arası (örn. 0.3) veya %30 girebilirsiniz. MRR = müşteri × fiyat × oran." />
            </Label>
            <Input
              type="number"
              min={0}
              step={0.05}
              value={inputs.repeatPurchaseRate || ""}
              onChange={(e) => onChange({ repeatPurchaseRate: +e.target.value })}
            />
          </div>
        </>
      )}
      {row(
        <>
          <div>
            <Label className="mb-2">Ürün / hizmet maliyeti (USD)</Label>
            <Input
              type="number"
              min={0}
              value={inputs.productCost || ""}
              onChange={(e) => onChange({ productCost: +e.target.value })}
            />
          </div>
          <div>
            <Label className="mb-2 flex items-center gap-1">
              Müşteri başı pazarlama (USD)
              <TooltipIcon content="Performans harici, müşteri başına düşen pazarlama." />
            </Label>
            <Input
              type="number"
              min={0}
              value={inputs.marketingCostPerCustomer || ""}
              onChange={(e) => onChange({ marketingCostPerCustomer: +e.target.value })}
            />
          </div>
        </>
      )}
      {row(
        <>
          <div>
            <Label className="mb-2">Aylık operasyonel maliyet (USD)</Label>
            <Input
              type="number"
              min={0}
              value={inputs.operationalCostMonthly || ""}
              onChange={(e) => onChange({ operationalCostMonthly: +e.target.value })}
            />
          </div>
          <div>
            <Label className="mb-2 flex items-center gap-1">
              Aylık reklam harcaması (USD)
              <TooltipIcon content="ROAS hesaplamasında doğrudan kullanılır." />
            </Label>
            <Input
              type="number"
              min={0}
              value={inputs.adSpendMonthly || ""}
              onChange={(e) => onChange({ adSpendMonthly: +e.target.value })}
            />
          </div>
        </>
      )}
    </div>
  );
}
