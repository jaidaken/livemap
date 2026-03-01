// Generate a polygon approximation of a circle in CRS.Simple coordinate space,
// then transform to MapLibre coords. MapLibre has no native coord-based circles.

import { transformCoord, closeRing } from "./coordTransform.js";

export function makeCircleRing(center, radius, numPoints = 96) {
  const [centerLat, centerLng] = center;
  const coords = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints;
    const lat = centerLat + radius * Math.sin(angle);
    const lng = centerLng + radius * Math.cos(angle);
    coords.push(transformCoord([lat, lng]));
  }
  return closeRing(coords);
}
