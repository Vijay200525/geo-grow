import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationModalProps {
  isOpen: boolean;
  onLocationSet: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}

export const LocationModal = ({ isOpen, onLocationSet, onClose }: LocationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleAutoDetect = async () => {
    setIsLoading(true);
    
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // For demo, we'll use a default NYC address
          onLocationSet(latitude, longitude, "Current Location");
          setIsLoading(false);
          toast({
            title: "Location detected",
            description: "Using your current location for hotspot analysis.",
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to NYC coordinates
          onLocationSet(40.7589, -73.9851, "New York City, NY");
          setIsLoading(false);
          toast({
            title: "Using default location",
            description: "Couldn't detect your location. Using New York City as default.",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } catch (error) {
      console.error("Error getting location:", error);
      // Fallback to NYC coordinates
      onLocationSet(40.7589, -73.9851, "New York City, NY");
      setIsLoading(false);
      toast({
        title: "Using default location",
        description: "Using New York City as default location.",
      });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAddress.trim()) return;

    // For demo purposes, we'll use NYC coordinates for any manual address
    // In a real app, you'd geocode the address
    onLocationSet(40.7589, -73.9851, manualAddress);
    toast({
      title: "Location set",
      description: `Using "${manualAddress}" for hotspot analysis.`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-0 top-0 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center mb-2">
            <MapPin className="h-8 w-8 text-accent" />
          </div>
          <CardTitle>Set Your Location</CardTitle>
          <p className="text-sm text-muted-foreground">
            We need your location to find the best hotspots nearby
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Auto-detect section */}
          <div className="text-center">
            <Button 
              onClick={handleAutoDetect}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Auto-Detect Location
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Manual entry section */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <Label htmlFor="address">Enter Address Manually</Label>
              <Input
                id="address"
                type="text"
                placeholder="Enter city, address, or ZIP code"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button 
              type="submit" 
              variant="outline" 
              className="w-full"
              disabled={!manualAddress.trim()}
            >
              Use This Location
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};