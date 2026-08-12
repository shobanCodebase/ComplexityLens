import React, { useState } from 'react';
import { CodeEditorPanel } from './CodeEditorPanel';
import { AnalysisPanel } from './AnalysisPanel';
import { analyzeCode } from '../../api/analyzeApi';

export const AnalyzerLayout = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeCode(code, language, 1000);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden bg-[#0d0f17]">
      <div className="lg:col-span-7 h-full min-h-[420px]">
        <CodeEditorPanel
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />
      </div>
      <div className="lg:col-span-5 h-full min-h-[420px]">
        <AnalysisPanel
          result={analysisResult}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </main>
  );
};