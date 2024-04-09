import { useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import PropTypes from "prop-types";

const GridLayer = ({
  bottomLeftCoord,
  lineColor,
  lineOpacity,
  lineWeight,
  labelFont,
  labelColor,
  labelOpacity,
  squareSize,
}) => {
  GridLayer.propTypes = {
    bottomLeftCoord: PropTypes.array.isRequired,
    lineColor: PropTypes.string.isRequired,
    lineOpacity: PropTypes.number.isRequired,
    lineWeight: PropTypes.number.isRequired,
    labelFont: PropTypes.string.isRequired,
    labelFontSize: PropTypes.string.isRequired,
    labelColor: PropTypes.string.isRequired,
    labelOpacity: PropTypes.number.isRequired,
    squareSize: PropTypes.number.isRequired,
  };

  const map = useMap();

  const createGrid = useCallback(() => {
    map.eachLayer((layer) => {
      if (layer instanceof L.LayerGroup) {
        map.removeLayer(layer);
      }
    });

    const gridLayer = L.layerGroup().addTo(map);

    const labelFontSize = () => {
      const savedZoom = localStorage.getItem("zoomLevel");
      const zoomLevel = savedZoom ? parseInt(savedZoom) : 5;
      if (zoomLevel <= 2) return 12;
      if (zoomLevel === 3) return 15;
      if (zoomLevel === 4) return 18;
      if (zoomLevel === 5) return 20;
      if (zoomLevel === 6) return 22;
      if (zoomLevel === 7) return 30;
      if (zoomLevel >= 8) return 45;
      return 30;
    };

    gridLayer.clearLayers();

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

        // Add the grid lines to the map
        L.rectangle(squareBounds, {
          color: lineColor,
          weight: lineWeight,
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
            html: `<div style="color: ${labelColor}; font-size: ${labelFontSize()}px; line-height: ${labelFontSize()}px; font-family: ${labelFont}; opacity: ${labelOpacity};">${label.toUpperCase()}</div>`,
            iconAnchor: [0, 0],
          }),
          interactive: false,
        }).addTo(gridLayer);
      }
    }
  }, [
    map,
    bottomLeftCoord,
    lineColor,
    lineOpacity,
    lineWeight,
    labelFont,
    labelColor,
    labelOpacity,
    squareSize,
  ]);

  useEffect(() => {
    const handleZoomEnd = () => {
      createGrid();
    };

    const handleMoveEnd = () => {
      createGrid();
    };

    if (map) {
      map.on("zoomend", handleZoomEnd);
      map.on("moveend", handleMoveEnd);

      createGrid();

      return () => {
        map.off("zoomend", handleZoomEnd);
        map.off("moveend", handleMoveEnd);
      };
    }
  }, [map, createGrid]);

  return null;
};

export default GridLayer;
