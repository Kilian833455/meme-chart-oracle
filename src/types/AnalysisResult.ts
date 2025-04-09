
export interface AnalysisResult {
  id: string;
  imageData: string;
  scenario: string;
  confidence: number;
  timestamp: number;
  trend: "up" | "down" | "sideways";
  explanation: string;  // Add explanation field
  labels?: string[];    // Add detected labels for transparency
}
