export interface AddressData {
  address: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface GeocodeResult {
  x: string; // longitude
  y: string; // latitude
  address_name: string;
}

export interface AddressWithCoords extends AddressData {
  coords?: {
    lat: number;
    lng: number;
  };
  geocodeResult?: GeocodeResult;
}
