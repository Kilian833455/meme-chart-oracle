
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ChartLine } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { chartPatterns } from "@/utils/chartAnalysisService";
import { AnalysisResult as AnalysisResultType } from "@/types/AnalysisResult";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AnalysisResultProps {
  result: AnalysisResultType;
  onSave: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onSave }) => {
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
    <Card className="border border-oracle-200 shadow-lg animate-pulse-glow">
      <CardHeader className="bg-gradient-to-r from-oracle-300/20 to-oracle-400/10">
        <CardTitle className="flex items-center gap-2">
          <Avatar className="w-6 h-6 mr-1">
            <AvatarImage src="/lovable-uploads/1d9a95a2-42a4-4884-8297-1968d1893ad6.png" alt="MEMEPUS" />
            <AvatarFallback className="bg-oracle-300 text-white text-xs">M</AvatarFallback>
          </Avatar>
          <span className="text-oracle-600">MEMEPUS thinks:</span> {getTrendIcon(result.trend)} {result.scenario}
        </CardTitle>
        <CardDescription>
          {getScenarioDescription(result.scenario)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Confidence:</span>
          <div className="flex items-center">
            <div className="h-3 w-24 bg-gray-200 rounded-full overflow-hidden mr-2">
              <div
                className="h-full bg-oracle-400"
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>
            <span className="font-medium">{result.confidence}%</span>
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="explanation">
            <AccordionTrigger className="text-sm font-medium text-oracle-600">
              Why MEMEPUS thinks this
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              <p className="text-muted-foreground">{result.explanation}</p>
              
              {result.labels && result.labels.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-muted-foreground">Detected elements:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {result.labels.slice(0, 5).map((label, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-oracle-100 text-oracle-600 rounded-full px-2 py-0.5"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} className="w-full bg-oracle-400 hover:bg-oracle-500">
          Save Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisResult;
