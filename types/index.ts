export interface CalculatorInputs {
  monthlyCustomers: number;
  avgOrderValue: number;
  customerLifetimeMonths: number;
  /** 0–1 veya yüzde girişi; form yüzde kabul edip içeride böler */
  repeatPurchaseRate: number;
  productCost: number;
  marketingCostPerCustomer: number;
  operationalCostMonthly: number;
  adSpendMonthly: number;
}

export interface CalculatorMetrics {
  grossProfit: number;
  grossMargin: number;
  ltvSimple: number;
  ltvWithRepeat: number;
  ltv: number;
  totalMarketingCost: number;
  cac: number;
  ltvCacRatio: number;
  monthlyRevenue: number;
  roas: number;
  roi: number;
  mrr: number;
  arr: number;
  monthlyProfit: number;
  yearlyProfit: number;
  profitMargin: number;
  paybackPeriodMonths: number;
}

export interface PriceScenarioResult {
  name: string;
  multiplier: number;
  price: number;
  metrics: CalculatorMetrics;
}

export interface SimplePriceInputs {
  fixedCostsMonthly: number;
  variableCostPerUser: number;
  targetUsers: number;
  /** App Store / Play Store vb. — liste fiyatı üzerinden % */
  appStoreCommissionPercent: number;
  /** Ödeme sağlayıcı (Stripe vb.) — liste fiyatı üzerinden yaklaşık % */
  paymentProviderCommissionPercent: number;
  /** Vergi / KDV vb. etkin kesinti — liste fiyatı üzerinden yaklaşık % */
  salesTaxPercent: number;
}

export interface SimplePriceScenario {
  name: string;
  description: string;
  profitMargin: number;
  price: number;
  monthlyProfit: number;
  yearlyProfit: number;
  profitMarginPercent: number;
}
