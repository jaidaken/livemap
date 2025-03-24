import { useEffect, useState, useCallback } from "react";
import { useMap } from "react-leaflet";
import { createPortal } from "react-dom";
import L from "leaflet";
import PropTypes from "prop-types";
import PixiOverlay from "react-leaflet-pixi-overlay";
import * as PIXI from "pixi.js";

// Import your SVGs as raw strings:
import sharedSvg from "../../assets/marker-shared2.svg?raw";
import canonSvg from "../../assets/marker-canon2.svg?raw";
import legendsSvg from "../../assets/marker-legends2.svg?raw";
import errorSvg from "../../assets/marker-error2.svg?raw";

const getMarkerColor = (marker) => {
  if (marker.iconId.startsWith("shared-svg-icon")) return "#e3b685"; // orange for shared
  if (marker.iconId.startsWith("canon-svg-icon")) return "#f6ade7"; // blue for canon
  if (marker.iconId.startsWith("legends-svg-icon")) return "#00a8f2"; // green for legends
  return "red";
};

const calculateZIndex = (starType) => {
  if (starType === "MajorStar") {
    return 3003;
  } else if (starType === "MinorStar") {
    return 3002;
  } else if (starType === "MicroStar") {
    return 3001;
  } else {
    return 3000;
  }
};

const calculateLabelFontSize = (zoomLevel, starType, hasError) => {
  if (hasError) return 30;
  if (starType === "MajorStar") {
    if (zoomLevel === 2) return 0;
    if (zoomLevel === 3) return 20;
    if (zoomLevel === 4) return 30;
    if (zoomLevel === 5) return 35;
    if (zoomLevel === 6) return 40;
    return 55;
  } else if (starType === "MinorStar") {
    if (zoomLevel <= 4) return 0;
    if (zoomLevel === 5) return 21;
    if (zoomLevel === 6) return 35;
    if (zoomLevel === 7) return 40;
    if (zoomLevel === 8) return 40;
    if (zoomLevel >= 9) return 55;
    return 55;
  } else if (starType === "MicroStar") {
    if (zoomLevel <= 6) return 0;
    if (zoomLevel === 7) return 18;
    if (zoomLevel === 8) return 20;
    if (zoomLevel >= 9) return 28;
    return 30;
  }
  // default fallback
  if (zoomLevel <= 4) return 0;
  if (zoomLevel === 5) return 21;
  if (zoomLevel === 6) return 35;
  if (zoomLevel === 7) return 40;
  if (zoomLevel >= 8) return 45;
  return 30;
};

function LabelOverlay({ markers, zoomLevel, setActivePopup }) {
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
    <div style={{ position: "relative" }}>
      {markers.map((marker) => {
        const point = map.latLngToLayerPoint(marker.position);
        const color = getMarkerColor(marker);
        // Determine half the icon's width (if provided)
        const halfIconWidth = marker.iconSize ? marker.iconSize[0] / 2 : 0;
        // A constant offset for spacing (adjust as needed)
        const offset = 4;
        const computedFontSize = calculateLabelFontSize(
          zoomLevel,
          marker.starType,
          marker.hasError
        );
        const computedZIndex = calculateZIndex(marker.starType);

        // The outer container is absolutely positioned at the marker
        const containerStyle = {
          position: "absolute",
          left: point.x,
          top: point.y,
          transform: "translate(-50%, -50%)",
          zIndex: computedZIndex + 1,
          pointerEvents: "auto", // allow label clicks
          cursor: "pointer", // indicate interactivity
        };

        const labelStyle = {
          position: "absolute",
          // Use left or right property based on alignRight
          ...(marker.alignRight
            ? { right: `${halfIconWidth + offset}px`, textAlign: "right" }
            : { left: `${halfIconWidth + offset}px`, textAlign: "left" }),
          transform: "translate(0, -50%)", // vertical centering
          zIndex: computedZIndex,
          color: color,
          padding: "0px 0px",
          borderRadius: "4%",
          whiteSpace: "nowrap",
          fontSize: `${computedFontSize}px`,
          fontWeight: "bold",
          fontFamily: "myriad-pro-condensed, sans-serif",
          WebkitTextStroke: "0.025em black",
          pointerEvents: "auto", // allow label clicks
          cursor: "pointer", // indicate interactivity
        };

        return (
          <div key={`label-${marker.id}`} style={containerStyle}>
            <div
              className="custom-label"
              style={labelStyle}
              onClick={() => {
                setActivePopup((prev) =>
                  prev?.id === marker.id
                    ? null
                    : {
                        id: marker.id,
                        position: marker.position,
                        content: `<a href="${marker.wiki}" target="_blank" style="color: #0645AD; text-decoration: underline;">${marker.name} Wiki Page</a>`,
                      }
                );
              }}
            >
              {marker.name}
            </div>
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
      iconId: PropTypes.string,
      iconSize: PropTypes.arrayOf(PropTypes.number),
      starType: PropTypes.string,
      hasError: PropTypes.bool,
    })
  ).isRequired,
  zoomLevel: PropTypes.number.isRequired,
  setActivePopup: PropTypes.func.isRequired,
};

// Helper: update SVG width and height attributes
const updateSvgSize = (svg, width, height) => {
  let updatedSvg = svg.replace(/width="[^"]*"/g, `width="${width}"`);
  updatedSvg = updatedSvg.replace(/height="[^"]*"/g, `height="${height}"`);
  return updatedSvg;
};

export default function PixiMarkers({
  allSystems,
  activeFilters,
  map,
  zoomLevel,
}) {
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [activePopup, setActivePopup] = useState(null);

	const updateVisibleMarkers = useCallback(() => {

		if (allSystems.length === 0) return;
		
    const bounds = map.getBounds();

    const calculateIconSize = (zoomLevel, starType, hasError) => {
      if (hasError) return [100, 100];
      if (starType === "MajorStar") return calculateMajorIconSize(zoomLevel);
      if (starType === "MinorStar") return calculateMinorIconSize(zoomLevel);
      if (starType === "MicroStar") return calculateMicroIconSize(zoomLevel);
      return [80, 80];
    };

    const calculateMajorIconSize = (zoomLevel) => {
      if (zoomLevel <= 2) return [10, 10];
      if (zoomLevel === 3) return [16, 16];
      if (zoomLevel === 4) return [20, 20];
      if (zoomLevel === 5) return [30, 30];
      if (zoomLevel === 6) return [40, 40];
      if (zoomLevel === 7) return [45, 45];
      if (zoomLevel === 8) return [50, 50];
      if (zoomLevel >= 9) return [60, 60];
      return [55, 55];
    };

    const calculateMinorIconSize = (zoomLevel) => {
      if (zoomLevel <= 4) return [10, 10];
      if (zoomLevel === 5) return [18, 18];
      if (zoomLevel === 6) return [22, 22];
      if (zoomLevel === 7) return [30, 30];
      if (zoomLevel === 8) return [40, 40];
      if (zoomLevel >= 9) return [50, 50];
      return [55, 55];
    };

    const calculateMicroIconSize = (zoomLevel) => {
      if (zoomLevel <= 4) return [0, 0];
      if (zoomLevel === 5) return [8, 8];
      if (zoomLevel === 6) return [10, 10];
      if (zoomLevel === 7) return [14, 14];
      if (zoomLevel === 8) return [22, 22];
      if (zoomLevel >= 9) return [42, 42];
      return [0, 0];
    };

    const newMarkers = allSystems
      .filter((system) => {
        if (
          activeFilters.includes("shared") &&
          system.isCanon &&
          system.isLegends
        )
          return true;
        if (
          activeFilters.includes("canon") &&
          system.isCanon &&
          !system.isLegends
        )
          return true;
        if (
          activeFilters.includes("legends") &&
          !system.isCanon &&
          system.isLegends
        )
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
        const [w, h] = calculateIconSize(
          zoomLevel,
          system.starType,
          system.hasError
        );

        if (w === 0 && h === 0) return null;
        const sizedSvg = updateSvgSize(chosenSvg, w, h);
        return {
          id: system.id,
          name: system.name,
          position: [system.latitude, system.longitude],
          customIcon: sizedSvg,
          markerSpriteAnchor: [0.5, 0.5],
          iconId: `${
            system.isCanon && system.isLegends
              ? "shared-svg-icon"
              : system.isCanon
              ? "canon-svg-icon"
              : system.isLegends
              ? "legends-svg-icon"
              : "error-svg-icon"
          }-zoom-${zoomLevel}-${w}x${h}`,
          iconSize: [w, h],
          starType: system.starType,
          hasError: system.hasError,
          wiki: system.wiki,
          alignRight: system.alignRight || false,
          onClick: () => {
            setActivePopup((current) => {
              const isSame = current?.id === system.id;
              return isSame
                ? null
                : {
                    id: system.id,
                    position: [system.latitude, system.longitude],
                    content: `<a href="${system.wiki}" target="_blank" style="color: inherit; text-decoration: none;">${system.name} Wiki Page</a>`,
                  };
            });
          },
        };
      })
      .filter((marker) => marker !== null);

    setVisibleMarkers(newMarkers);
  }, [allSystems, activeFilters, map, zoomLevel]);

  function CustomPopupOverlay({ popup, map, onClose }) {
    if (!popup) return null;
    const point = map.latLngToLayerPoint(popup.position);

    const popupContainerStyle = {
      position: "absolute",
      left: point.x,
      top: point.y,
      transform: "translate(-50%, -140%)",
      background: "white",
      padding: "10px 20px",
      border: "1px solid transparent",
      borderRadius: "8px",
      pointerEvents: "auto",
      zIndex: 4000,
      whiteSpace: "nowrap",
      display: "inline-block",
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#2a7ae2",
      textDecoration: "underline",
      maxWidth: "calc(100vw - 40px)",
    };

    const arrowStyle = {
      position: "absolute",
      left: "50%",
      bottom: "-10px",
      transform: "translateX(-50%)",
      width: 0,
      height: 0,
      borderLeft: "10px solid transparent",
      borderRight: "10px solid transparent",
      borderTop: "10px solid white",
    };

    return createPortal(
      <div
        style={popupContainerStyle}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={onClose}
      >
        <div dangerouslySetInnerHTML={{ __html: popup.content }}></div>
        <div style={arrowStyle}></div>
      </div>,
      map.getPanes().overlayPane
    );
  }

  useEffect(() => {
    let clickHandler;

    if (activePopup) {
      // Delay setting up the click handler to allow marker click to finish
      clickHandler = () => {
        setActivePopup(null);
      };
      const timeoutId = setTimeout(() => {
        map.on("click", clickHandler);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        map.off("click", clickHandler);
      };
    }
  }, [map, activePopup]);

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
      <PixiOverlay
        markers={visibleMarkers}
      />
      <LabelOverlay
        markers={visibleMarkers}
        zoomLevel={zoomLevel}
        setActivePopup={setActivePopup}
      />
      <CustomPopupOverlay
        popup={activePopup}
        map={map}
        onClose={() => setActivePopup(null)}
      />
    </>
  );
}

PixiMarkers.propTypes = {
  allSystems: PropTypes.array.isRequired,
  activeFilters: PropTypes.array.isRequired,
  map: PropTypes.object.isRequired,
  zoomLevel: PropTypes.number.isRequired,
  popup: PropTypes.string,
  onClose: PropTypes.string,
};
