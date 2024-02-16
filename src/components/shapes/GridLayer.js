import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const GridLayer = ({
  gridSpacing,
  bottomLeftCoord,
  backgroundColor,
  lineColor,
  lineOpacity,
  backgroundOpacity,
  labelPosition,
  labelFont,
  labelColor,
  labelOpacity
}) => {
  const map = useMap();

  useEffect(() => {
    const gridLayer = L.layerGroup().addTo(map);

    const createGrid = () => {
      gridLayer.clearLayers(); // Clear previous grid

      // Calculate the step size for the grid based on gridSpacing prop
      const stepSize = gridSpacing;

      // Iterate over rows and columns to create grid squares and labels
      for (let i = 25; i >= 0; i--) { // Reverse the loop for rows
        for (let j = 0; j < 26; j++) {
          // Calculate the bounds of the current grid square
          const squareBounds = [
            [bottomLeftCoord[0] + i * stepSize, bottomLeftCoord[1] + j * stepSize],
            [bottomLeftCoord[0] + (i + 1) * stepSize, bottomLeftCoord[1] + (j + 1) * stepSize],
          ];

          // Add the grid background to the map
          L.rectangle(squareBounds, { color: backgroundColor, weight: 0, fillOpacity: backgroundOpacity }).addTo(gridLayer);

          // Add the grid lines to the map
          L.rectangle(squareBounds, { color: lineColor, weight: 1, opacity: lineOpacity, fillOpacity: 0 }).addTo(gridLayer);

          // Calculate the label position based on labelPosition prop
          let labelLat, labelLng;
          switch (labelPosition) {
            case 'topLeft':
              labelLat = bottomLeftCoord[0] + i * stepSize;
              labelLng = bottomLeftCoord[1] + j * stepSize;
              break;
            case 'topRight':
              labelLat = bottomLeftCoord[0] + i * stepSize;
              labelLng = bottomLeftCoord[1] + (j + 1) * stepSize;
              break;
            case 'bottomLeft':
              labelLat = bottomLeftCoord[0] + (i + 1) * stepSize;
              labelLng = bottomLeftCoord[1] + j * stepSize;
              break;
            case 'bottomRight':
              labelLat = bottomLeftCoord[0] + (i + 1) * stepSize;
              labelLng = bottomLeftCoord[1] + (j + 1) * stepSize;
              break;
            default:
              labelLat = bottomLeftCoord[0] + i * stepSize;
              labelLng = bottomLeftCoord[1] + j * stepSize;
          }

          // Calculate the label for the current grid square
          const label = `${String.fromCharCode(65 + j)}${25 - i}`; // Adjust the label calculation

          // Add the label marker to the specified position
          L.marker([labelLat, labelLng], {
            icon: L.divIcon({
              className: 'grid-label',
              html: `<div style="color: ${labelColor}; font-family: ${labelFont}; opacity: ${labelOpacity};">${label.toUpperCase()}</div>`,
              iconAnchor: [0, 0],
            }),
            interactive: false,
          }).addTo(gridLayer);
        }
      }
    };

    // Call the createGrid function when the map is moved
    createGrid(); // Initial creation

    // Remove event listener and clear the grid layer when the component unmounts
    return () => {
      gridLayer.remove();
    };
  }, [map, gridSpacing, bottomLeftCoord, backgroundColor, lineColor, lineOpacity, backgroundOpacity, labelPosition, labelFont, labelColor, labelOpacity]);

  return null;
};

export default GridLayer;
