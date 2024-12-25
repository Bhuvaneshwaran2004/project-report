export function calculateFinancialRatios(values: Record<string, number>) {
  return {
    // Profitability
    grossMargin: values.grossProfit / values.revenue * 100,
    operatingMargin: values.operatingIncome / values.revenue * 100,
    netProfitMargin: values.netIncome / values.revenue * 100,
    
    // Liquidity
    currentRatio: values.currentAssets / values.currentLiabilities,
    quickRatio: (values.currentAssets - values.inventory) / values.currentLiabilities,
    
    // Debt
    debtToEquity: values.totalDebt / values.shareholderEquity,
    interestCoverage: values.ebit / values.interestExpense,
    
    // Efficiency
    assetTurnover: values.revenue / values.totalAssets,
    inventoryTurnover: values.costOfGoodsSold / values.averageInventory,
    
    // Growth (requires previous year data)
    revenueGrowth: ((values.revenue - values.previousRevenue) / values.previousRevenue) * 100,
    netIncomeGrowth: ((values.netIncome - values.previousNetIncome) / values.previousNetIncome) * 100
  };
}