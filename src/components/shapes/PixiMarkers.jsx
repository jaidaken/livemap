import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PixiOverlay from "react-leaflet-pixi-overlay";

// Import your SVGs as raw strings:
import sharedSvg from "../../assets/marker-shared.min.svg?raw";
import canonSvg from "../../assets/marker-canon.min.svg?raw";
import legendsSvg from "../../assets/marker-legends.min.svg?raw";
import errorSvg from "../../assets/marker-error.svg?raw";

// Helper: update SVG width and height attributes
const updateSvgSize = (svg, width, height) => {
  let updatedSvg = svg.replace(/width="[^"]*"/, `width="${width}"`);
  updatedSvg = updatedSvg.replace(/height="[^"]*"/, `height="${height}"`);
  return updatedSvg;
};

export default function PixiMarkers({ allSystems, activeFilters, map, zoomLevel }) {
  const [visibleMarkers, setVisibleMarkers] = useState([]);

  const calculateIconSize = (zoomLevel) => {
    if (zoomLevel <= 2) return [4, 4];
    if (zoomLevel === 3) return [10, 10];
    if (zoomLevel === 4) return [15, 15];
    if (zoomLevel === 5) return [25, 25];
    if (zoomLevel === 6) return [45, 45];
    if (zoomLevel === 7) return [60, 60];
    if (zoomLevel === 8) return [70, 70];
    if (zoomLevel === 9) return [200, 200];
    return [70, 70];
  };

  useEffect(() => {
    if (allSystems.length > 0) {
      const newMarkers = allSystems
        .filter((system) => {
          if (activeFilters.includes("shared") && system.isCanon && system.isLegends)
            return true;
          if (activeFilters.includes("canon") && system.isCanon && !system.isLegends)
            return true;
          if (activeFilters.includes("legends") && !system.isCanon && system.isLegends)
            return true;
          return false;
        })
				.map((system) => {

					let chosenSvg;
					if (system.isCanon && system.isLegends) {
						chosenSvg = sharedSvg;
					} else if (system.isCanon) {
						chosenSvg = canonSvg;
					} else if (system.isLegends) {
						chosenSvg = legendsSvg;
					} else {
						chosenSvg = errorSvg;
					}


					const [w, h] = calculateIconSize(zoomLevel);

          const sizedSvg = updateSvgSize(chosenSvg, w, h);

          return {
            id: system.id,
            position: [system.latitude, system.longitude],
            customIcon: sizedSvg,
            markerSpriteAnchor: [0.5, 0.5],
						iconId: `${
							chosenSvg === sharedSvg
								? "shared-svg-icon"
								: chosenSvg === canonSvg
								? "canon-svg-icon"
								: "legends-svg-icon"
						}-zoom-${zoomLevel}`,
            iconSize: [w, h],
            popup: `<a href="${system.wiki}" target="_blank" rel="noreferrer">${system.name} wiki page</a>`,
            onClick: () => {
              console.log(`Marker ${system.id} clicked`);
              map.flyTo([system.latitude, system.longitude], 10);
            },
          };
        });
      setVisibleMarkers(newMarkers);
    }
  }, [allSystems, activeFilters, map, zoomLevel]);

  // Use zoomLevel as key to force remounting if needed.
  return <PixiOverlay markers={visibleMarkers} />;
}

PixiMarkers.propTypes = {
  allSystems: PropTypes.array.isRequired,
  activeFilters: PropTypes.array.isRequired,
  map: PropTypes.object.isRequired,
  zoomLevel: PropTypes.number.isRequired,
};
