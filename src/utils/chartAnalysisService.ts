import { AnalysisResult } from '@/types/AnalysisResult';

// Keep the chart patterns for reference and results formatting
export interface ChartPattern {
  name: string;
  trend: "up" | "down" | "sideways";
  description: string;
  keywords: string[];
  explanation: string;
}

export const chartPatterns: ChartPattern[] = [
  { 
    name: "Moon imminent", 
    trend: "up", 
    description: "Strong bullish pattern suggesting significant upward movement",
    keywords: ["uptrend", "bullish", "ascending", "green", "growth", "rise"],
    explanation: "The chart shows a strong uptrend with higher lows and higher highs. Volume is increasing on up moves, suggesting accumulation and growing buying pressure. This pattern often precedes significant price appreciation."
  },
  { 
    name: "Pump and dump incoming", 
    trend: "down", 
    description: "Initial spike followed by steep decline",
    keywords: ["volatility", "spike", "peak", "sharp", "sudden"],
    explanation: "I've identified a sharp vertical price movement without proper consolidation. These rapid moves up are typically unsustainable and often followed by equally rapid declines as early investors take profits."
  },
  { 
    name: "Dead coin walking", 
    trend: "down", 
    description: "Downtrend that shows no signs of recovery",
    keywords: ["downtrend", "bearish", "descending", "red", "falling", "decline"],
    explanation: "The chart displays a persistent downtrend with lower highs and lower lows. Trading volume is declining, suggesting waning interest as holders exit their positions."
  },
  { 
    name: "Consolidation before rally", 
    trend: "up", 
    description: "Price stabilizing before upward movement",
    keywords: ["consolidation", "base", "stability", "floor", "support"],
    explanation: "Price is trading in a narrowing range with decreasing volatility. This pattern of tight consolidation often precedes a significant move to the upside as sellers become exhausted."
  },
  { 
    name: "Whale accumulation", 
    trend: "sideways", 
    description: "Large holders accumulating coins in a range",
    keywords: ["accumulation", "sideways", "range", "flat", "horizontal"],
    explanation: "The price is moving sideways with occasional volume spikes. This suggests large holders are acquiring positions without driving the price up, preparing for a potential future move."
  },
  { 
    name: "Double bottom reversal", 
    trend: "up", 
    description: "Classic reversal pattern forming a bottom",
    keywords: ["reversal", "bottom", "support", "double", "w-shape"],
    explanation: "This classic W-shaped pattern shows price testing support twice and holding. The confirmation of this reversal suggests the downtrend has ended and a new uptrend may be beginning."
  },
];

// New ChatGPT-based chart analysis service
export class ChartAnalysisService {
  private apiKey: string | null = null;
  private isReady: boolean = false;

  // Get API key from localStorage or prompt the user
  async initModel(): Promise<boolean> {
    try {
      const savedApiKey = localStorage.getItem('openai_api_key');
      if (savedApiKey) {
        this.apiKey = savedApiKey;
        this.isReady = true;
        return true;
      }
      
      // If no API key is found, the user will need to provide one
      this.isReady = false;
      return false;
    } catch (error) {
      console.error('Error initializing ChatGPT service:', error);
      this.isReady = false;
      return false;
    }
  }

  // Set the API key
  setApiKey(key: string): void {
    if (key && key.trim() !== '') {
      this.apiKey = key;
      localStorage.setItem('openai_api_key', key);
      this.isReady = true;
    }
  }

  // Check if the API key is set
  isApiKeySet(): boolean {
    return this.isReady && !!this.apiKey;
  }

  // Clear the API key
  clearApiKey(): void {
    this.apiKey = null;
    localStorage.removeItem('openai_api_key');
    this.isReady = false;
  }

  // Analyze a chart image using ChatGPT's vision capabilities
  async analyzeChartImage(imageData: string): Promise<AnalysisResult> {
    if (!this.isApiKeySet()) {
      throw new Error('OpenAI API key is not set. Please set your API key first.');
    }

    try {
      console.log('Analyzing chart with ChatGPT...');
      
      // Prepare the request to the OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o", // Using GPT-4o for vision capabilities
          messages: [
            {
              role: "system",
              content: "You are a cryptocurrency chart analysis expert named MEMEPUS. Analyze the chart image and identify the most likely pattern from these options: 'Moon imminent', 'Pump and dump incoming', 'Dead coin walking', 'Consolidation before rally', 'Whale accumulation', 'Double bottom reversal'. Return a JSON object with the following properties: patternName (one of the above options), confidence (a number between 65-95), trend (up, down, or sideways), and explanation (your analysis in 2-3 sentences)."
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this cryptocurrency chart and tell me which pattern it most likely represents." },
                {
                  type: "image_url",
                  image_url: {
                    url: imageData
                  }
                }
              ]
            }
          ],
          max_tokens: 500,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('ChatGPT analysis result:', result);

      // Parse the response content to extract the analysis
      const content = result.choices[0]?.message?.content;
      let analysis;
      
      try {
        analysis = JSON.parse(content);
      } catch (e) {
        console.error('Error parsing ChatGPT JSON response:', e);
        throw new Error('Failed to parse the analysis result');
      }

      // Format the response to match our AnalysisResult interface
      return {
        id: `analysis-${Date.now()}`,
        imageData,
        scenario: analysis.patternName,
        confidence: analysis.confidence,
        timestamp: Date.now(),
        trend: analysis.trend,
        explanation: analysis.explanation
      };
    } catch (error) {
      console.error('Error analyzing chart image with ChatGPT:', error);
      
      // Fallback to a random pattern if analysis fails
      const fallbackPattern = chartPatterns[Math.floor(Math.random() * chartPatterns.length)];
      
      return {
        id: `analysis-${Date.now()}`,
        imageData,
        scenario: fallbackPattern.name,
        confidence: 65, // Lower confidence for fallback
        timestamp: Date.now(),
        trend: fallbackPattern.trend,
        explanation: "I had trouble connecting to the AI service. Please check your API key and internet connection and try again."
      };
    }
  }
}

// Create and export a singleton instance
export const chartAnalysisService = new ChartAnalysisService();
