import { useEffect, useState, useCallback } from "react";
import { useMap } from "react-leaflet";
import { createPortal } from "react-dom";
import L from "leaflet";
import PropTypes from "prop-types";
import PixiOverlay from "react-leaflet-pixi-overlay";
import { DropShadowFilter } from "pixi-filters";

// SVGs as raw strings
import sharedSvg from "../../assets/marker-shared2.svg?raw";
import canonSvg from "../../assets/marker-canon2.svg?raw";
import legendsSvg from "../../assets/marker-legends2.svg?raw";
import errorSvg from "../../assets/marker-error2.svg?raw";

// --- Suppress Pixi's "BaseTexture added to the cache..." warnings ---
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes(" added to the cache with an id")
  ) {
    return;
  }
  originalWarn(...args);
};

// --------------------------------------------------------------------
// Helper Functions
// --------------------------------------------------------------------

function getMarkerColor(marker) {
  if (marker.iconId.startsWith("shared-svg-icon")) return "#e09f58";
  if (marker.iconId.startsWith("canon-svg-icon")) return "#e087cf";
  if (marker.iconId.startsWith("legends-svg-icon")) return "#00a8f2";
  return "red";
}

function calculateZIndex(starType) {
  if (starType === "MajorStar") return 3003;
  if (starType === "MinorStar") return 3002;
  if (starType === "MicroStar") return 3001;
  return 3000;
}

function calculateLabelFontSize(zoomLevel, starType, hasError) {
  if (hasError) return 30;

  if (starType === "MajorStar") {
    if (zoomLevel === 2) return 0;
    if (zoomLevel === 3) return 15;
    if (zoomLevel === 4) return 25;
    if (zoomLevel === 5) return 30;
    if (zoomLevel === 6) return 35;
    if (zoomLevel === 7) return 40;
		if (zoomLevel === 8) return 50;
    if (zoomLevel >= 9) return 55;
    return 55;
  } else if (starType === "MinorStar") {
    if (zoomLevel <= 4) return 0;
    if (zoomLevel === 5) return 18;
    if (zoomLevel === 6) return 25;
    if (zoomLevel === 7) return 35;
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

  // Default fallback
  if (zoomLevel <= 4) return 0;
  if (zoomLevel === 5) return 21;
  if (zoomLevel === 6) return 35;
  if (zoomLevel === 7) return 40;
  if (zoomLevel >= 8) return 45;
  return 30;
}

function updateSvgSize(svg, width, height) {
  let updatedSvg = svg.replace(/width="[^"]*"/g, `width="${width}"`);
  updatedSvg = updatedSvg.replace(/height="[^"]*"/g, `height="${height}"`);
  return updatedSvg;
}

// --------------------------------------------------------------------
// Label Overlay Component
// --------------------------------------------------------------------
function LabelOverlay({ markers, zoomLevel, setActivePopup, hoveredMarkerId }) {
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
        const computedFontSize = calculateLabelFontSize(
          zoomLevel,
          marker.starType,
          marker.hasError
        );

        // Hover logic
        const isHovered = marker.id === hoveredMarkerId;
        const hoveredFontSize = Math.round(computedFontSize * 1.4);
        const finalFontSize = isHovered ? hoveredFontSize : computedFontSize;

        // For horizontally shifting the label on hover
        const finalTransform = isHovered ? (marker.alignRight ? -12 : 12) : 0;

        // Colors & layout
        const color = getMarkerColor(marker);
        const halfIconWidth = marker.iconSize ? marker.iconSize[0] / 2 : 0;
        const offset = 4;
        const computedZIndex = calculateZIndex(marker.starType);

        const containerStyle = {
          position: "absolute",
          left: point.x,
          top: point.y,
          transform: "translate(-50%, -50%)",
          zIndex: computedZIndex + 1,
          pointerEvents: "auto",
          cursor: "none",
        };

        const labelStyle = {
          position: "absolute",
          ...(marker.alignRight
            ? { right: `${halfIconWidth + offset}px`, textAlign: "right" }
            : { left: `${halfIconWidth + offset}px`, textAlign: "left" }),
          transform: `translate(${finalTransform}px, -50%)`,
          zIndex: computedZIndex,
          color,
          padding: "0px 0px",
          borderRadius: "4%",
          whiteSpace: "nowrap",
          fontSize: `${finalFontSize}px`,
          fontWeight: "bold",
          fontFamily: "myriad-pro-condensed, sans-serif",
          WebkitTextStroke: "0.025em black",
          pointerEvents: "auto",
          cursor: "none",
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
  hoveredMarkerId: PropTypes.any,
};

// --------------------------------------------------------------------
// Custom Popup Overlay Component
// --------------------------------------------------------------------
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

CustomPopupOverlay.propTypes = {
  popup: PropTypes.shape({
    id: PropTypes.any,
    position: PropTypes.arrayOf(PropTypes.number),
    content: PropTypes.string,
  }),
  map: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

// --------------------------------------------------------------------
// Main PixiMarkers Component
// --------------------------------------------------------------------
export default function PixiMarkers({
  allSystems,
  activeFilters,
  map,
  zoomLevel,
}) {
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [activePopup, setActivePopup] = useState(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);

  // Hover detection via distance check
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { latlng } = e;
      const mousePoint = map.latLngToLayerPoint(latlng);

      let nearestMarkerId = null;
      let minDistanceSquared = Infinity;
      const hoverRadiusPx = 20;

      visibleMarkers.forEach((m) => {
        const markerPoint = map.latLngToLayerPoint(m.position);
        const dx = mousePoint.x - markerPoint.x;
        const dy = mousePoint.y - markerPoint.y;
        const distSq = dx * dx + dy * dy;
        if (
          distSq < hoverRadiusPx * hoverRadiusPx &&
          distSq < minDistanceSquared
        ) {
          minDistanceSquared = distSq;
          nearestMarkerId = m.id;
        }
      });

      setHoveredMarkerId((prev) =>
        prev === nearestMarkerId ? prev : nearestMarkerId
      );
    };

    map.on("mousemove", handleMouseMove);
    return () => {
      map.off("mousemove", handleMouseMove);
    };
  }, [map, visibleMarkers]);

  // Calculate marker sizes
  const calculateMajorIconSize = (zoom) => {
    if (zoom <= 2) return [8, 8];
    if (zoom === 3) return [15, 15];
    if (zoom === 4) return [20, 20];
    if (zoom === 5) return [25, 25];
    if (zoom === 6) return [30, 30];
    if (zoom === 7) return [40, 40];
    if (zoom === 8) return [45, 45];
    if (zoom >= 9) return [50, 50];
    return [55, 55];
  };

  const calculateMinorIconSize = (zoom) => {
    if (zoom <= 2) return [3, 3];
    if (zoom === 3) return [6, 6];
    if (zoom === 4) return [10, 10];
    if (zoom === 5) return [15, 15];
    if (zoom === 6) return [25, 25];
    if (zoom === 7) return [30, 30];
    if (zoom === 8) return [35, 35];
    if (zoom >= 9) return [45, 45];
    return [55, 55];
  };

  const calculateMicroIconSize = (zoom) => {
    if (zoom <= 3) return [0, 0];
    if (zoom === 4) return [5, 5];
    if (zoom === 5) return [10, 10];
    if (zoom === 6) return [12, 12];
    if (zoom === 7) return [14, 14];
    if (zoom === 8) return [22, 22];
    if (zoom >= 9) return [42, 42];
    return [0, 0];
  };

  // Build markers
  const updateVisibleMarkers = useCallback(() => {
    if (!allSystems.length) return;
    const bounds = map.getBounds();

    const calculateIconSize = (zoom, starType, hasError) => {
      if (hasError) return [100, 100];
      if (starType === "MajorStar") return calculateMajorIconSize(zoom);
      if (starType === "MinorStar") return calculateMinorIconSize(zoom);
      if (starType === "MicroStar") return calculateMicroIconSize(zoom);
      return [80, 80];
    };

    const dropShadow = new DropShadowFilter({
      distance: 5,
      rotation: 45,
      alpha: 0.5,
      blur: 4,
      quality: 4,
    });

		const newMarkers = allSystems
		.filter((system) => {
			const matchesShared = system.isCanon && system.isLegends;
			const matchesCanon = system.isCanon && !system.isLegends;
			const matchesLegends = !system.isCanon && system.isLegends;

			// If system matches a known filter, check if the filter is active
			if (matchesShared) return activeFilters.includes("shared");
			if (matchesCanon) return activeFilters.includes("canon");
			if (matchesLegends) return activeFilters.includes("legends");

			// If the system doesn't match any of the filters above (error state), always render it
			return true;
		})
		.filter((system) => {
			return bounds.contains(L.latLng(system.latitude, system.longitude));
		})
		.map((system) => {
			// Decide which raw SVG
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

        // Calculate size
        const [w, h] = calculateIconSize(
          zoomLevel,
          system.starType,
          system.hasError
        );
        if (w === 0 && h === 0) return null;

        // If hovered, pick a bigger version
        const isHovered = system.id === hoveredMarkerId;
        const bigSvg = updateSvgSize(chosenSvg, w + 20, h + 20);
        const sizedSvg = updateSvgSize(chosenSvg, w, h);

        // Unique icon ID for caching
        const finalIconId = `${
          system.isCanon && system.isLegends
            ? "shared-svg-icon"
            : system.isCanon
            ? "canon-svg-icon"
            : system.isLegends
            ? "legends-svg-icon"
            : "error-svg-icon"
        }-zoom-${zoomLevel}-${w}x${h}${isHovered ? "-hover" : ""}`;

        return {
          id: system.id,
          name: system.name,
          position: [system.latitude, system.longitude],
          customIcon: isHovered ? bigSvg : sizedSvg,
          markerSpriteAnchor: [0.5, 0.5],
          iconId: finalIconId,
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
                    content: `<a href="${system.wiki}"
											target="_blank"
											style="color:
											inherit;
											text-decoration: none;">
											${system.name} Wiki Page
											</a>`,
                  };
            });
          },
          filters: [dropShadow],
        };
      })
      .filter((m) => m !== null);

    setVisibleMarkers(newMarkers);
  }, [
    allSystems,
    activeFilters,
    map,
    zoomLevel,
    hoveredMarkerId,
    setActivePopup,
  ]);

  // Recompute markers
  useEffect(() => {
    updateVisibleMarkers();
  }, [allSystems, activeFilters, zoomLevel, updateVisibleMarkers]);

  // Recompute on map move
	useEffect(() => {
		map.on("move", updateVisibleMarkers);
		map.on("zoom", updateVisibleMarkers);  // ensures markers also reposition correctly during zoom

		return () => {
			map.off("move", updateVisibleMarkers);
			map.off("zoom", updateVisibleMarkers);
		};
	}, [map, updateVisibleMarkers]);

  // Close the popup if user clicks elsewhere
  useEffect(() => {
    let clickHandler;
    if (activePopup) {
      clickHandler = () => setActivePopup(null);
      const timeoutId = setTimeout(() => {
        map.on("click", clickHandler);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        map.off("click", clickHandler);
      };
    }
  }, [map, activePopup]);

  // Render
  return (
    <>
      <PixiOverlay
        markers={visibleMarkers}
        onSpriteCreated={(sprite, marker) => {
          // Check if the marker has filters defined and apply them.
          if (marker.filters) {
            sprite.filters = marker.filters;
          }
        }}
      />
      <LabelOverlay
        markers={visibleMarkers}
        zoomLevel={zoomLevel}
        setActivePopup={setActivePopup}
        hoveredMarkerId={hoveredMarkerId}
      />
      <CustomPopupOverlay
        popup={activePopup}
        map={map}
        onClose={() => setActivePopup(null)}
      />
    </>
  );
}

// --------------------------------------------------------------------
// Prop Types
// --------------------------------------------------------------------
PixiMarkers.propTypes = {
  allSystems: PropTypes.array.isRequired,
  activeFilters: PropTypes.array.isRequired,
  map: PropTypes.object.isRequired,
  zoomLevel: PropTypes.number.isRequired,
  popup: PropTypes.string,
  onClose: PropTypes.string,
};
