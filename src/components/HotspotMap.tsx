import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, MapPin, Key } from "lucide-react";
import { Hotspot } from '@/data/mockHotspots';

interface HotspotMapProps {
  hotspots: Hotspot[];
  center: [number, number];
  zoom: number;
}

export const HotspotMap = ({ hotspots, center, zoom }: HotspotMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [tokenError, setTokenError] = useState('');

  const handleSetToken = () => {
    if (!mapboxToken.trim()) {
      setTokenError('Please enter a valid Mapbox token');
      return;
    }
    
    if (!mapboxToken.startsWith('pk.')) {
      setTokenError('Mapbox public tokens should start with "pk."');
      return;
    }

    setTokenError('');
    setIsTokenSet(true);
    mapboxgl.accessToken = mapboxToken;
  };

  // Clear existing markers
  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  // Create hotspot markers
  const createMarkers = () => {
    clearMarkers();
    
    hotspots.forEach((hotspot) => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      // Set color based on intensity
      switch (hotspot.intensity) {
        case 'high':
          el.style.backgroundColor = '#ef4444'; // red-500
          break;
        case 'medium':
          el.style.backgroundColor = '#f59e0b'; // amber-500
          break;
        case 'low':
          el.style.backgroundColor = '#10b981'; // emerald-500
          break;
        default:
          el.style.backgroundColor = '#6b7280'; // gray-500
      }

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

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(popupContent);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([hotspot.lng, hotspot.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !isTokenSet) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [center[1], center[0]], // Mapbox uses [lng, lat]
      zoom: zoom,
      antialias: true
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      createMarkers();
    });

    return () => {
      clearMarkers();
      map.current?.remove();
    };
  }, [isTokenSet]);

  // Update map when props change
  useEffect(() => {
    if (!map.current || !isTokenSet) return;

    map.current.flyTo({
      center: [center[1], center[0]], // Mapbox uses [lng, lat]
      zoom: zoom,
      duration: 1000
    });

    createMarkers();
  }, [center, zoom, hotspots, isTokenSet]);

  if (!isTokenSet) {
    return (
      <div className="flex-1 h-full relative">
        <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Mapbox Setup Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To display the interactive map, please enter your Mapbox public token.
              </p>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="pk.your-mapbox-token-here..."
                  value={mapboxToken}
                  onChange={(e) => {
                    setMapboxToken(e.target.value);
                    setTokenError('');
                  }}
                  className="font-mono text-sm"
                />
                {tokenError && (
                  <p className="text-sm text-destructive">{tokenError}</p>
                )}
              </div>
              <Button onClick={handleSetToken} className="w-full">
                Initialize Map
              </Button>
              <div className="text-xs text-muted-foreground">
                <p>Get your free token at:</p>
                <a 
                  href="https://mapbox.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://mapbox.com/
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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