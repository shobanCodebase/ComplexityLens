import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { AnalyzerLayout } from './components/analyzer/AnalyzerLayout';
import { Footer } from './components/layout/Footer';

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0d0f17] text-slate-200">
      <Navbar />
      <AnalyzerLayout />
      <Footer />
    </div>
  );
}

export default App;
