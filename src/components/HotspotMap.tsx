import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from "@/components/ui/card";
import { Hotspot } from '@/types/hotspot';

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
  const clearMarkers = useCallback(() => {
    markers.current.forEach(marker => map.current?.removeLayer(marker));
    markers.current = [];
  }, []);

  // Create hotspot markers
  const createMarkers = useCallback(() => {
    clearMarkers();
    
    hotspots.forEach((hotspot) => {
      // Determine intensity based on rank
      const getIntensity = (rank: number): 'high' | 'medium' | 'low' => {
        if (rank >= 1 && rank <= 97) return 'high';
        if (rank >= 98 && rank <= 323) return 'medium';
        return 'low';
      };

      const intensity = getIntensity(hotspot.rank);

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
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: ${getMarkerColor(intensity)};
          opacity: 0.7;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        "></div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Create popup content
      const popupContent = `
        <div style="padding: 16px; min-width: 200px; font-family: system-ui; text-align: center;">
          <h4 style="font-weight: 600; font-size: 16px; margin: 0 0 12px 0; color: #1f2937;">${hotspot.businessType}</h4>
          
          <div style="background: ${getMarkerColor(intensity)}; padding: 12px; border-radius: 8px;">
            <div style="font-size: 14px; color: white; font-weight: 500; margin-bottom: 4px;">Rank</div>
            <div style="font-size: 32px; color: white; font-weight: 700;">#${hotspot.rank}</div>
          </div>
        </div>
      `;

      // Create marker
      const marker = L.marker([hotspot.lat, hotspot.lng], { icon: customIcon })
        .bindPopup(popupContent)
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [hotspots, clearMarkers]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Create Leaflet map with OpenStreetMap tiles
    map.current = L.map(mapContainer.current).setView([center[0], center[1]], zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map.current);

    return () => {
      clearMarkers();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [clearMarkers]);

  // Create markers when hotspots change
  useEffect(() => {
    if (!map.current) return;
    createMarkers();
  }, [createMarkers]);

  // Update map view when center or zoom changes
  useEffect(() => {
    if (!map.current) return;
    map.current.setView([center[0], center[1]], zoom);
  }, [center, zoom]);

  return (
    <div className="flex-1 h-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      {/* Legend */}
      <Card className="absolute top-4 right-4 z-[1000] bg-card/95 backdrop-blur">
        <CardContent className="p-3">
          <h4 className="text-sm font-semibold mb-2">Rank Range</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
              High (1-97)
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-amber-500"></div>
              Medium (98-323)
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-emerald-500"></div>
              Low (324-646)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};