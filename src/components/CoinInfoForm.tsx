
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export interface CoinInfo {
  id: string;
  name: string;
  symbol: string;
  description: string;
  website?: string;
  timestamp: number;
}

interface CoinInfoFormProps {
  onSubmit: (coinInfo: CoinInfo) => void;
}

const CoinInfoForm: React.FC<CoinInfoFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const { toast } = useToast();

  // Load form data from localStorage if available
  useEffect(() => {
    const savedFormData = localStorage.getItem("coin-form-data");
    if (savedFormData) {
      try {
        const data = JSON.parse(savedFormData);
        setName(data.name || "");
        setSymbol(data.symbol || "");
        setDescription(data.description || "");
        setWebsite(data.website || "");
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    const formData = { name, symbol, description, website };
    localStorage.setItem("coin-form-data", JSON.stringify(formData));
  }, [name, symbol, description, website]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !symbol) {
      toast({
        title: "Missing information",
        description: "Please provide at least the coin name and symbol",
        variant: "destructive",
      });
      return;
    }
    
    const newCoinInfo: CoinInfo = {
      id: `coin-${Date.now()}`,
      name,
      symbol,
      description,
      website: website || undefined,
      timestamp: Date.now(),
    };
    
    onSubmit(newCoinInfo);
    
    // Do not reset form, just show success toast
    toast({
      description: "Coin information added!",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add Coin Information (Optional)</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-left block" htmlFor="coin-name">
                Coin Name
              </label>
              <Input
                id="coin-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shiba Inu"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-left block" htmlFor="coin-symbol">
                Symbol
              </label>
              <Input
                id="coin-symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g. SHIB"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-left block" htmlFor="coin-description">
              Description
            </label>
            <Textarea
              id="coin-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description about the coin..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-left block" htmlFor="coin-website">
              Website (optional)
            </label>
            <Input
              id="coin-website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-oracle-400 hover:bg-oracle-500">
            Add Coin Info
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CoinInfoForm;
