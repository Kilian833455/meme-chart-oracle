
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ChartLine, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const scenarioOptions = [
  { name: "Moon imminent", trend: "up", description: "Strong bullish pattern suggesting significant upward movement" },
  { name: "Pump and dump incoming", trend: "down", description: "Initial spike followed by steep decline" },
  { name: "Dead coin walking", trend: "down", description: "Downtrend that shows no signs of recovery" },
  { name: "Consolidation before rally", trend: "up", description: "Price stabilizing before upward movement" },
  { name: "Whale accumulation", trend: "sideways", description: "Large holders accumulating coins in a range" },
  { name: "Double bottom reversal", trend: "up", description: "Classic reversal pattern forming a bottom" },
];

const ChartAnalyzer: React.FC<ChartAnalyzerProps> = ({ imageData, onSaveResult }) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeChart = () => {
    if (!imageData) {
      toast({
        description: "Please capture or upload a chart image first",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate analysis with timeout
    setTimeout(() => {
      // Select a random scenario for demo purposes
      const randomScenario = scenarioOptions[Math.floor(Math.random() * scenarioOptions.length)];
      const confidence = Math.floor(65 + Math.random() * 35); // Random confidence between 65-99%
      
      const result: AnalysisResult = {
        id: `analysis-${Date.now()}`,
        imageData,
        scenario: randomScenario.name,
        confidence,
        timestamp: Date.now(),
        trend: randomScenario.trend,
      };

      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 2500);
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
    const scenario = scenarioOptions.find(s => s.name === scenarioName);
    return scenario?.description || "";
  };

  return (
    <div className="mt-6">
      {!analysisResult ? (
        <Button
          onClick={analyzeChart}
          disabled={!imageData || isAnalyzing}
          className="w-full py-6 text-lg bg-oracle-400 hover:bg-oracle-500 transition-all"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Chart...
            </>
          ) : (
            "Analyze Chart"
          )}
        </Button>
      ) : (
        <Card className="border border-oracle-200 shadow-lg animate-pulse-glow">
          <CardHeader className="bg-gradient-to-r from-oracle-300/20 to-oracle-400/10">
            <CardTitle className="flex items-center gap-2">
              {getTrendIcon(analysisResult.trend)} {analysisResult.scenario}
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
