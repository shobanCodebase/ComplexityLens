import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { AnalyzerLayout } from './components/analyzer/AnalyzerLayout';
import { Footer } from './components/layout/Footer';
import { analyzeAlgorithm, checkBackendHealth } from './services/api';

const DEFAULT_PYTHON_CODE = `# Linear Time Algorithm O(n)
def find_element(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`;

function App() {
  const [code, setCode] = useState(DEFAULT_PYTHON_CODE);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [inputSize, setInputSize] = useState(1000);
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);

  // Poll backend health status
  useEffect(() => {
    let isMounted = true;
    const verifyHealth = async () => {
      const healthy = await checkBackendHealth();
      if (isMounted) setBackendOnline(healthy);
    };

    verifyHealth();
    const interval = setInterval(verifyHealth, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeAlgorithm(code, selectedLanguage, inputSize);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Failed to analyze code:', err);
      setError(`Backend connection error: Could not reach FastAPI at http://localhost:8000. Ensure server is running.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_PYTHON_CODE);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0d0f17] text-slate-200">
      <Navbar
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
        onReset={handleReset}
        backendOnline={backendOnline}
      />
      <AnalyzerLayout
        code={code}
        setCode={setCode}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        inputSize={inputSize}
        setInputSize={setInputSize}
        onAnalyze={handleAnalyze}
        analysisResult={analysisResult}
        isAnalyzing={isAnalyzing}
        error={error}
      />
      <Footer />
    </div>
  );
}

export default App;
