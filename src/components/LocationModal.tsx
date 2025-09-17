import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationModalProps {
  isOpen: boolean;
  onLocationSet: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}

export const LocationModal = ({ isOpen, onLocationSet, onClose }: LocationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  // Geocoding function using Nominatim API
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; display_name: string } | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=in&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          display_name: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Search for location suggestions
  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5`
      );
      const data = await response.json();
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (manualAddress) {
        searchLocations(manualAddress);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [manualAddress]);

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

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAddress.trim()) return;

    setIsGeocoding(true);
    setShowSuggestions(false);
    
    try {
      const result = await geocodeAddress(manualAddress);
      
      if (result) {
        onLocationSet(result.lat, result.lng, result.display_name);
        toast({
          title: "Location found",
          description: `Using "${result.display_name}" for hotspot analysis.`,
        });
      } else {
        // Fallback to Delhi coordinates for Indian locations
        onLocationSet(28.6139, 77.2090, manualAddress);
        toast({
          title: "Location set",
          description: `Using "${manualAddress}" with default Delhi coordinates.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      // Fallback to Delhi coordinates
      onLocationSet(28.6139, 77.2090, manualAddress);
      toast({
        title: "Location set",
        description: `Using "${manualAddress}" with default Delhi coordinates.`,
        variant: "destructive",
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    
    onLocationSet(lat, lng, suggestion.display_name);
    setShowSuggestions(false);
    setManualAddress("");
    
    toast({
      title: "Location selected",
      description: `Using "${suggestion.display_name}" for hotspot analysis.`,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualAddress(e.target.value);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
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
            <div className="relative">
              <Label htmlFor="address">Enter Address Manually</Label>
              <Input
                id="address"
                type="text"
                placeholder="Enter city, address, or PIN code"
                value={manualAddress}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full"
              />
              
              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground border-b border-border last:border-b-0"
                    >
                      {suggestion.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              variant="outline" 
              className="w-full"
              disabled={!manualAddress.trim() || isGeocoding}
            >
              {isGeocoding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding location...
                </>
              ) : (
                "Use This Location"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};