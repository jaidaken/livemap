import { useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import PropTypes from "prop-types";

const GridLayer = ({
  bottomLeftCoord,
  lineColor,
  lineOpacity,
  labelFont,
  labelColor,
  labelOpacity,
  squareSize,
}) => {
  GridLayer.propTypes = {
    bottomLeftCoord: PropTypes.array.isRequired,
    lineColor: PropTypes.string.isRequired,
    lineOpacity: PropTypes.number.isRequired,
		labelFont: PropTypes.string.isRequired,
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
      if (zoomLevel <= 2) return 10;
      if (zoomLevel === 3) return 12;
      if (zoomLevel === 4) return 14;
      if (zoomLevel === 5) return 16;
      if (zoomLevel === 6) return 18;
      if (zoomLevel === 7) return 30;
      if (zoomLevel >= 8) return 45;
      return 30;
    };

    const lineWeight = () => {
      const savedZoom = localStorage.getItem("zoomLevel");
      const zoomLevel = savedZoom ? parseInt(savedZoom) : 5;
      if (zoomLevel <= 2) return 1;
      if (zoomLevel === 3) return 1;
      if (zoomLevel === 4) return 1;
      if (zoomLevel === 5) return 3;
      if (zoomLevel === 6) return 5;
      if (zoomLevel === 7) return 6;
      if (zoomLevel >= 8) return 10;
      return 1;
    };

    const paddingSize = () => {
      const savedZoom = localStorage.getItem("zoomLevel");
      const zoomLevel = savedZoom ? parseInt(savedZoom) : 5;
      if (zoomLevel <= 2) return "3px";
      if (zoomLevel === 3) return "5px";
      if (zoomLevel === 4) return "6px";
      if (zoomLevel === 5) return "10px";
      if (zoomLevel === 6) return "12px";
      if (zoomLevel === 7) return "15px";
      if (zoomLevel >= 8) return "20px";
      return "3px";
		};

		gridLayer.clearLayers();

    const stepSize = squareSize;

    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 26; j++) {
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

        L.rectangle(squareBounds, {
          color: lineColor,
          weight: lineWeight(),
          opacity: lineOpacity,
          fillOpacity: 0,
          className: "grid-square"
        }).addTo(gridLayer);

        const labelLat = bottomLeftCoord[0] + i * stepSize;
        const labelLng = bottomLeftCoord[1] + j * stepSize;

        const label = `${String.fromCharCode(65 + j)}${25 - i}`;

        L.marker([labelLat, labelLng], {
          icon: L.divIcon({
            className: "grid-label",
            html: `<div style="color: ${labelColor}; font-size: ${labelFontSize()}px; line-height: ${labelFontSize()}px; font-family: ${labelFont}; opacity: ${labelOpacity}; padding: ${paddingSize()} ">${label.toUpperCase()}</div>`,
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
