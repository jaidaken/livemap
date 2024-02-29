import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import PropTypes from "prop-types";

const GridLayer = ({
  bottomLeftCoord,
  backgroundColor,
  lineColor,
  lineOpacity,
  backgroundOpacity,
  labelPosition,
  labelFont,
  labelColor,
  labelOpacity,
  squareSize, // New prop for square size
}) => {
  GridLayer.propTypes = {
    bottomLeftCoord: PropTypes.array.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    lineColor: PropTypes.string.isRequired,
    lineOpacity: PropTypes.number.isRequired,
    backgroundOpacity: PropTypes.number.isRequired,
    labelPosition: PropTypes.string.isRequired,
    labelFont: PropTypes.string.isRequired,
    labelColor: PropTypes.string.isRequired,
    labelOpacity: PropTypes.number.isRequired,
    squareSize: PropTypes.number.isRequired, // New prop validation
  };

  const map = useMap();

  useEffect(() => {
    const gridLayer = L.layerGroup().addTo(map);

    const createGrid = () => {
      gridLayer.clearLayers(); // Clear previous grid

      // Calculate the step size for the grid based on squareSize prop
      const stepSize = squareSize;

      // Iterate over rows and columns to create grid squares and labels
      for (let i = 0; i < 26; i++) {
        for (let j = 0; j < 26; j++) {
          // Calculate the bounds of the current grid square
          const squareBounds = [
            [
              bottomLeftCoord[0] + i * stepSize,
              bottomLeftCoord[1] + j * stepSize,
            ],
            [
              bottomLeftCoord[0] + (i + 1) * stepSize,
              bottomLeftCoord[1] + (j + 1) * stepSize,
            ],
          ];

          // Add the grid background to the map
          L.rectangle(squareBounds, {
            color: backgroundColor,
            weight: 0,
            fillOpacity: backgroundOpacity,
          }).addTo(gridLayer);

          // Add the grid lines to the map
          L.rectangle(squareBounds, {
            color: lineColor,
            weight: 1,
            opacity: lineOpacity,
            fillOpacity: 0,
          }).addTo(gridLayer);

          // Calculate the label position at the top left corner of the current grid square
          const labelLat = bottomLeftCoord[0] + i * stepSize;
          const labelLng = bottomLeftCoord[1] + j * stepSize;

          // Calculate the label for the current grid square
          const label = `${String.fromCharCode(65 + j)}${25 - i}`;

          // Add the label marker to the specified position
          L.marker([labelLat, labelLng], {
            icon: L.divIcon({
              className: "grid-label",
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
  }, [
    map,
    bottomLeftCoord,
    backgroundColor,
    lineColor,
    lineOpacity,
    backgroundOpacity,
    labelPosition,
    labelFont,
    labelColor,
    labelOpacity,
    squareSize,
  ]);

  return null;
};

export default GridLayer;
