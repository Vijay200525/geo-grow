import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Filter, MapPin } from "lucide-react";
import { BUSINESS_TYPES } from "@/types/hotspot";

import { BusinessType } from "@/types/hotspot";

interface FilterSidebarProps {
  selectedTypes: BusinessType[];
  radius: number;
  maxHotspots: number;
  onTypesChange: (types: BusinessType[]) => void;
  onRadiusChange: (radius: number) => void;
  onMaxHotspotsChange: (max: number) => void;
  onApplyFilters: () => void;
  currentLocation: string;
}

export const FilterSidebar = ({
  selectedTypes,
  radius,
  maxHotspots,
  onTypesChange,
  onRadiusChange,
  onMaxHotspotsChange,
  onApplyFilters,
  currentLocation
}: FilterSidebarProps) => {
  const [localRadius, setLocalRadius] = useState(radius);
  const [localMaxHotspots, setLocalMaxHotspots] = useState(maxHotspots);

  const handleTypeToggle = (type: BusinessType) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypesChange(updated);
  };

  const handleApply = () => {
    onRadiusChange(localRadius);
    onMaxHotspotsChange(localMaxHotspots);
    onApplyFilters();
  };

  return (
    <div className="w-80 h-full bg-card border-r border-border overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Current Location */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-map-accent" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{currentLocation}</p>
          </CardContent>
        </Card>

        {/* Shop Types Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Business Types
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {BUSINESS_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeToggle(type)}
                />
                <Label
                  htmlFor={type}
                  className="text-sm font-normal cursor-pointer"
                >
                  {type}
                </Label>
              </div>
            ))}
            
            <Separator className="my-3" />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTypesChange([...BUSINESS_TYPES])}
                className="flex-1"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTypesChange([])}
                className="flex-1"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Parameters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Search Parameters</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div>
              <Label htmlFor="radius" className="text-sm">
                Search Radius (km)
              </Label>
              <Input
                id="radius"
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={localRadius}
                onChange={(e) => setLocalRadius(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="maxHotspots" className="text-sm">
                Max Hotspots to Show
              </Label>
              <Input
                id="maxHotspots"
                type="number"
                min="1"
                max="100"
                value={localMaxHotspots}
                onChange={(e) => setLocalMaxHotspots(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Apply Button */}
        <Button 
          onClick={handleApply}
          className="w-full"
          size="lg"
        >
          Apply Filters
        </Button>

        {/* Filter Summary */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Selected: {selectedTypes.length} business types</p>
              <p>Radius: {localRadius} km</p>
              <p>Max results: {localMaxHotspots}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};