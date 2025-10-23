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
      // Determine intensity based on score
      const getIntensity = (score: number): 'high' | 'medium' | 'low' => {
        if (score >= 900) return 'high';
        if (score >= 700) return 'medium';
        return 'low';
      };

      const intensity = getIntensity(hotspot.score);

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
        <div style="padding: 12px; min-width: 220px; font-family: system-ui;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <h4 style="font-weight: 600; font-size: 14px; margin: 0; color: #1f2937;">${hotspot.businessType}</h4>
            <span style="background: ${intensity === 'high' ? '#1f2937' : intensity === 'medium' ? '#374151' : 'transparent'}; 
                         color: ${intensity === 'high' ? 'white' : intensity === 'medium' ? 'white' : '#374151'}; 
                         border: ${intensity === 'low' ? '1px solid #d1d5db' : 'none'};
                         padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px;">
              ${intensity}
            </span>
          </div>
          
          <div style="background: #f9fafb; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 6px; font-size: 12px;">
              <span style="color: #6b7280; font-weight: 500;">Cell ID:</span>
              <span style="color: #1f2937; font-weight: 600;">${hotspot.id}</span>
              
              <span style="color: #6b7280; font-weight: 500;">Score:</span>
              <span style="color: #1f2937; font-weight: 600;">${hotspot.score.toFixed(1)} / 1000</span>
              
              <span style="color: #6b7280; font-weight: 500;">Rank:</span>
              <span style="color: #1f2937; font-weight: 600;">#${hotspot.rank}</span>
            </div>
          </div>
          
          <div style="font-size: 11px; color: #6b7280;">
            <span>📍 ${hotspot.lat.toFixed(4)}, ${hotspot.lng.toFixed(4)}</span>
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
          <h4 className="text-sm font-semibold mb-2">Score Range</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
              High (900-1000)
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-amber-500"></div>
              Medium (700-899)
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2 bg-emerald-500"></div>
              Low (&lt;700)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};