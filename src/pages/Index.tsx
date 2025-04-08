
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import CameraCapture from "@/components/CameraCapture";
import ChartAnalyzer, { AnalysisResult } from "@/components/ChartAnalyzer";
import HistoryList from "@/components/HistoryList";

const Index = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  // Load history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem("analysisHistory");
    if (savedHistory) {
      try {
        setAnalysisHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error loading analysis history:", error);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("analysisHistory", JSON.stringify(analysisHistory));
  }, [analysisHistory]);

  const handleImageCapture = (imageData: string | null) => {
    setCapturedImage(imageData);
  };

  const handleSaveResult = (result: AnalysisResult) => {
    setAnalysisHistory((prev) => [result, ...prev]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setAnalysisHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <CameraCapture onImageCapture={handleImageCapture} />
        <ChartAnalyzer imageData={capturedImage} onSaveResult={handleSaveResult} />
        <HistoryList history={analysisHistory} onDeleteItem={handleDeleteHistoryItem} />
      </div>
    </Layout>
  );
};

export default Index;
