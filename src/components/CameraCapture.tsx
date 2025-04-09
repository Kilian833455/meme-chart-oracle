
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onImageCapture: (imageData: string | null) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      // First check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in your browser");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for the video to be loaded and play it
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.error("Error playing video:", err);
              setCameraError("Failed to start video stream");
            });
          }
        };
      }
      
      setIsCameraActive(true);
      setCapturedImage(null);
      setHasCameraPermission(true);
      onImageCapture(null);
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      setCameraError("Unable to access camera. Please check browser permissions or try uploading an image instead.");
      
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check browser permissions or try uploading an image instead.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    try {
      const canvas = document.createElement("canvas");
      const video = videoRef.current;
      
      // Set canvas dimensions to match the video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.85);
        setCapturedImage(imageData);
        onImageCapture(imageData);
        stopCamera();
        
        toast({
          title: "Image Captured",
          description: "Chart image captured successfully",
        });
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      toast({
        title: "Capture Error",
        description: "Failed to capture image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCapturedImage(imageData);
        onImageCapture(imageData);
        
        toast({
          title: "Image Uploaded",
          description: "Chart image uploaded successfully",
        });
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
            {cameraError && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                <p>{cameraError}</p>
                <Button 
                  onClick={() => setIsCameraActive(false)} 
                  variant="outline"
                  className="mt-3 border-white text-white hover:bg-white/20"
                >
                  Go Back
                </Button>
              </div>
            )}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button 
                onClick={captureImage} 
                size="lg" 
                className="rounded-full w-16 h-16 bg-white border-4 border-oracle-300 hover:bg-oracle-100"
                disabled={!!cameraError}
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
