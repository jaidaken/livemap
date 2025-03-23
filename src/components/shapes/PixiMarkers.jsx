import { useEffect, useState, useCallback } from "react";
import { Marker, useMap } from "react-leaflet";
import { createPortal } from "react-dom";
import L from "leaflet";
import PropTypes from "prop-types";
import PixiOverlay from "react-leaflet-pixi-overlay";

// Import your SVGs as raw strings:
import sharedSvg from "../../assets/marker-shared2.svg?raw";
import canonSvg from "../../assets/marker-canon2.svg?raw";
import legendsSvg from "../../assets/marker-legends2.svg?raw";
import errorSvg from "../../assets/marker-error2.svg?raw";


function LabelOverlay({ markers }) {
  const map = useMap();
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const pane = map.getPanes().overlayPane;
    const div = document.createElement("div");
    div.className = "label-overlay-container";
    pane.appendChild(div);
    setContainer(div);
    return () => {
      pane.removeChild(div);
    };
  }, [map]);

  if (!container) return null;

  return createPortal(
    <div style={{ position: "relative"}}>
      {markers.map((marker) => {
        const point = map.latLngToLayerPoint(marker.position);
        const style = {
          position: "absolute",
          left: point.x,
          top: point.y,
          transform: "translate(-50%, 0)",
          zIndex: 2001,
        };
        return (
          <div key={`label-${marker.id}`} className="custom-label" style={style}>
            {marker.name}
          </div>
        );
      })}
    </div>,
    container
  );
}

LabelOverlay.propTypes = {
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any,
      name: PropTypes.string,
      position: PropTypes.arrayOf(PropTypes.number),
    })
  ).isRequired,
};


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

	function LabelMarker({ position, label }) {
		const icon = L.divIcon({
			className: "custom-label",
			html: `<div>${label}</div>`,
			iconAnchor: [0, 0],
		});
		return <Marker position={position} icon={icon} interactive={false} />;
	}

	LabelMarker.propTypes = {
		position: PropTypes.arrayOf(PropTypes.number).isRequired,
		label: PropTypes.string.isRequired,
	};

	const updateVisibleMarkers = useCallback(() => {
    if (allSystems.length === 0) return;
    const bounds = map.getBounds();

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
      .filter((system) => {
        // Only include markers whose coordinates are within the current map bounds.
        return bounds.contains(L.latLng(system.latitude, system.longitude));
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
          name: system.name,
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
        };
      });
    setVisibleMarkers(newMarkers);
	}, [allSystems, activeFilters, map, zoomLevel]);

	useEffect(() => {
    updateVisibleMarkers();
  }, [allSystems, activeFilters, zoomLevel, updateVisibleMarkers]);

  // Update visible markers on every map moveend (panning/zooming)
  useEffect(() => {
    map.on("moveend", updateVisibleMarkers);
    return () => {
      map.off("moveend", updateVisibleMarkers);
    };
  }, [map, updateVisibleMarkers]);

  return (
    <>
      <PixiOverlay markers={visibleMarkers} />
      <LabelOverlay markers={visibleMarkers} />
    </>
  );
}

      {/* {visibleMarkers.map((marker) => (
        <LabelMarker
          key={`label-${marker.id}`}
          position={marker.position}
          label={marker.name}
        />
			))} */}


PixiMarkers.propTypes = {
  allSystems: PropTypes.array.isRequired,
  activeFilters: PropTypes.array.isRequired,
  map: PropTypes.object.isRequired,
  zoomLevel: PropTypes.number.isRequired,
};
