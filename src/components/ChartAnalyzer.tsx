
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ChartLine, BrainCircuit, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { chartAnalysisService, chartPatterns } from "@/utils/chartAnalysisService";

interface ChartAnalyzerProps {
  imageData: string | null;
  onSaveResult: (result: AnalysisResult) => void;
}

export interface AnalysisResult {
  id: string;
  imageData: string;
  scenario: string;
  confidence: number;
  timestamp: number;
  trend: "up" | "down" | "sideways";
}

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

  const getTrendIcon = (trend: "up" | "down" | "sideways") => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-6 w-6 text-green-500" />;
      case "down":
        return <ArrowDown className="h-6 w-6 text-red-500" />;
      default:
        return <ChartLine className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getScenarioDescription = (scenarioName: string) => {
    const scenario = chartPatterns.find(s => s.name === scenarioName);
    return scenario?.description || "";
  };

  return (
    <div className="mt-6">
      {!analysisResult ? (
        isAnalyzing ? (
          <Card className="border border-oracle-200 shadow-lg animate-pulse">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative w-24 h-24">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/lovable-uploads/1d9a95a2-42a4-4884-8297-1968d1893ad6.png" alt="MEMEPUS" />
                    <AvatarFallback className="bg-oracle-300 text-white text-3xl">M</AvatarFallback>
                  </Avatar>
                  <motion.div
                    className="absolute top-0 right-0"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <Sparkles className="h-8 w-8 text-yellow-400" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium flex items-center justify-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-oracle-400" />
                    MEMEPUS is thinking{thinkingDots}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {modelStatus}
                  </p>
                </div>
                
                <div className="w-full max-w-xs mx-auto">
                  <div className="h-2 bg-oracle-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-oracle-400"
                      animate={{
                        width: ["0%", "100%", "0%"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={analyzeChart}
            disabled={!imageData}
            className="w-full py-6 text-lg bg-oracle-400 hover:bg-oracle-500 transition-all"
          >
            Analyze Chart with MEMEPUS AI
          </Button>
        )
      ) : (
        <Card className="border border-oracle-200 shadow-lg animate-pulse-glow">
          <CardHeader className="bg-gradient-to-r from-oracle-300/20 to-oracle-400/10">
            <CardTitle className="flex items-center gap-2">
              <Avatar className="w-6 h-6 mr-1">
                <AvatarImage src="/lovable-uploads/1d9a95a2-42a4-4884-8297-1968d1893ad6.png" alt="MEMEPUS" />
                <AvatarFallback className="bg-oracle-300 text-white text-xs">M</AvatarFallback>
              </Avatar>
              <span className="text-oracle-600">MEMEPUS thinks:</span> {getTrendIcon(analysisResult.trend)} {analysisResult.scenario}
            </CardTitle>
            <CardDescription>
              {getScenarioDescription(analysisResult.scenario)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <div className="flex items-center">
                <div className="h-3 w-24 bg-gray-200 rounded-full overflow-hidden mr-2">
                  <div
                    className="h-full bg-oracle-400"
                    style={{ width: `${analysisResult.confidence}%` }}
                  ></div>
                </div>
                <span className="font-medium">{analysisResult.confidence}%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveResult} className="w-full bg-oracle-400 hover:bg-oracle-500">
              Save Analysis
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ChartAnalyzer;
