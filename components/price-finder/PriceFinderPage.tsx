"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SimplePriceInputs } from "@/types";
import {
  calculateBreakEven,
  defaultSimplePriceInputs,
  generateScenarios,
} from "@/utils/simplePriceFinder";
import { SimpleInputForm } from "./SimpleInputForm";
import { PriceCard } from "./PriceCard";

export function PriceFinderPage() {
  const router = useRouter();
  const [inputs, setInputs] = useState<SimplePriceInputs>(defaultSimplePriceInputs);

  const scenarios = useMemo(() => generateScenarios(inputs), [inputs]);

  function transferToCalculator(price: number) {
    const breakEven = calculateBreakEven(inputs);
    const params = new URLSearchParams({
      avgOrderValue: price.toString(),
      productCost: breakEven.toString(),
      operationalCostMonthly: inputs.fixedCostsMonthly.toString(),
      monthlyCustomers: inputs.targetUsers.toString(),
      source: "price-finder",
    });
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Fiyat Belirle</h1>
        <p className="mt-2 text-muted-foreground">
          Maliyetler, App Store / ödeme komisyonu ve vergi ile brüt liste fiyatları hesaplanır. Üç öneri
          (Minimum / İdeal / Maksimize). Tüm tutarlar <strong>USD</strong>. Kartlardaki fiyatlar kesintiler
          sonrası hedef neti karşılayacak şekilde yukarı yuvarlanmış brüttür. İdeal fiyatı ana hesaplayıcıya
          tek tıkla aktarın.
        </p>
      </div>

      <SimpleInputForm inputs={inputs} onChange={(p) => setInputs((prev) => ({ ...prev, ...p }))} />

      <div className="grid gap-6 md:grid-cols-3">
        {scenarios.map((s) => (
          <PriceCard key={s.name} scenario={s} onTransfer={() => transferToCalculator(s.price)} />
        ))}
      </div>
    </div>
  );
}
