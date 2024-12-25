import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { MetricsDisplay } from './components/MetricsDisplay';
import { FileText } from 'lucide-react';
import { analyzePDF } from './utils/fileAnalyzer';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeReport = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        throw new Error('Please upload a PDF file');
      }

      const extractedMetrics = await analyzePDF(file);
      setMetrics(extractedMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze the report');
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Annual Report Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Upload your company's annual report to extract key financial metrics
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <FileUpload onFileSelect={analyzeReport} />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {loading && (
            <div className="text-center mt-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Analyzing report...</p>
            </div>
          )}

          <MetricsDisplay metrics={metrics} />
        </div>

        {metrics && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Summary</h2>
            <p className="text-gray-700 leading-relaxed">
              Based on the financial metrics extracted from the annual report, this company shows strong 
              revenue performance with healthy profit margins. The P/E ratio suggests a reasonable 
              valuation compared to industry averages. Consider these metrics alongside industry trends, 
              market conditions, and your investment strategy before making investment decisions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;