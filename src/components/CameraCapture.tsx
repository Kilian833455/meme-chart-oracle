
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onImageCapture: (imageData: string | null) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsCameraActive(true);
      setCapturedImage(null);
      onImageCapture(null);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);
      onImageCapture(imageData);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCapturedImage(imageData);
        onImageCapture(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const resetCapture = () => {
    setCapturedImage(null);
    onImageCapture(null);
  };

  return (
    <Card className="shadow-lg border border-oracle-200 overflow-hidden">
      <CardContent className="p-0">
        {isCameraActive ? (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button 
                onClick={captureImage} 
                size="lg" 
                className="rounded-full w-16 h-16 bg-white border-4 border-oracle-300 hover:bg-oracle-100"
              >
                <Camera className="h-8 w-8 text-oracle-500" />
              </Button>
            </div>
          </div>
        ) : capturedImage ? (
          <div className="relative">
            <img
              src={capturedImage}
              alt="Captured Chart"
              className="w-full h-[300px] object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/30 hover:bg-black/50"
              onClick={resetCapture}
            >
              <RefreshCw className="h-4 w-4 text-white" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] bg-muted/30 p-6 text-center">
            <div className="mb-6 text-muted-foreground">
              <p className="mb-4">Take a photo of a meme coin chart or upload an image</p>
              <div className="flex flex-row gap-4 justify-center">
                <Button onClick={startCamera} className="bg-oracle-400 hover:bg-oracle-500">
                  <Camera className="mr-2 h-4 w-4" /> Open Camera
                </Button>
                <Button onClick={triggerFileUpload} variant="outline" className="border-oracle-300">
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
