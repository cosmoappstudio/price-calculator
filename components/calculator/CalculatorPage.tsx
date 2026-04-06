"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculatorInputs } from "@/types";
import {
  buildScenarioResults,
  defaultCalculatorInputs,
} from "@/utils/calculator";
import { InputSection } from "./InputSection";
import { ScenarioCard } from "./ScenarioCard";
import { ExportButton } from "./ExportButton";

export function CalculatorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultCalculatorInputs);
  const [imported, setImported] = useState(false);

  useEffect(() => {
    const source = searchParams.get("source");
    if (source !== "price-finder") return;

    const avg = parseFloat(searchParams.get("avgOrderValue") || "");
    const pc = parseFloat(searchParams.get("productCost") || "");
    const op = parseFloat(searchParams.get("operationalCostMonthly") || "");
    const mc = parseInt(searchParams.get("monthlyCustomers") || "", 10);

    const id = requestAnimationFrame(() => {
      setInputs((prev) => ({
        ...prev,
        ...(Number.isFinite(avg) && avg > 0 ? { avgOrderValue: avg } : {}),
        ...(Number.isFinite(pc) && pc >= 0 ? { productCost: pc } : {}),
        ...(Number.isFinite(op) && op >= 0 ? { operationalCostMonthly: op } : {}),
        ...(Number.isFinite(mc) && mc > 0 ? { monthlyCustomers: mc } : {}),
      }));
      setImported(true);
      router.replace("/", { scroll: false });
    });
    return () => cancelAnimationFrame(id);
  }, [searchParams, router]);

  const scenarios = useMemo(() => buildScenarioResults(inputs), [inputs]);

  const patch = (p: Partial<CalculatorInputs>) => setInputs((prev) => ({ ...prev, ...p }));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      {imported ? (
        <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          Fiyat Belirle sayfasından değerler aktarıldı.
        </div>
      ) : null}

      <div>
        <h1 className="text-2xl font-bold text-foreground">Ana Hesaplayıcı</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Üç fiyat senaryosu (Konservatif / Önerilen / Agresif) ile ROAS, LTV, ROI, MRR, CAC ve
          karlılık metriklerini tek ekranda görün. Tüm tutarlar <strong>USD</strong>. Excel çıktısı
          üç sayfadır.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Girdiler</CardTitle>
          <CardDescription>Metrikler her senaryoda güncellenir.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <InputSection inputs={inputs} onChange={patch} />
          <ExportButton inputs={inputs} scenarios={scenarios} />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Senaryo kartları</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {scenarios.map((s) => (
            <ScenarioCard
              key={s.name}
              scenario={s}
              onUsePrice={(price) => patch({ avgOrderValue: price })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
