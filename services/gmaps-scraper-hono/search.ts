import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { GmapsPlace } from "./types.ts";

config({ export: true });

const API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");

export const performGoogleMapsSearch = async (query: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data.results.map((place: GmapsPlace) => ({
    name: place.name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    address: (place as any).formatted_address, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rating: (place as any).rating,
  }));
}
