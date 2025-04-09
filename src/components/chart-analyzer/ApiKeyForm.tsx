
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Key, Eye, EyeOff, ExternalLink } from "lucide-react";
import { chartAnalysisService } from "@/utils/chartAnalysisService";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyFormProps {
  onApiKeySet: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if API key already exists in localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Save the API key
      chartAnalysisService.setApiKey(apiKey);
      
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved successfully",
      });
      
      // Notify parent component
      onApiKeySet();
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <Card className="w-full border border-oracle-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-oracle-500" />
          OpenAI API Key Required
        </CardTitle>
        <CardDescription>
          To analyze charts with ChatGPT, please enter your OpenAI API key
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Alert className="mb-4 bg-oracle-50 border-oracle-200">
          <AlertDescription className="text-sm">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-oracle-500 mt-0.5" />
              <div>
                <p className="mb-2">Your API key is stored locally in your browser and never sent to our servers.</p>
                <p>
                  Don't have an API key?{" "}
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-oracle-500 hover:text-oracle-600 underline flex-inline items-center gap-1"
                  >
                    Get one from OpenAI
                    <ExternalLink className="h-3 w-3 inline ml-1" />
                  </a>
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Input
              type={showApiKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={toggleShowApiKey}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showApiKey ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-oracle-500 hover:bg-oracle-600"
          onClick={handleSubmit}
        >
          Save API Key
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyForm;
