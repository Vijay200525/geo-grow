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

// Mock hotspot data for Chennai, Tamil Nadu, India
export const mockHotspots: Hotspot[] = [
  {
    id: '1',
    lat: 13.0827,
    lng: 80.2707,
    intensity: 'high',
    score: 95,
    shopTypes: ['Restaurants', 'Cafes', 'Retail'],
    address: 'T. Nagar, Chennai',
    footTraffic: 45000,
    avgRent: 8000,
    demographics: { avgAge: 30, avgIncome: 65000, populationDensity: 24000 }
  },
  {
    id: '2',
    lat: 13.0878,
    lng: 80.2785,
    intensity: 'high',
    score: 92,
    shopTypes: ['Electronics', 'Retail', 'Services'],
    address: 'Pondy Bazaar, Chennai',
    footTraffic: 42000,
    avgRent: 7500,
    demographics: { avgAge: 29, avgIncome: 58000, populationDensity: 26000 }
  },
  {
    id: '3',
    lat: 13.0569,
    lng: 80.2497,
    intensity: 'high',
    score: 90,
    shopTypes: ['Restaurants', 'Health & Beauty', 'Retail'],
    address: 'Express Avenue, Chennai',
    footTraffic: 38000,
    avgRent: 9000,
    demographics: { avgAge: 28, avgIncome: 75000, populationDensity: 22000 }
  },
  {
    id: '4',
    lat: 13.0475,
    lng: 80.2534,
    intensity: 'high',
    score: 88,
    shopTypes: ['Cafes', 'Electronics', 'Services'],
    address: 'Anna Salai, Chennai',
    footTraffic: 35000,
    avgRent: 8500,
    demographics: { avgAge: 31, avgIncome: 68000, populationDensity: 20000 }
  },
  {
    id: '5',
    lat: 13.0475,
    lng: 80.2564,
    intensity: 'medium',
    score: 85,
    shopTypes: ['Restaurants', 'Fitness', 'Health & Beauty'],
    address: 'Nungambakkam, Chennai',
    footTraffic: 32000,
    avgRent: 7800,
    demographics: { avgAge: 33, avgIncome: 82000, populationDensity: 18000 }
  },
  {
    id: '6',
    lat: 13.0569,
    lng: 80.2186,
    intensity: 'medium',
    score: 82,
    shopTypes: ['Grocery', 'Restaurants', 'Services'],
    address: 'Vadapalani, Chennai',
    footTraffic: 28000,
    avgRent: 6500,
    demographics: { avgAge: 35, avgIncome: 55000, populationDensity: 19000 }
  },
  {
    id: '7',
    lat: 13.0299,
    lng: 80.2095,
    intensity: 'medium',
    score: 80,
    shopTypes: ['Cafes', 'Electronics', 'Retail'],
    address: 'Ashok Nagar, Chennai',
    footTraffic: 26000,
    avgRent: 6200,
    demographics: { avgAge: 32, avgIncome: 52000, populationDensity: 17000 }
  },
  {
    id: '8',
    lat: 13.0569,
    lng: 80.2497,
    intensity: 'medium',
    score: 78,
    shopTypes: ['Health & Beauty', 'Fitness', 'Services'],
    address: 'Royapettah, Chennai',
    footTraffic: 24000,
    avgRent: 6800,
    demographics: { avgAge: 29, avgIncome: 48000, populationDensity: 16000 }
  },
  {
    id: '9',
    lat: 13.1475,
    lng: 80.2564,
    intensity: 'medium',
    score: 76,
    shopTypes: ['Restaurants', 'Cafes', 'Electronics'],
    address: 'Kilpauk, Chennai',
    footTraffic: 22000,
    avgRent: 5800,
    demographics: { avgAge: 34, avgIncome: 60000, populationDensity: 15000 }
  },
  {
    id: '10',
    lat: 13.1186,
    lng: 80.2186,
    intensity: 'medium',
    score: 74,
    shopTypes: ['Grocery', 'Health & Beauty', 'Services'],
    address: 'Aminjikarai, Chennai',
    footTraffic: 20000,
    avgRent: 5500,
    demographics: { avgAge: 36, avgIncome: 58000, populationDensity: 14000 }
  },
  {
    id: '11',
    lat: 13.0299,
    lng: 80.1186,
    intensity: 'medium',
    score: 72,
    shopTypes: ['Restaurants', 'Retail', 'Fitness'],
    address: 'Porur, Chennai',
    footTraffic: 18000,
    avgRent: 5200,
    demographics: { avgAge: 30, avgIncome: 65000, populationDensity: 12000 }
  },
  {
    id: '12',
    lat: 12.9716,
    lng: 80.2431,
    intensity: 'low',
    score: 70,
    shopTypes: ['Cafes', 'Electronics', 'Services'],
    address: 'Adyar, Chennai',
    footTraffic: 16000,
    avgRent: 7200,
    demographics: { avgAge: 28, avgIncome: 88000, populationDensity: 11000 }
  },
  {
    id: '13',
    lat: 12.9165,
    lng: 80.2209,
    intensity: 'low',
    score: 68,
    shopTypes: ['Health & Beauty', 'Fitness', 'Grocery'],
    address: 'Velachery, Chennai',
    footTraffic: 15000,
    avgRent: 4800,
    demographics: { avgAge: 31, avgIncome: 62000, populationDensity: 13000 }
  },
  {
    id: '14',
    lat: 13.1299,
    lng: 80.2095,
    intensity: 'low',
    score: 66,
    shopTypes: ['Restaurants', 'Cafes', 'Services'],
    address: 'Anna Nagar, Chennai',
    footTraffic: 14000,
    avgRent: 6000,
    demographics: { avgAge: 33, avgIncome: 72000, populationDensity: 10000 }
  },
  {
    id: '15',
    lat: 12.8299,
    lng: 80.2209,
    intensity: 'low',
    score: 64,
    shopTypes: ['Electronics', 'Retail', 'Fitness'],
    address: 'Tambaram, Chennai',
    footTraffic: 12000,
    avgRent: 4200,
    demographics: { avgAge: 35, avgIncome: 45000, populationDensity: 9000 }
  },
  {
    id: '16',
    lat: 13.1475,
    lng: 80.1186,
    intensity: 'low',
    score: 62,
    shopTypes: ['Grocery', 'Health & Beauty', 'Services'],
    address: 'Ambattur, Chennai',
    footTraffic: 11000,
    avgRent: 3800,
    demographics: { avgAge: 37, avgIncome: 42000, populationDensity: 8500 }
  },
  {
    id: '17',
    lat: 13.0186,
    lng: 80.1564,
    intensity: 'low',
    score: 60,
    shopTypes: ['Cafes', 'Restaurants', 'Electronics'],
    address: 'Koyambedu, Chennai',
    footTraffic: 10000,
    avgRent: 4500,
    demographics: { avgAge: 32, avgIncome: 38000, populationDensity: 8000 }
  },
  {
    id: '18',
    lat: 12.9865,
    lng: 80.1186,
    intensity: 'low',
    score: 58,
    shopTypes: ['Health & Beauty', 'Fitness', 'Services'],
    address: 'Guindy, Chennai',
    footTraffic: 9500,
    avgRent: 5800,
    demographics: { avgAge: 29, avgIncome: 70000, populationDensity: 7500 }
  },
  {
    id: '19',
    lat: 12.8865,
    lng: 80.1831,
    intensity: 'low',
    score: 56,
    shopTypes: ['Restaurants', 'Retail', 'Grocery'],
    address: 'Chrompet, Chennai',
    footTraffic: 9000,
    avgRent: 3600,
    demographics: { avgAge: 34, avgIncome: 44000, populationDensity: 7000 }
  },
  {
    id: '20',
    lat: 13.1831,
    lng: 80.2431,
    intensity: 'low',
    score: 54,
    shopTypes: ['Electronics', 'Cafes', 'Services'],
    address: 'Perambur, Chennai',
    footTraffic: 8500,
    avgRent: 4000,
    demographics: { avgAge: 36, avgIncome: 40000, populationDensity: 6500 }
  },
  {
    id: '21',
    lat: 12.9186,
    lng: 80.0831,
    intensity: 'low',
    score: 52,
    shopTypes: ['Fitness', 'Health & Beauty', 'Grocery'],
    address: 'Pallavaram, Chennai',
    footTraffic: 8000,
    avgRent: 3400,
    demographics: { avgAge: 33, avgIncome: 46000, populationDensity: 6000 }
  },
  {
    id: '22',
    lat: 13.0831,
    lng: 80.3186,
    intensity: 'low',
    score: 50,
    shopTypes: ['Restaurants', 'Cafes', 'Electronics'],
    address: 'Mylapore, Chennai',
    footTraffic: 7500,
    avgRent: 6800,
    demographics: { avgAge: 38, avgIncome: 55000, populationDensity: 5500 }
  },
  {
    id: '23',
    lat: 12.7831,
    lng: 80.2186,
    intensity: 'low',
    score: 48,
    shopTypes: ['Grocery', 'Services', 'Health & Beauty'],
    address: 'Medavakkam, Chennai',
    footTraffic: 7000,
    avgRent: 3200,
    demographics: { avgAge: 35, avgIncome: 48000, populationDensity: 5000 }
  },
  {
    id: '24',
    lat: 13.2186,
    lng: 80.1831,
    intensity: 'low',
    score: 46,
    shopTypes: ['Electronics', 'Fitness', 'Services'],
    address: 'Avadi, Chennai',
    footTraffic: 6500,
    avgRent: 3000,
    demographics: { avgAge: 39, avgIncome: 36000, populationDensity: 4500 }
  },
  {
    id: '25',
    lat: 12.8186,
    lng: 80.0431,
    intensity: 'low',
    score: 44,
    shopTypes: ['Restaurants', 'Retail', 'Cafes'],
    address: 'Poonamallee, Chennai',
    footTraffic: 6000,
    avgRent: 2800,
    demographics: { avgAge: 37, avgIncome: 34000, populationDensity: 4000 }
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