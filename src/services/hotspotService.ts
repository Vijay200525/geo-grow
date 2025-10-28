import { supabase } from "@/integrations/supabase/client";
import { Hotspot, BusinessType } from "@/types/hotspot";

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function fetchHotspotsByFilters(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  selectedTypes: BusinessType[],
  maxResults: number
): Promise<Hotspot[]> {
  console.log('fetchHotspotsByFilters called with:', { centerLat, centerLng, radiusKm, selectedTypes, maxResults });
  const allHotspots: Hotspot[] = [];
  
  // If no types selected, fetch all types
  const typesToFetch: BusinessType[] = selectedTypes.length > 0 ? selectedTypes : [
    'Hotel',
    'Bakery',
    'Supermarket',
    'Hardware',
    'Stationery',
    'Clothing'
  ];
  
  console.log('Types to fetch:', typesToFetch);

  // Fetch data from each selected table
  for (const businessType of typesToFetch) {
    try {
      console.log(`Fetching ${businessType} data...`);
      const { data, error } = await supabase
        .from(businessType as any)
        .select('*');

      console.log(`${businessType} response:`, { data: data?.length, error });

      if (error) {
        console.error(`Error fetching ${businessType}:`, error);
        continue;
      }

      if (data && data.length > 0) {
        // Map the data to Hotspot format, handling different column name variations
        const mappedData = data
          .map((row: any) => {
            // Handle different ID column names: CelID or CellD
            const cellId = row.CelID || row.CellD;
            
            // Skip rows with missing required data
            if (!cellId || !row.Lat || !row.Lon) {
              console.warn(`Skipping row with missing data in ${businessType}:`, row);
              return null;
            }

            return {
              id: cellId.toString(),
              lat: Number(row.Lat),
              lng: Number(row.Lon),
              score: Number(row.Score_0_1000) || 0,
              rank: Number(row.Rank) || 0,
              businessType
            };
          })
          .filter((item: any): item is Hotspot => item !== null);

        // Filter by radius and calculate distance for each hotspot
        const hotspots = mappedData
          .map((hotspot) => {
            const distance = calculateDistance(
              centerLat,
              centerLng,
              hotspot.lat,
              hotspot.lng
            );
            return {
              ...hotspot,
              distance
            };
          })
          .filter((hotspot) => hotspot.distance <= radiusKm);

        console.log(`Fetched ${hotspots.length} ${businessType} hotspots within ${radiusKm}km radius`);
        allHotspots.push(...hotspots);
      } else {
        console.log(`No data found in ${businessType} table`);
      }
    } catch (err) {
      console.error(`Error processing ${businessType}:`, err);
    }
  }

  // Sort by distance (ascending) and return closest results
  console.log(`Total hotspots found: ${allHotspots.length}`);
  const results = allHotspots
    .sort((a: any, b: any) => a.distance - b.distance)
    .slice(0, maxResults)
    .map(({ distance, ...hotspot }: any) => hotspot); // Remove distance from final result
  console.log(`Returning ${results.length} closest hotspots`);
  return results;
}
