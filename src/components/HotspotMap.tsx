import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign } from "lucide-react";
import { Hotspot } from '@/data/mockHotspots';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';

interface HotspotMapProps {
  hotspots: Hotspot[];
  center: [number, number];
  zoom: number;
}

const getHotspotColor = (intensity: string) => {
  switch (intensity) {
    case 'high': return '#f59e0b';
    case 'medium': return '#f97316';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
};

const getHotspotRadius = (intensity: string) => {
  switch (intensity) {
    case 'high': return 15;
    case 'medium': return 12;
    case 'low': return 9;
    default: return 8;
  }
};

export const HotspotMap = ({ hotspots, center, zoom }: HotspotMapProps) => {
  const mapRef = useRef<any>(null);
  const [mapKey, setMapKey] = useState(0);
  
  // Force re-render when center changes to avoid React 18 double render issues
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [center[0], center[1]]);
  
  return (
    <div className="flex-1 h-full relative">
      <div key={mapKey} style={{ height: '100%', width: '100%' }}>
        <MapContainer
          ref={mapRef}
          center={center as LatLngExpression}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
          whenReady={() => {
            // Ensure map is properly initialized
            if (mapRef.current) {
              setTimeout(() => {
                mapRef.current.invalidateSize();
              }, 100);
            }
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {hotspots.map((hotspot) => (
            <CircleMarker
              key={hotspot.id}
              center={[hotspot.lat, hotspot.lng] as LatLngExpression}
              radius={getHotspotRadius(hotspot.intensity)}
              pathOptions={{
                fillColor: getHotspotColor(hotspot.intensity),
                color: "#ffffff",
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.7
              }}
            >
              <Popup>
                <div className="w-80">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{hotspot.address}</CardTitle>
                        <Badge 
                          variant={hotspot.intensity === 'high' ? 'default' : hotspot.intensity === 'medium' ? 'secondary' : 'outline'}
                          className="ml-2"
                        >
                          {hotspot.intensity}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1 text-accent" />
                          Score
                        </span>
                        <span className="font-semibold">{hotspot.score}/100</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-map-accent" />
                          Daily Traffic
                        </span>
                        <span className="font-semibold">{hotspot.footTraffic.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-success" />
                          Avg Rent
                        </span>
                        <span className="font-semibold">${hotspot.avgRent.toLocaleString()}/mo</span>
                      </div>
                      
                      <div className="border-t pt-2">
                        <p className="text-xs text-muted-foreground mb-1">Suitable for:</p>
                        <div className="flex flex-wrap gap-1">
                          {hotspot.shopTypes.slice(0, 3).map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                          {hotspot.shopTypes.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{hotspot.shopTypes.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-t pt-2 text-xs text-muted-foreground">
                        <div className="grid grid-cols-2 gap-2">
                          <div>Avg Age: {hotspot.demographics.avgAge}</div>
                          <div>Avg Income: ${hotspot.demographics.avgIncome.toLocaleString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      
      {/* Legend */}
      <Card className="absolute top-4 right-4 z-[1000] bg-card/95 backdrop-blur">
        <CardContent className="p-3">
          <h4 className="text-sm font-semibold mb-2">Hotspot Intensity</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#f59e0b' }}></div>
              High (90-100)
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#f97316' }}></div>
              Medium (70-89)
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#10b981' }}></div>
              Low (50-69)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};