// Coordinate transform: CRS.Simple [lat,lng] -> MapLibre [lng,lat] (near equator)
// Original center [-128, 128] maps to [0, 0].
// Scale factor keeps coords well within ±85° Mercator limit.

const SCALE = 0.15;
const CENTER_LAT = -128;
const CENTER_LNG = 128;

// Leaflet zoom -> MapLibre zoom offset (empirical, tune as needed)
export const ZOOM_OFFSET = 2;
export const MIN_ZOOM = 2 + ZOOM_OFFSET;  // 4
export const MAX_ZOOM = 9 + ZOOM_OFFSET;  // 11

export function toMapLibreZoom(leafletZoom) {
  return leafletZoom + ZOOM_OFFSET;
}

export function toLeafletZoom(maplibreZoom) {
  return maplibreZoom - ZOOM_OFFSET;
}

// Transform a single [lat, lng] (CRS.Simple) to [lng, lat] (GeoJSON/MapLibre)
export function transformCoord(coord) {
  const [lat, lng] = coord;
  return [
    (lng - CENTER_LNG) * SCALE,
    (lat - CENTER_LAT) * SCALE,
  ];
}

// Transform an array of [lat, lng] pairs to GeoJSON coordinate array [[lng, lat], ...]
export function transformCoords(coords) {
  return coords.map(transformCoord);
}

// Close a ring (polygon) — ensures first === last
export function closeRing(coords) {
  if (coords.length < 2) return coords;
  const first = coords[0];
  const last = coords[coords.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    return [...coords, first];
  }
  return coords;
}

// Transform a flat array of [lat,lng] pairs to a closed GeoJSON polygon ring
export function transformPolygonRing(flatCoords) {
  return closeRing(transformCoords(flatCoords));
}

// Inverse: MapLibre [lng, lat] -> CRS.Simple [lat, lng]
export function inverseTransform(lngLat) {
  const [lng, lat] = lngLat;
  return [
    lat / SCALE + CENTER_LAT,
    lng / SCALE + CENTER_LNG,
  ];
}

// Transform a CRS.Simple center [lat, lng] to MapLibre LngLat {lng, lat}
export function transformCenter(center) {
  const [lng, lat] = transformCoord(center);
  return { lng, lat };
}
