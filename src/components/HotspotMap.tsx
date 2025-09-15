import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from "@/components/ui/card";
import { Hotspot } from '@/data/mockHotspots';

// Fix for default markers in Leaflet
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

export const HotspotMap = ({ hotspots, center, zoom }: HotspotMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);

  // Clear existing markers
  const clearMarkers = () => {
    markers.current.forEach(marker => map.current?.removeLayer(marker));
    markers.current = [];
  };

  // Create hotspot markers
  const createMarkers = () => {
    clearMarkers();
    
    hotspots.forEach((hotspot) => {
      // Create custom marker based on intensity
      const getMarkerColor = (intensity: string) => {
        switch (intensity) {
          case 'high': return '#ef4444'; // red-500
          case 'medium': return '#f59e0b'; // amber-500
          case 'low': return '#10b981'; // emerald-500
          default: return '#6b7280'; // gray-500
        }
      };

      const markerHtml = `
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: ${getMarkerColor(hotspot.intensity)};
          opacity: 0.7;
          border: 3px solid white;
          box-shadow: 0 3px 8px rgba(0,0,0,0.4);
          cursor: pointer;
        "></div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Create popup content
      const popupContent = `
        <div style="padding: 12px; min-width: 200px; font-family: system-ui;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <h4 style="font-weight: 500; font-size: 14px; margin: 0;">${hotspot.address}</h4>
            <span style="background: ${hotspot.intensity === 'high' ? '#1f2937' : hotspot.intensity === 'medium' ? '#374151' : 'transparent'}; 
                         color: ${hotspot.intensity === 'high' ? 'white' : hotspot.intensity === 'medium' ? 'white' : '#374151'}; 
                         border: ${hotspot.intensity === 'low' ? '1px solid #d1d5db' : 'none'};
                         padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px;">
              ${hotspot.intensity}
            </span>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 12px; margin-bottom: 8px;">
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 4px;">📈</span>
              <span>${hotspot.score}/100</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 4px;">👥</span>
              <span>${(hotspot.footTraffic / 1000).toFixed(0)}k</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 4px;">💰</span>
              <span>$${(hotspot.avgRent / 1000).toFixed(0)}k</span>
            </div>
          </div>
          
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${hotspot.shopTypes.slice(0, 3).map(type => 
              `<span style="background: #f3f4f6; color: #374151; padding: 2px 6px; border-radius: 4px; font-size: 11px; border: 1px solid #e5e7eb;">${type}</span>`
            ).join('')}
          </div>
        </div>
      `;

      // Create marker
      const marker = L.marker([hotspot.lat, hotspot.lng], { icon: customIcon })
        .bindPopup(popupContent)
        .addTo(map.current!);

      markers.current.push(marker);
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create Leaflet map with OpenStreetMap tiles
    map.current = L.map(mapContainer.current).setView([center[0], center[1]], zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map.current);

    // Create initial markers
    createMarkers();

    return () => {
      clearMarkers();
      map.current?.remove();
    };
  }, []);

  // Update map when props change
  useEffect(() => {
    if (!map.current) return;

    map.current.setView([center[0], center[1]], zoom);
    createMarkers();
  }, [center, zoom, hotspots]);

  return (
    <div className="flex-1 h-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      {/* Legend */}
      <Card className="absolute top-4 right-4 z-[1000] bg-card/95 backdrop-blur">
        <CardContent className="p-3">
          <h4 className="text-sm font-semibold mb-2">Hotspot Intensity</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
              High (90-100)
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-amber-500"></div>
              Medium (70-89)
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-emerald-500"></div>
              Low (50-69)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};