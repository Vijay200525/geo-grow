import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationModalProps {
  isOpen: boolean;
  onLocationSet: (lat: number, lng: number, address: string) => void;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

export const LocationModal = ({ isOpen, onLocationSet }: LocationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

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

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Filter out queries that look like zipcodes (5 digits or 5+4 format)
    if (/^\d{5}(-?\d{4})?$/.test(query.trim())) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsFetching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}&countrycodes=us&addressdetails=1&extratags=1`
      );
      
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data: LocationSuggestion[] = await response.json();
      
      // Filter to only include cities, towns, and addresses (not zipcodes or POIs)
      const filtered = data.filter(item => {
        const type = item.type;
        const displayName = item.display_name.toLowerCase();
        return (
          (type === 'city' || type === 'town' || type === 'village' || 
           type === 'suburb' || type === 'neighbourhood' || type === 'house') &&
          !displayName.includes('zip') &&
          !displayName.includes('postal')
        );
      });
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualAddress(value);
    
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    
    onLocationSet(lat, lng, suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
    
    toast({
      title: "Location set",
      description: `Using "${suggestion.display_name}" for hotspot analysis.`,
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAddress.trim()) return;

    // If there are suggestions, use the first one
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
      return;
    }

    // Otherwise, try to geocode manually
    fetchSuggestions(manualAddress);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
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
              <Label htmlFor="address">Enter Address or City</Label>
              <Input
                ref={inputRef}
                id="address"
                type="text"
                placeholder="Enter city or address (no zip codes)"
                value={manualAddress}
                onChange={handleInputChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="w-full"
              />
              
              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground text-sm border-b last:border-b-0"
                    >
                      {suggestion.display_name}
                    </button>
                  ))}
                </div>
              )}
              
              {isFetching && (
                <div className="absolute right-3 top-8 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
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