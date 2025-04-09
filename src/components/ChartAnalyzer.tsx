
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { chartAnalysisService } from "@/utils/chartAnalysisService";
import { AnalysisResult } from "@/types/AnalysisResult";

// Import our components
import AnalysisButton from "@/components/chart-analyzer/AnalysisButton";
import AnalysisLoading from "@/components/chart-analyzer/AnalysisLoading";
import AnalysisResultComponent from "@/components/chart-analyzer/AnalysisResult";
import ApiKeyForm from "@/components/chart-analyzer/ApiKeyForm";

interface ChartAnalyzerProps {
  imageData: string | null;
  onSaveResult: (result: AnalysisResult) => void;
}

// Re-export the AnalysisResult type for backward compatibility
export type { AnalysisResult } from "@/types/AnalysisResult";

const ChartAnalyzer: React.FC<ChartAnalyzerProps> = ({ imageData, onSaveResult }) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [thinkingDots, setThinkingDots] = useState<string>("");
  const [modelStatus, setModelStatus] = useState<string>("");
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const { toast } = useToast();

  // Animate the thinking dots
  useEffect(() => {
    let dotsInterval: NodeJS.Timeout;
    
    if (isAnalyzing) {
      dotsInterval = setInterval(() => {
        setThinkingDots(prev => {
          if (prev.length >= 3) return "";
          return prev + ".";
        });
      }, 500);
    }
    
    return () => {
      if (dotsInterval) clearInterval(dotsInterval);
    };
  }, [isAnalyzing]);

  // Initialize ChatGPT service on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        setModelStatus("Checking for OpenAI API key...");
        const hasApiKey = await chartAnalysisService.initModel();
        setIsApiKeySet(hasApiKey);
        
        if (hasApiKey) {
          setModelStatus("ChatGPT ready");
        } else {
          setModelStatus("API key required");
        }
      } catch (error) {
        console.error("Error checking API key:", error);
        setModelStatus("Error checking API key");
        setIsApiKeySet(false);
      }
    };
    
    checkApiKey();
  }, []);

  const handleApiKeySet = () => {
    setIsApiKeySet(true);
    setModelStatus("ChatGPT ready");
  }

  const analyzeChart = async () => {
    if (!imageData) {
      toast({
        description: "Please capture or upload a chart image first",
      });
      return;
    }

    if (!isApiKeySet) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setModelStatus("Analyzing chart with ChatGPT...");

    try {
      // Use the ChatGPT service to analyze the chart
      const result = await chartAnalysisService.analyzeChartImage(imageData);
      
      setAnalysisResult(result);
      setModelStatus("Analysis complete");
      
      toast({
        title: "Analysis Complete",
        description: `MEMEPUS found: ${result.scenario}`,
      });
    } catch (error) {
      console.error("Error analyzing chart:", error);
      
      toast({
        title: "Analysis Error",
        description: "Failed to analyze chart. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveResult = () => {
    if (analysisResult) {
      onSaveResult(analysisResult);
      toast({
        description: "Analysis saved to history",
      });
    }
  };

  // Reset analysis result when image changes
  useEffect(() => {
    setAnalysisResult(null);
  }, [imageData]);

  // If API key is not set, show the API key form
  if (!isApiKeySet) {
    return (
      <div className="mt-6">
        <ApiKeyForm onApiKeySet={handleApiKeySet} />
      </div>
    );
  }

  return (
    <div className="mt-6">
      {!analysisResult ? (
        isAnalyzing ? (
          <AnalysisLoading 
            thinkingDots={thinkingDots}
            modelStatus={modelStatus} 
          />
        ) : (
          <AnalysisButton 
            onClick={analyzeChart}
            disabled={!imageData}
          />
        )
      ) : (
        <AnalysisResultComponent
          result={analysisResult}
          onSave={saveResult}
        />
      )}
    </div>
  );
};

export default ChartAnalyzer;
