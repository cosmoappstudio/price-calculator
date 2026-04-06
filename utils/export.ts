"use client";

import * as XLSX from "xlsx";
import type { CalculatorInputs, PriceScenarioResult } from "@/types";

function downloadBlob(body: BlobPart, filename: string, mime: string) {
  const blob = new Blob([body], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCalculatorToExcel(
  inputs: CalculatorInputs,
  scenarios: PriceScenarioResult[]
) {
  const wb = XLSX.utils.book_new();

  const inputsSheet = [
    ["Parametre", "Değer"],
    ["Aylık yeni müşteri", inputs.monthlyCustomers],
    ["Ortalama sipariş değeri (USD)", inputs.avgOrderValue],
    ["Müşteri ömrü (ay)", inputs.customerLifetimeMonths],
    ["Tekrar satın alma oranı (0–1 veya %)", inputs.repeatPurchaseRate],
    ["Ürün maliyeti (USD)", inputs.productCost],
    ["Müşteri başı pazarlama (USD)", inputs.marketingCostPerCustomer],
    ["Aylık operasyonel maliyet (USD)", inputs.operationalCostMonthly],
    ["Aylık reklam harcaması (USD)", inputs.adSpendMonthly],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(inputsSheet), "Girdiler");

  const mid = scenarios.find((s) => s.name === "Önerilen") ?? scenarios[1];

  const comparisonHeader = [
    "Metrik",
    ...scenarios.map((s) => s.name),
  ];
  const comparisonRows: (string | number)[][] = [
    ["Fiyat (USD)", ...scenarios.map((s) => s.price)],
    ["Brüt kar (USD)", ...scenarios.map((s) => s.metrics.grossProfit)],
    ["Brüt marj %", ...scenarios.map((s) => s.metrics.grossMargin)],
    ["LTV (USD)", ...scenarios.map((s) => s.metrics.ltv)],
    ["CAC (USD)", ...scenarios.map((s) => s.metrics.cac)],
    ["LTV:CAC", ...scenarios.map((s) => s.metrics.ltvCacRatio)],
    ["Aylık ciro (USD)", ...scenarios.map((s) => s.metrics.monthlyRevenue)],
    ["ROAS %", ...scenarios.map((s) => s.metrics.roas)],
    ["ROI %", ...scenarios.map((s) => s.metrics.roi)],
    ["MRR (USD)", ...scenarios.map((s) => s.metrics.mrr)],
    ["ARR (USD)", ...scenarios.map((s) => s.metrics.arr)],
    ["Aylık kar (USD)", ...scenarios.map((s) => s.metrics.monthlyProfit)],
    ["Yıllık kar (USD)", ...scenarios.map((s) => s.metrics.yearlyProfit)],
    ["Kar marjı %", ...scenarios.map((s) => s.metrics.profitMargin)],
    ["Geri ödeme (ay)", ...scenarios.map((s) => s.metrics.paybackPeriodMonths)],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([comparisonHeader, ...comparisonRows]),
    "Senaryo Karşılaştırma"
  );

  const m = mid.metrics;
  const p = mid.price;
  const pc = inputs.productCost;
  const detailedSheet = [
    ["Hesaplama", "Açıklama / formül", "Sonuç"],
    [
      "Senaryo",
      "Önerilen (baz fiyat çarpanı 1.0)",
      mid.name,
    ],
    ["Liste fiyatı", "avgOrderValue × çarpan", p],
    ["Brüt kar", `${p} - ${pc}`, m.grossProfit],
    ["Brüt marj %", "(brüt kar / fiyat) × 100", m.grossMargin],
    ["LTV", "max(fiyat×ömür, fiyat×(1+tekrar)×ömür)", m.ltv],
    ["Toplam pazarlama", "reklam + müşteri × müşteri başı paz.", m.totalMarketingCost],
    ["CAC", "toplam pazarlama / müşteri", m.cac],
    ["Aylık ciro", "müşteri × fiyat", m.monthlyRevenue],
    ["Aylık kar", "ciro − tüm maliyetler", m.monthlyProfit],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(detailedSheet),
    "Önerilen Detay"
  );

  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as BlobPart;
  downloadBlob(
    out,
    "ana-hesaplayici.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}
