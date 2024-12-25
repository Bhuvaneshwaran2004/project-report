import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// Set worker source path
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface FinancialMetrics {
  revenue: string;
  netIncome: string;
  eps: string;
  peRatio: string;
}

export async function analyzePDF(file: File): Promise<FinancialMetrics> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(' ');
    }

    console.log('Extracted text:', fullText); // Debug log

    // More specific regex patterns for better accuracy
    const metrics = {
      revenue: extractMetric(fullText, [
        /revenue[:\s]+\$?([\d,]+(?:\.\d+)?)\s*(?:billion|million|B|M)/i,
        /total\s+revenue[:\s]+\$?([\d,]+(?:\.\d+)?)\s*(?:billion|million|B|M)/i
      ]),
      netIncome: extractMetric(fullText, [
        /net\s+income[:\s]+\$?([\d,]+(?:\.\d+)?)\s*(?:billion|million|B|M)/i,
        /net\s+profit[:\s]+\$?([\d,]+(?:\.\d+)?)\s*(?:billion|million|B|M)/i
      ]),
      eps: extractMetric(fullText, [
        /earnings\s+per\s+share[:\s]+\$?([\d,]+(?:\.\d+)?)/i,
        /EPS[:\s]+\$?([\d,]+(?:\.\d+)?)/i
      ]),
      peRatio: extractMetric(fullText, [
        /P\/E\s+ratio[:\s]+?([\d,]+(?:\.\d+)?)/i,
        /price[- ]to[- ]earnings[:\s]+?([\d,]+(?:\.\d+)?)/i
      ])
    };

    console.log('Extracted metrics:', metrics); // Debug log
    return formatMetrics(metrics);
  } catch (error) {
    console.error('PDF analysis error:', error);
    throw new Error('Failed to analyze PDF content');
  }
}

function extractMetric(text: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return '0';
}

function formatMetrics(rawMetrics: Record<string, string>): FinancialMetrics {
  const formatValue = (value: string): string => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return '$0';
    
    if (value.toLowerCase().includes('b')) {
      return `$${(num).toFixed(2)}B`;
    } else if (value.toLowerCase().includes('m')) {
      return `$${(num).toFixed(2)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  return {
    revenue: formatValue(rawMetrics.revenue),
    netIncome: formatValue(rawMetrics.netIncome),
    eps: `$${parseFloat(rawMetrics.eps) || 0}`,
    peRatio: `${parseFloat(rawMetrics.peRatio) || 0}`
  };
}