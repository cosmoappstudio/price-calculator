import type { SimplePriceInputs, SimplePriceScenario } from "@/types";

export function calculateBreakEven(inputs: SimplePriceInputs): number {
  const u = Math.max(1, inputs.targetUsers);
  const fixedPerUser = inputs.fixedCostsMonthly / u;
  return fixedPerUser + inputs.variableCostPerUser;
}

export function calculatePrice(inputs: SimplePriceInputs, profitMargin: number): number {
  const breakEven = calculateBreakEven(inputs);
  const price = breakEven * (1 + profitMargin);
  return Math.ceil(price);
}

export function generateScenarios(inputs: SimplePriceInputs): SimplePriceScenario[] {
  const scenarios = [
    { name: "Minimum", description: "Başa baş + az kar", margin: 0.3 },
    { name: "İdeal", description: "Sağlıklı büyüme", margin: 0.5 },
    { name: "Maksimize", description: "Yüksek karlılık", margin: 0.7 },
  ];

  const breakEven = calculateBreakEven(inputs);
  const users = Math.max(1, inputs.targetUsers);

  return scenarios.map((s) => {
    const price = calculatePrice(inputs, s.margin);
    const unitProfit = price - breakEven;
    const monthlyProfit = unitProfit * users;
    const profitMarginPercent = price > 0 ? (unitProfit / price) * 100 : 0;
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
};
