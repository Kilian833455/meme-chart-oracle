
export interface AnalysisResult {
  id: string;
  imageData: string;
  scenario: string;
  confidence: number;
  timestamp: number;
  trend: "up" | "down" | "sideways";
}
