export interface FinancialMetrics {
  // Basic Metrics
  revenue: string;
  netIncome: string;
  eps: string;
  peRatio: string;
  
  // Profitability Ratios
  grossMargin?: string;
  operatingMargin?: string;
  netProfitMargin?: string;
  
  // Liquidity Ratios
  currentRatio?: string;
  quickRatio?: string;
  
  // Debt Ratios
  debtToEquity?: string;
  interestCoverage?: string;
  
  // Efficiency Ratios
  assetTurnover?: string;
  inventoryTurnover?: string;
  
  // Cash Flow Metrics
  operatingCashFlow?: string;
  freeCashFlow?: string;
  
  // Growth Metrics
  revenueGrowth?: string;
  netIncomeGrowth?: string;
}