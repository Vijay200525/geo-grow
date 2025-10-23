import { useState, useEffect } from "react";
import { FilterSidebar } from "./FilterSidebar";
import { HotspotMap } from "./HotspotMap";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { Hotspot, BusinessType } from "@/types/hotspot";
import { fetchHotspotsByFilters } from "@/services/hotspotService";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  userLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  onBack: () => void;
  onChangeLocation: () => void;
}

export const Dashboard = ({ userLocation, onBack, onChangeLocation }: DashboardProps) => {
  const [selectedTypes, setSelectedTypes] = useState<BusinessType[]>([]);
  const [radius, setRadius] = useState(5);
  const [maxHotspots, setMaxHotspots] = useState(20);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Don't load initial hotspots - require user to select types first

  const handleApplyFilters = async () => {
    // Validate that at least one business type is selected
    if (selectedTypes.length === 0) {
      toast({
        title: "No business type selected",
        description: "Please select at least one business type to view hotspots.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const filteredHotspots = await fetchHotspotsByFilters(
        userLocation.lat,
        userLocation.lng,
        radius,
        selectedTypes,
        maxHotspots
      );
      
      setHotspots(filteredHotspots);
      
      toast({
        title: "Hotspots updated",
        description: `Found ${filteredHotspots.length} hotspots matching your criteria.`,
      });
    } catch (error) {
      console.error("Error fetching hotspots:", error);
      toast({
        title: "Error",
        description: "Failed to load hotspots. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <FilterSidebar
        selectedTypes={selectedTypes}
        radius={radius}
        maxHotspots={maxHotspots}
        onTypesChange={setSelectedTypes}
        onRadiusChange={setRadius}
        onMaxHotspotsChange={setMaxHotspots}
        onApplyFilters={handleApplyFilters}
        currentLocation={userLocation.address}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Business Hotspot Analysis</h1>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading hotspots..." : `Showing ${hotspots.length} hotspots`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">Location</p>
              <p className="text-xs text-muted-foreground">{userLocation.address}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onChangeLocation}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Change
            </Button>
          </div>
        </header>
        
        {/* Map */}
        <div className="flex-1 p-4">
          <div className="h-full relative">
            <HotspotMap
              hotspots={hotspots}
              center={[userLocation.lat, userLocation.lng]}
              zoom={13}
            />
            
            {isLoading && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-[1001]">
                <div className="bg-card p-6 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-sm font-medium">Analyzing hotspots...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};