import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, MapPin } from "lucide-react";
import { Hotspot } from '@/data/mockHotspots';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {hotspots.map((hotspot) => (
          <Marker
            key={hotspot.id}
            position={[hotspot.lat, hotspot.lng]}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{hotspot.address}</h4>
                  <Badge 
                    variant={hotspot.intensity === 'high' ? 'default' : hotspot.intensity === 'medium' ? 'secondary' : 'outline'}
                    className="text-xs ml-2"
                  >
                    {hotspot.intensity}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
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
                
                <div className="flex flex-wrap gap-1">
                  {hotspot.shopTypes.slice(0, 3).map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
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