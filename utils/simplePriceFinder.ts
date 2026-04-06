import type { SimplePriceInputs, SimplePriceScenario } from "@/types";

/** Liste fiyatının size kalan net payı (0–1), kesintiler çarpım olarak uygulanır */
export function getNetRetentionFraction(inputs: SimplePriceInputs): number {
  const clampPct = (v: number) => Math.min(100, Math.max(0, Number.isFinite(v) ? v : 0));
  const a = clampPct(inputs.appStoreCommissionPercent);
  const p = clampPct(inputs.paymentProviderCommissionPercent);
  const t = clampPct(inputs.salesTaxPercent);
  const net = (1 - a / 100) * (1 - p / 100) * (1 - t / 100);
  return Math.max(net, 1e-9);
}

/** Kullanıcı başı maliyet (sabit + değişken); brüt fiyat değil */
export function calculateBreakEven(inputs: SimplePriceInputs): number {
  const u = Math.max(1, inputs.targetUsers);
  const fixedPerUser = inputs.fixedCostsMonthly / u;
  return fixedPerUser + inputs.variableCostPerUser;
}

/** Brüt liste fiyatı: net hedefi karşılamak için */
export function grossUpForNet(netAmount: number, inputs: SimplePriceInputs): number {
  return netAmount / getNetRetentionFraction(inputs);
}

/** Başa baş için gerekli brüt aylık liste fiyatı (yuvarlanmış) */
export function calculateGrossBreakEvenPrice(inputs: SimplePriceInputs): number {
  return Math.ceil(grossUpForNet(calculateBreakEven(inputs), inputs));
}

export function calculatePrice(inputs: SimplePriceInputs, profitMargin: number): number {
  const breakEven = calculateBreakEven(inputs);
  const netTarget = breakEven * (1 + profitMargin);
  return Math.ceil(grossUpForNet(netTarget, inputs));
}

export function generateScenarios(inputs: SimplePriceInputs): SimplePriceScenario[] {
  const scenarios = [
    { name: "Minimum", description: "Başa baş + az kar", margin: 0.3 },
    { name: "İdeal", description: "Sağlıklı büyüme", margin: 0.5 },
    { name: "Maksimize", description: "Yüksek karlılık", margin: 0.7 },
  ];

  const breakEven = calculateBreakEven(inputs);
  const netFrac = getNetRetentionFraction(inputs);
  const users = Math.max(1, inputs.targetUsers);

  return scenarios.map((s) => {
    const price = calculatePrice(inputs, s.margin);
    const netRevenuePerUser = price * netFrac;
    const unitNetProfit = netRevenuePerUser - breakEven;
    const monthlyProfit = unitNetProfit * users;
    const profitMarginPercent =
      netRevenuePerUser > 0 ? (unitNetProfit / netRevenuePerUser) * 100 : 0;
    return {
      name: s.name,
      description: s.description,
      profitMargin: s.margin,
      price,
      monthlyProfit,
      yearlyProfit: monthlyProfit * 12,
      profitMarginPercent,
    };
  });
}

export const defaultSimplePriceInputs: SimplePriceInputs = {
  fixedCostsMonthly: 190_000,
  variableCostPerUser: 60,
  targetUsers: 1000,
  appStoreCommissionPercent: 0,
  paymentProviderCommissionPercent: 0,
  salesTaxPercent: 0,
};
