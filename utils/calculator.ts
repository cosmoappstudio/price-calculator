import type { CalculatorInputs, CalculatorMetrics, PriceScenarioResult } from "@/types";

export const PRICE_SCENARIOS = [
  { name: "Konservatif", multiplier: 0.9 },
  { name: "Önerilen", multiplier: 1.0 },
  { name: "Agresif", multiplier: 1.1 },
] as const;

/** Oran 1’den büyükse yüzde kabul et (örn. 30 → 0.3) */
function clampRate(raw: number): number {
  if (raw > 1.5) return Math.min(1, raw / 100);
  return Math.max(0, Math.min(1, raw));
}

export function computeScenarioMetrics(
  inputs: CalculatorInputs,
  scenarioMultiplier: number
): CalculatorMetrics {
  const customers = Math.max(0, inputs.monthlyCustomers);
  const basePrice = Math.max(0, inputs.avgOrderValue);
  const price = Math.max(0, basePrice * scenarioMultiplier);
  const pc = Math.max(0, inputs.productCost);
  const lifetime = Math.max(0.01, inputs.customerLifetimeMonths);
  const repeat = clampRate(inputs.repeatPurchaseRate);
  const adSpend = Math.max(0, inputs.adSpendMonthly);
  const mkPerCust = Math.max(0, inputs.marketingCostPerCustomer);
  const opCost = Math.max(0, inputs.operationalCostMonthly);

  const grossProfit = price - pc;
  const grossMargin = price > 0 ? (grossProfit / price) * 100 : 0;

  const ltvSimple = price * lifetime;
  const ltvWithRepeat = price * (1 + repeat) * lifetime;
  const ltv = Math.max(ltvSimple, ltvWithRepeat);

  const totalMarketingCost = adSpend + customers * mkPerCust;
  const cac = customers > 0 ? totalMarketingCost / customers : 0;
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;

  const monthlyRevenue = customers * price;
  const roas = adSpend > 0 ? (monthlyRevenue / adSpend) * 100 : 0;

  const totalCosts = customers * pc + opCost + totalMarketingCost;
  const monthlyProfit = monthlyRevenue - totalCosts;

  const totalInvestment = totalMarketingCost + opCost;
  const roi =
    totalInvestment > 0 ? ((monthlyProfit - totalInvestment) / totalInvestment) * 100 : 0;

  const mrr = customers * price * (repeat > 0 ? repeat : 1);
  const arr = mrr * 12;

  const yearlyProfit = monthlyProfit * 12;
  const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

  const profitPerCustomer = customers > 0 ? monthlyProfit / customers : 0;
  const paybackRaw =
    cac > 0 && profitPerCustomer > 0 ? cac / profitPerCustomer : 0;

  return {
    grossProfit,
    grossMargin,
    ltvSimple,
    ltvWithRepeat,
    ltv,
    totalMarketingCost,
    cac,
    ltvCacRatio,
    monthlyRevenue,
    roas,
    roi,
    mrr,
    arr,
    monthlyProfit,
    yearlyProfit,
    profitMargin,
    paybackPeriodMonths: Number.isFinite(paybackRaw) ? paybackRaw : 0,
  };
}

export function getLtvCacBadge(ratio: number): "success" | "warning" | "danger" {
  if (ratio >= 3) return "success";
  if (ratio >= 1) return "warning";
  return "danger";
}

export function getRoasBadge(roas: number): "success" | "warning" | "danger" {
  if (roas >= 300) return "success";
  if (roas >= 200) return "warning";
  return "danger";
}

export function getProfitMarginBadge(m: number): "success" | "warning" | "danger" {
  if (m >= 20) return "success";
  if (m >= 0) return "warning";
  return "danger";
}

export function buildScenarioResults(inputs: CalculatorInputs): PriceScenarioResult[] {
  return PRICE_SCENARIOS.map((s) => ({
    name: s.name,
    multiplier: s.multiplier,
    price: inputs.avgOrderValue * s.multiplier,
    metrics: computeScenarioMetrics(inputs, s.multiplier),
  }));
}

export const defaultCalculatorInputs: CalculatorInputs = {
  monthlyCustomers: 400,
  avgOrderValue: 199,
  customerLifetimeMonths: 12,
  repeatPurchaseRate: 1,
  productCost: 95,
  marketingCostPerCustomer: 12,
  operationalCostMonthly: 25_000,
  adSpendMonthly: 30_000,
};
