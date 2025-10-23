export interface Hotspot {
  id: string; // CellID/CelID/CellD
  lat: number;
  lng: number;
  score: number; // Score_0_1000
  rank: number;
  businessType: BusinessType; // Hotel, Bakery, etc.
}

export const BUSINESS_TYPES = [
  'Hotel',
  'Bakery',
  'Supermarket',
  'Hardware',
  'Stationery',
  'Clothing'
] as const;

export type BusinessType = typeof BUSINESS_TYPES[number];
