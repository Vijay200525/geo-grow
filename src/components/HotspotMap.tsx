import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, MapPin } from "lucide-react";
import { Hotspot } from '@/data/mockHotspots';

interface HotspotMapProps {
  hotspots: Hotspot[];
  center: [number, number];
  zoom: number;
}

const getHotspotColor = (intensity: string) => {
  switch (intensity) {
    case 'high': return 'bg-hotspot-high';
    case 'medium': return 'bg-hotspot-medium';
    case 'low': return 'bg-hotspot-low';
    default: return 'bg-muted';
  }
};

export const HotspotMap = ({ hotspots, center, zoom }: HotspotMapProps) => {
  return (
    <div className="flex-1 h-full relative">
      {/* Temporary placeholder - will replace with actual map once error is resolved */}
      <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
        <div className="text-center p-8">
          <MapPin className="h-16 w-16 text-map-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Interactive Map Loading...</h3>
          <p className="text-muted-foreground mb-4">
            Analyzing {hotspots.length} hotspots near {center[0].toFixed(4)}, {center[1].toFixed(4)}
          </p>
          <div className="text-sm text-muted-foreground">
            Zoom level: {zoom}
          </div>
        </div>
        
        {/* Show hotspots as floating cards */}
        <div className="absolute inset-4 overflow-y-auto space-y-2">
          {hotspots.slice(0, 3).map((hotspot, index) => (
            <Card key={hotspot.id} className="bg-card/90 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{hotspot.address}</h4>
                  <Badge 
                    variant={hotspot.intensity === 'high' ? 'default' : hotspot.intensity === 'medium' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {hotspot.intensity}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-accent" />
                    <span>{hotspot.score}/100</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1 text-map-accent" />
                    <span>{(hotspot.footTraffic / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1 text-success" />
                    <span>${(hotspot.avgRent / 1000).toFixed(0)}k</span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {hotspot.shopTypes.slice(0, 2).map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <Card className="absolute top-4 right-4 z-[1000] bg-card/95 backdrop-blur">
        <CardContent className="p-3">
          <h4 className="text-sm font-semibold mb-2">Hotspot Intensity</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-hotspot-high"></div>
              High (90-100)
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-hotspot-medium"></div>
              Medium (70-89)
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-hotspot-low"></div>
              Low (50-69)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};