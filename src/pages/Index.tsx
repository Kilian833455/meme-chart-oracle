
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import CameraCapture from "@/components/CameraCapture";
import ChartAnalyzer from "@/components/ChartAnalyzer";
import HistoryList from "@/components/HistoryList";
import AuthForm from "@/components/AuthForm";
import CoinInfoForm, { CoinInfo } from "@/components/CoinInfoForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AnalysisResult } from "@/types/AnalysisResult";

const Index = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [coinInfoHistory, setCoinInfoHistory] = useState<CoinInfo[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | undefined>();

  useEffect(() => {
    const savedHistory = localStorage.getItem("analysisHistory");
    if (savedHistory) {
      try {
        setAnalysisHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error loading analysis history:", error);
      }
    }
    
    const savedCoinInfo = localStorage.getItem("coinInfoHistory");
    if (savedCoinInfo) {
      try {
        setCoinInfoHistory(JSON.parse(savedCoinInfo));
      } catch (error) {
        console.error("Error loading coin info history:", error);
      }
    }
    
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setIsLoggedIn(true);
        setUsername(userData.username);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("analysisHistory", JSON.stringify(analysisHistory));
  }, [analysisHistory]);
  
  useEffect(() => {
    localStorage.setItem("coinInfoHistory", JSON.stringify(coinInfoHistory));
  }, [coinInfoHistory]);

  const handleImageCapture = (imageData: string | null) => {
    setCapturedImage(imageData);
  };

  const handleSaveResult = (result: AnalysisResult) => {
    setAnalysisHistory((prev) => [result, ...prev]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setAnalysisHistory((prev) => prev.filter((item) => item.id !== id));
  };
  
  const handleAddCoinInfo = (coinInfo: CoinInfo) => {
    setCoinInfoHistory((prev) => [coinInfo, ...prev]);
  };
  
  const handleAuthStateChange = (loggedIn: boolean, user?: string) => {
    setIsLoggedIn(loggedIn);
    setUsername(user);
    
    if (loggedIn && user) {
      localStorage.setItem("currentUser", JSON.stringify({ username: user }));
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername(undefined);
    localStorage.removeItem("currentUser");
  };
  
  if (!isLoggedIn) {
    return (
      <Layout>
        <AuthForm onAuthStateChange={handleAuthStateChange} />
      </Layout>
    );
  }

  return (
    <Layout username={username} onLogout={handleLogout}>
      <div className="space-y-6">
        <CameraCapture onImageCapture={handleImageCapture} />
        
        <ChartAnalyzer imageData={capturedImage} onSaveResult={handleSaveResult} />
        
        <Accordion type="single" collapsible className="mt-8">
          <AccordionItem value="coin-info">
            <AccordionTrigger className="text-oracle-600">
              Add Coin Information
            </AccordionTrigger>
            <AccordionContent>
              <CoinInfoForm onSubmit={handleAddCoinInfo} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <HistoryList history={analysisHistory} onDeleteItem={handleDeleteHistoryItem} />
      </div>
    </Layout>
  );
};

export default Index;
