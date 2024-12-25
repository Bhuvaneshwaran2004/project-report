import { extractTableData } from './textExtractor';
import { calculateFinancialRatios } from './ratioCalculator';
import type { FinancialMetrics } from '../types/financial';

export async function analyzeFinancials(pdf: any): Promise<FinancialMetrics> {
  const numPages = pdf.numPages;
  const financialData: Record<string, number> = {};
  
  // Extract data from income statement, balance sheet, and cash flow statement
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const tables = await extractTableData(page);
    
    // Process each table to identify financial statements and extract values
    tables.forEach(table => {
      // Add your logic to identify and extract specific financial metrics
      // This is a simplified example
      table.forEach(row => {
        if (row.toLowerCase().includes('revenue')) {
          const match = row.match(/[\d,]+\.?\d*/);
          if (match) {
            financialData.revenue = parseFloat(match[0].replace(/,/g, ''));
          }
        }
        // Add more metric extraction logic here
      });
    });
  }
  
  // Calculate financial ratios
  const ratios = calculateFinancialRatios(financialData);
  
  // Format and return the metrics
  return formatMetrics({ ...financialData, ...ratios });
}

function formatMetrics(data: Record<string, number>): FinancialMetrics {
  const formatValue = (value: number, isPercentage = false): string => {
    if (isNaN(value)) return 'N/A';
    if (isPercentage) return `${value.toFixed(2)}%`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  return {
    revenue: formatValue(data.revenue),
    netIncome: formatValue(data.netIncome),
    eps: formatValue(data.eps),
    peRatio: data.peRatio?.toFixed(2) || 'N/A',
    grossMargin: formatValue(data.grossMargin, true),
    operatingMargin: formatValue(data.operatingMargin, true),
    netProfitMargin: formatValue(data.netProfitMargin, true),
    currentRatio: data.currentRatio?.toFixed(2) || 'N/A',
    quickRatio: data.quickRatio?.toFixed(2) || 'N/A',
    debtToEquity: data.debtToEquity?.toFixed(2) || 'N/A',
    interestCoverage: data.interestCoverage?.toFixed(2) || 'N/A',
    assetTurnover: data.assetTurnover?.toFixed(2) || 'N/A',
    inventoryTurnover: data.inventoryTurnover?.toFixed(2) || 'N/A',
    operatingCashFlow: formatValue(data.operatingCashFlow),
    freeCashFlow: formatValue(data.freeCashFlow),
    revenueGrowth: formatValue(data.revenueGrowth, true),
    netIncomeGrowth: formatValue(data.netIncomeGrowth, true)
  };
}