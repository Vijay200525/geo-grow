export interface Hotspot {
  id: string;
  lat: number;
  lng: number;
  intensity: 'high' | 'medium' | 'low';
  score: number;
  shopTypes: string[];
  address: string;
  footTraffic: number;
  avgRent: number;
  demographics: {
    avgAge: number;
    avgIncome: number;
    populationDensity: number;
  };
}

export const shopTypes = [
  'Restaurants',
  'Cafes',
  'Retail',
  'Grocery',
  'Health & Beauty',
  'Electronics',
  'Fitness',
  'Services'
];

// Mock hotspot data for different cities
export const mockHotspots: Hotspot[] = [
  {
    id: '1',
    lat: 40.7589,
    lng: -73.9851,
    intensity: 'high',
    score: 92,
    shopTypes: ['Restaurants', 'Cafes', 'Retail'],
    address: 'Times Square, NYC',
    footTraffic: 50000,
    avgRent: 15000,
    demographics: { avgAge: 32, avgIncome: 85000, populationDensity: 28000 }
  },
  {
    id: '2',
    lat: 40.7505,
    lng: -73.9934,
    intensity: 'high',
    score: 88,
    shopTypes: ['Restaurants', 'Health & Beauty', 'Services'],
    address: 'Chelsea Market, NYC',
    footTraffic: 35000,
    avgRent: 12000,
    demographics: { avgAge: 29, avgIncome: 95000, populationDensity: 25000 }
  },
  {
    id: '3',
    lat: 40.7282,
    lng: -74.0776,
    intensity: 'medium',
    score: 76,
    shopTypes: ['Cafes', 'Fitness', 'Electronics'],
    address: 'SoHo District, NYC',
    footTraffic: 28000,
    avgRent: 9500,
    demographics: { avgAge: 31, avgIncome: 78000, populationDensity: 18000 }
  },
  {
    id: '4',
    lat: 40.7614,
    lng: -73.9776,
    intensity: 'medium',
    score: 71,
    shopTypes: ['Grocery', 'Health & Beauty', 'Services'],
    address: 'Upper East Side, NYC',
    footTraffic: 22000,
    avgRent: 8000,
    demographics: { avgAge: 35, avgIncome: 110000, populationDensity: 15000 }
  },
  {
    id: '5',
    lat: 40.7505,
    lng: -73.9861,
    intensity: 'low',
    score: 65,
    shopTypes: ['Restaurants', 'Retail'],
    address: 'Herald Square, NYC',
    footTraffic: 18000,
    avgRent: 7000,
    demographics: { avgAge: 33, avgIncome: 65000, populationDensity: 12000 }
  },
  {
    id: '6',
    lat: 40.7420,
    lng: -74.0020,
    intensity: 'low',
    score: 58,
    shopTypes: ['Cafes', 'Electronics', 'Fitness'],
    address: 'Greenwich Village, NYC',
    footTraffic: 15000,
    avgRent: 6500,
    demographics: { avgAge: 28, avgIncome: 72000, populationDensity: 14000 }
  }
];

export const getHotspotsByFilters = (
  centerLat: number,
  centerLng: number,
  radius: number,
  selectedTypes: string[],
  limit: number
): Hotspot[] => {
  // Simple distance calculation (for demo purposes)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * R;
  };

  return mockHotspots
    .filter(hotspot => {
      const distance = calculateDistance(centerLat, centerLng, hotspot.lat, hotspot.lng);
      const withinRadius = distance <= radius;
      const matchesTypes = selectedTypes.length === 0 || 
        hotspot.shopTypes.some(type => selectedTypes.includes(type));
      return withinRadius && matchesTypes;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};