
import React from "react";
import { AnalysisResult } from "@/types/AnalysisResult";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ChartLine, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface HistoryListProps {
  history: AnalysisResult[];
  onDeleteItem: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onDeleteItem }) => {
  if (history.length === 0) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTrendIcon = (trend: "up" | "down" | "sideways") => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-5 w-5 text-green-500" />;
      case "down":
        return <ArrowDown className="h-5 w-5 text-red-500" />;
      default:
        return <ChartLine className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-oracle-600">Analysis History</h2>
      <ScrollArea className="h-[300px] rounded-md border border-oracle-200">
        <div className="p-4 space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="border border-oracle-200">
              <CardHeader className="pb-2 flex flex-row items-start">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {getTrendIcon(item.trend)} {item.scenario}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" /> 
                    {formatDate(item.timestamp)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => onDeleteItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageData}
                      alt="Chart"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-muted-foreground mr-2">Confidence:</span>
                      <div className="flex items-center">
                        <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden mr-1">
                          <div
                            className="h-full bg-oracle-400"
                            style={{ width: `${item.confidence}%` }}
                          ></div>
                        </div>
                        <span>{item.confidence}%</span>
                      </div>
                    </div>

                    {item.explanation && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="explanation" className="border-b-0">
                          <AccordionTrigger className="text-xs py-1 text-oracle-600 hover:no-underline">
                            <span className="text-xs">View explanation</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-xs text-muted-foreground">
                            {item.explanation}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HistoryList;
