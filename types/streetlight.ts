export interface Streetlight {
  id: number;
  management_number: string;
  district: string;
  dong: string;
  latitude: number;
  longitude: number;
}

export interface StreetlightResponse {
  dong: string;
  district: string;
  count: number;
  streetlights: Streetlight[];
}
