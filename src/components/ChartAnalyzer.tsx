
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { chartAnalysisService } from "@/utils/chartAnalysisService";
import { AnalysisResult } from "@/types/AnalysisResult";

// Import our new components
import AnalysisButton from "@/components/chart-analyzer/AnalysisButton";
import AnalysisLoading from "@/components/chart-analyzer/AnalysisLoading";
import AnalysisResultComponent from "@/components/chart-analyzer/AnalysisResult";

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

  // Initialize model on component mount
  useEffect(() => {
    const preloadModel = async () => {
      try {
        setModelStatus("Loading AI model...");
        await chartAnalysisService.initModel();
        setModelStatus("AI model ready");
      } catch (error) {
        console.error("Error preloading model:", error);
        setModelStatus("AI model failed to load");
      }
    };
    
    preloadModel();
  }, []);

  const analyzeChart = async () => {
    if (!imageData) {
      toast({
        description: "Please capture or upload a chart image first",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setModelStatus("Analyzing chart pattern...");

    try {
      // Use the AI service to analyze the chart
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
        description: "Failed to analyze chart. Please try again.",
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
