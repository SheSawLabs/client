declare global {
  interface Window {
    kakao: {
      maps: KakakoMap;
    };
  }
}

export interface LatNLng {
  lat: number;
  lng: number;
  getLat?: () => number;
  getLng?: () => number;
}

export interface PolygonInstance {
  setMap: (map: MapInstance | null) => void;
  setPaths: (paths: LatNLng[] | string[]) => void;
  getPaths: () => LatNLng[] | string[];
  setStrokeColor: (color: string) => void;
  setStrokeOpacity: (opacity: number) => void;
  setStrokeWeight: (weight: number) => void;
  setFillColor: (color: string) => void;
  setFillOpacity: (opacity: number) => void;
  setZIndex: (zIndex: number) => void;
  getBounds: () => {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  getCenter: () => LatNLng;
  setCenter: (center: LatNLng) => void;
  setDraggable: (draggable: boolean) => void;
  setClickable: (clickable: boolean) => void;
  setVisible: (visible: boolean) => void;
  setMapTypeId: (mapTypeId: string) => void;
  setPosition: (position: LatNLng) => void;
  setPositionByCoords: (coords: LatNLng) => void;
  setPositionByLatLng: (lat: number, lng: number) => void;
  setPositionByLatLngObject: (latLng: LatNLng) => void;
  setPositionByLatLngString: (latLng: string) => void;
  setPositionByLatLngArray: (latLng: [number, number]) => void;
  setPositionByLatLngObjectArray: (latLng: LatNLng[]) => void;
}

export interface MapInstance {
  setCenter: (coords: LatNLng) => void;
  setLevel: (level: number) => void;
  getCenter: () => LatNLng;
  getLevel: () => number;
  setMapTypeId: (mapTypeId: string) => void;
  setZoomable: (zoomable: boolean) => void;
  setDraggable: (draggable: boolean) => void;
  setClickable: (clickable: boolean) => void;
  addOverlayMapTypeId: (mapTypeId: string) => void;
  removeOverlayMapTypeId: (mapTypeId: string) => void;
  getOverlayMapTypeId: () => string[];
  setBounds: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
  getBounds: () => { north: number; south: number; east: number; west: number };
  getSize: () => { width: number; height: number };
  getContainer: () => HTMLElement;
  getProjection: () => {
    fromLatLngToPoint: (latLng: LatNLng) => { x: number; y: number };
    fromPointToLatLng: (point: { x: number; y: number }) => LatNLng;
  };
  setCenterByCoords: (coords: LatNLng) => void;
  setCenterByLatLng: (lat: number, lng: number) => void;
  setCenterByLatLngObject: (latLng: LatNLng) => void;
  setCenterByLatLngString: (latLng: string) => void;
  setCenterByLatLngArray: (latLng: [number, number]) => void;
  setCenterByLatLngObjectArray: (latLng: LatNLng[]) => void;
  setZoomByCoords: (coords: LatNLng) => void;
  setZoomByLatLng: (lat: number, lng: number) => void;
  setZoomByLatLngObject: (latLng: LatNLng) => void;
  setZoomByLatLngString: (latLng: string) => void;
  setZoomByLatLngArray: (latLng: [number, number]) => void;
  setZoomByLatLngObjectArray: (latLng: LatNLng[]) => void;
  setMapTypeByCoords: (coords: LatNLng) => void;
  setMapTypeByLatLng: (lat: number, lng: number) => void;
  setMapTypeByLatLngObject: (latLng: LatNLng) => void;
  setMapTypeByLatLngString: (latLng: string) => void;
  setMapTypeByLatLngArray: (latLng: [number, number]) => void;
  setMapTypeByLatLngObjectArray: (latLng: LatNLng[]) => void;
  setMapTypeById: (mapTypeId: string) => void;
  setMapTypeByName: (mapTypeName: string) => void;
  setMapTypeByCoordsAndId: (coords: LatNLng, mapTypeId: string) => void;
}

export interface MarkerInstance {
  setMap: (map: MapInstance | null) => void;
  setPosition: (position: LatNLng) => void;
  getPosition: () => LatNLng;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setClickable: (clickable: boolean) => void;
  setZIndex: (zIndex: number) => void;
  setImage: (image: {
    src: string;
    size: { width: number; height: number };
    options?: { offset?: { x: number; y: number } };
  }) => void;
  setDraggable: (draggable: boolean) => void;
  setShadow: (shadow: {
    src: string;
    size: { width: number; height: number };
    options?: { offset?: { x: number; y: number } };
  }) => void;
  setMapTypeId: (mapTypeId: string) => void;
  setVisible: (visible: boolean) => void;
  setPositionByCoords: (coords: LatNLng) => void;
  setPositionByLatLng: (lat: number, lng: number) => void;
  setPositionByLatLngObject: (latLng: LatNLng) => void;
  setPositionByLatLngString: (latLng: string) => void;
  setPositionByLatLngArray: (latLng: [number, number]) => void;
  setPositionByLatLngObjectArray: (latLng: LatNLng[]) => void;
}

export interface InfoWindowInstance {
  open: (map: MapInstance, marker?: MarkerInstance | null) => void;
  close: () => void;
  setContent: (content: string) => void;
  setPosition: (position: LatNLng) => void;
  setZIndex: (zIndex: number) => void;
  setMap: (map: MapInstance | null) => void;
  setPositionByCoords: (coords: LatNLng) => void;
  setPositionByLatLng: (lat: number, lng: number) => void;
  setPositionByLatLngObject: (latLng: LatNLng) => void;
  setPositionByLatLngString: (latLng: string) => void;
  setPositionByLatLngArray: (latLng: [number, number]) => void;
  setPositionByLatLngObjectArray: (latLng: LatNLng[]) => void;
}

export interface CustomOverlayInterface {
  open: (map: MapInstance, marker?: MarkerInstance | null) => void;
  close: () => void;
  setContent: (content: string) => void;
  setPosition: (position: LatNLng) => void;
  setZIndex: (zIndex: number) => void;
  setMap: (map: MapInstance | null) => void;
  setPositionByCoords: (coords: LatNLng) => void;
  setPositionByLatLng: (lat: number, lng: number) => void;
  setPositionByLatLngObject: (latLng: LatNLng) => void;
  setPositionByLatLngString: (latLng: string) => void;
  setPositionByLatLngArray: (latLng: [number, number]) => void;
  setPositionByLatLngObjectArray: (latLng: LatNLng[]) => void;
}

export interface MarkerImageInstance {
  getSize: () => { width: number; height: number };
  getOffset: () => { x: number; y: number };
}

export interface MarkerClustererInstance {
  addMarkers: (markers: MarkerInstance[]) => void;
  removeMarkers: (markers: MarkerInstance[]) => void;
  clear: () => void;
  redraw: () => void;
  setGridSize: (size: number) => void;
  getGridSize: () => number;
  setMaxZoom: (zoom: number) => void;
  getMaxZoom: () => number;
  setMap: (map: MapInstance | null) => void;
}

export interface KakakoMap {
  LatLng: new (lat: number, lng: number) => LatNLng;
  Size: new (
    width: number,
    height: number,
  ) => { width: number; height: number };
  Point: new (x: number, y: number) => { x: number; y: number };
  MarkerImage: new (
    src: string,
    size: { width: number; height: number },
    options?: {
      offset?: { x: number; y: number };
    },
  ) => MarkerImageInstance;
  Map: new (
    container: HTMLElement,
    options: {
      center: LatNLng;
      level: number;
    },
  ) => MapInstance;
  Marker: new (options: {
    position: LatNLng;
    map?: MapInstance | null;
    image?: MarkerImageInstance;
    title?: string;
  }) => MarkerInstance;
  MarkerClusterer: new (options: {
    map?: MapInstance | null;
    averageCenter?: boolean;
    minLevel?: number;
    gridSize?: number;
    disableClickZoom?: boolean;
    styles?: Array<{
      width: string;
      height: string;
      background: string;
      borderRadius: string;
      border: string;
      color: string;
      textAlign: string;
      fontWeight: string;
      fontSize: string;
      lineHeight: string;
    }>;
  }) => MarkerClustererInstance;
  InfoWindow: new (options: { content: string }) => InfoWindowInstance;
  CustomOverlay: new (options: {
    map?: MapInstance | null;
    content: string;
    position: LatNLng;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
    clickable?: boolean;
  }) => CustomOverlayInterface;
  Polygon: new (options: {
    map?: MapInstance | null;
    path: LatNLng[];
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    fillColor?: string;
    fillOpacity?: number;
    zIndex?: number;
  }) => {
    setMap: (map: MapInstance | null) => void;
    setPaths: (paths: LatNLng[] | string[]) => void;
    getPaths: () => LatNLng[] | string[];
    setStrokeColor: (color: string) => void;
    setStrokeOpacity: (opacity: number) => void;
    setStrokeWeight: (weight: number) => void;
    setFillColor: (color: string) => void;
    setFillOpacity: (opacity: number) => void;
    setZIndex: (zIndex: number) => void;
    getBounds: () => {
      north: number;
      south: number;
      east: number;
      west: number;
    };
    getCenter: () => LatNLng;
    setCenter: (center: LatNLng) => void;
    setDraggable: (draggable: boolean) => void;
    setClickable: (clickable: boolean) => void;
    setVisible: (visible: boolean) => void;
    setMapTypeId: (mapTypeId: string) => void;
    setPosition: (position: LatNLng) => void;
    setPositionByCoords: (coords: LatNLng) => void;
    setPositionByLatLng: (lat: number, lng: number) => void;
    setPositionByLatLngObject: (latLng: LatNLng) => void;
    setPositionByLatLngString: (latLng: string) => void;
    setPositionByLatLngArray: (latLng: [number, number]) => void;
    setPositionByLatLngObjectArray: (latLng: LatNLng[]) => void;
  };
  load: (callback: () => void) => void;
  event: {
    addListener: (
      target: MapInstance | MarkerInstance | CustomOverlayInterface,
      eventName: string,
      handler: (event: unknown) => void,
    ) => void;
    removeListener: (
      target: MapInstance | MarkerInstance | CustomOverlayInterface,
      eventName: string,
      handler: (event: unknown) => void,
    ) => void;
  };
}
