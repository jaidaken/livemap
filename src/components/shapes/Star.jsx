import React, { useRef, useEffect, useState, useMemo } from "react";
import { Marker, Tooltip, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import PropTypes from "prop-types";
import markerIconCanon from "../../assets/marker-canon.svg";
import markerIconLegends from "../../assets/marker-legends.svg";
import markerIconShared from "../../assets/marker-shared.svg";
import markerIconError from "../../assets/marker-error.svg";

const debounce = (func, wait) => {
  let timeout;
  function debounced(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
};

const Star = (props) => {
  const {
    position,
    name,
    wiki,
    isCanon,
    isLegends,
    hasError,
    alignRight,
    starType,
  } = props;

  const markerRef = useRef(null);

  const [zoomLevel, setZoomLevel] = useState(() => {
    const savedZoom = localStorage.getItem("zoomLevel");
    return savedZoom ? parseInt(savedZoom) : 5;
  });

  const [iconSize, setIconSize] = useState([10, 10]);
  const [fontSize, setFontSize] = useState(12);
  const [strokeSize, setStrokeSize] = useState("1px black");
  const [marginLeft, setMarginLeft] = useState("0px");
  const [marginRight, setMarginRight] = useState("0px");

  useEffect(() => {
    const handleZoomChange = debounce(() => {
      const updatedZoom = parseInt(localStorage.getItem("zoomLevel") || "5");
      setZoomLevel(updatedZoom);
    }, 300);

    window.addEventListener("storage", handleZoomChange);
    window.addEventListener("zoomend", handleZoomChange);

    const interval = setInterval(handleZoomChange, 500);

    return () => {
      window.removeEventListener("storage", handleZoomChange);
      window.removeEventListener("zoomend", handleZoomChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const calculateIconSize = () => {
      if (hasError) return [10, 10];
      if (starType === "MajorStar") return calculateMajorIconSize();
      if (starType === "MidStar") return calculateMidIconSize();
      if (starType === "MicroStar") return calculateMicroIconSize();
      return calculateMinIconSize();
    };

    const calculateMajorIconSize = () => {
      if (zoomLevel <= 2) return [10, 10];
      if (zoomLevel === 3) return [16, 16];
      if (zoomLevel === 4) return [20, 20];
      if (zoomLevel === 5) return [30, 30];
      if (zoomLevel >= 6) return [40, 40];
      return [55, 55];
    };

    const calculateMidIconSize = () => {
      if (zoomLevel <= 3) return [10, 10];
      if (zoomLevel === 4) return [18, 18];
      if (zoomLevel === 5) return [22, 22];
      if (zoomLevel === 6) return [30, 30];
      if (zoomLevel === 7) return [40, 40];
      if (zoomLevel === 8) return [55, 55];
      return [70, 70];
    };

    const calculateMicroIconSize = () => {
      if (zoomLevel <= 5) return [0, 0];
      if (zoomLevel === 6) return [15, 15];
      if (zoomLevel === 7) return [20, 20];
      if (zoomLevel === 8) return [22, 22];
      return [20, 20];
    };

    const calculateMinIconSize = () => {
      if (zoomLevel <= 2) return [6, 6];
      if (zoomLevel === 3) return [10, 10];
      if (zoomLevel === 4) return [10, 10];
      if (zoomLevel === 5) return [15, 15];
      if (zoomLevel === 6) return [25, 25];
      if (zoomLevel === 7) return [30, 30];
      if (zoomLevel === 8) return [35, 35];
      if (zoomLevel === 9) return [40, 40];
      return [20, 20];
    };

    const calculateFontSize = () => {
      if (hasError) return 30;
      if (starType === "MajorStar") return calculateMajorFontSize();
      if (starType === "MidStar") return calculateMidFontSize();
      if (starType === "MicroStar") return calculateMicroFontSize();
      return calculateDefaultFontSize();
    };

    const calculateMajorFontSize = () => {
      if (zoomLevel === 3) return 30;
      if (zoomLevel === 4) return 30;
      if (zoomLevel === 5) return 35;
      if (zoomLevel === 6) return 40;
      return 55;
    };

    const calculateMidFontSize = () => {
      if (zoomLevel === 4) return 18;
      if (zoomLevel === 5) return 22;
      if (zoomLevel === 6) return 30;
      if (zoomLevel === 7) return 40;
      return 55;
    };

    const calculateMicroFontSize = () => {
      if (zoomLevel <= 6) return 0;
      if (zoomLevel === 7) return 22;
      return 30;
    };

    const calculateDefaultFontSize = () => {
      if (zoomLevel === 5) return 21;
      if (zoomLevel === 6) return 35;
      if (zoomLevel === 7) return 40;
      if (zoomLevel >= 8) return 45;
      return 30;
    };

    const calculateStrokeSize = () => {
      if (hasError) return "0px black";
      if (starType === "MajorStar") return calculateMajorStroke();
      if (starType === "MidStar") return calculateMidStroke();
      if (starType === "MicroStar") return calculateMicroStroke();
      return calculateDefaultStroke();
    };

    const calculateMajorStroke = () => {
      if (zoomLevel <= 4) return "0.8px black";
      if (zoomLevel === 5) return "0.8px black";
      if (zoomLevel === 6) return "1px black";
      if (zoomLevel === 7) return "1.2px black";
      if (zoomLevel === 8) return "1.5px black";
      return "1px black";
    };

    const calculateMidStroke = () => {
      if (zoomLevel <= 4) return "0.6px black";
      if (zoomLevel === 5) return "0.7px black";
      if (zoomLevel === 6) return "0.8px black";
      return "1px black";
    };

    const calculateMicroStroke = () => {
      if (zoomLevel <= 7) return "0.8px black";
      return "0.8px black";
    };

    const calculateDefaultStroke = () => {
      if (zoomLevel === 5) return "0.5px black";
      if (zoomLevel === 6) return "0.8px black";
      if (zoomLevel === 7) return "1px black";
      if (zoomLevel === 8) return "1.5px black";
      return "1px black";
    };

    const calculateMarginLeftSize = () => {
      if (hasError) return "30px";
      if (starType === "MajorStar") return calculateMajorMarginLeft();
      if (starType === "MidStar") return calculateMidMarginLeft();
      if (starType === "MicroStar") return calculateMicroMarginLeft();
      return calculateDefaultMarginLeft();
    };

    const calculateMajorMarginLeft = () => {
      if (zoomLevel <= 4) return "6px";
      if (zoomLevel === 5) return "12px";
      if (zoomLevel === 6) return "16px";
      return "24px";
    };

    const calculateMidMarginLeft = () => {
      if (zoomLevel <= 4) return "6px";
      if (zoomLevel === 5) return "10px";
      if (zoomLevel === 6) return "12px";
      if (zoomLevel === 7) return "18px";
      return "26px";
    };

    const calculateMicroMarginLeft = () => {
      if (zoomLevel <= 7) return "8px";
      return "10px";
    };

    const calculateDefaultMarginLeft = () => {
      if (zoomLevel <= 4) return "0px";
      if (zoomLevel === 5) return "4px";
      if (zoomLevel === 6) return "10px";
      if (zoomLevel === 7) return "12px";
      if (zoomLevel === 8) return "14px";
      if (zoomLevel === 9) return "18px";
      return "8px";
    };

    const calculateMarginRightSize = () => {
      if (hasError) return "30px";
      if (starType === "MajorStar") return calculateMajorMarginRight();
      if (starType === "MidStar") return calculateMidMarginRight();
      if (starType === "MicroStar") return calculateMicroMarginRight();
      return calculateDefaultMarginRight();
    };

    const calculateMajorMarginRight = () => {
      if (zoomLevel <= 4) return "6px";
      if (zoomLevel === 5) return "12px";
      if (zoomLevel === 6) return "18px";
      return "24px";
    };

    const calculateMidMarginRight = () => {
      if (zoomLevel <= 4) return "6px";
      if (zoomLevel === 5) return "10px";
      if (zoomLevel === 6) return "12px";
      if (zoomLevel === 7) return "18px";
      return "26px";
    };

    const calculateMicroMarginRight = () => {
      if (zoomLevel <= 7) return "8px";
      return "10px";
    };

    const calculateDefaultMarginRight = () => {
      if (zoomLevel <= 4) return "0px";
      if (zoomLevel === 5) return "4px";
      if (zoomLevel === 6) return "10px";
      if (zoomLevel === 7) return "12px";
      if (zoomLevel === 8) return "14px";
      if (zoomLevel === 9) return "18px";
      return "8px";
    };



    setIconSize(calculateIconSize());
    setFontSize(calculateFontSize());
    setStrokeSize(calculateStrokeSize());
    setMarginLeft(calculateMarginLeftSize());
    setMarginRight(calculateMarginRightSize());
  }, [zoomLevel, starType, hasError]);

  const loadIcon = (iconUrl) => {
    const icon = new Image();
    icon.src = iconUrl;
    return icon;
  };

  const markerIcon = useMemo(() => {
    if (hasError) return loadIcon(markerIconError);
    if (isCanon && !isLegends) return loadIcon(markerIconCanon);
    if (!isCanon && isLegends) return loadIcon(markerIconLegends);
    if (isCanon && isLegends) return loadIcon(markerIconShared);
    return loadIcon(markerIconError);
  }, [hasError, isCanon, isLegends]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const iconAnchor = useMemo(() => iconSize.map((dim) => dim / 2), [iconSize]);

  const icon = useMemo(
    () =>
      new Icon({
        iconUrl: markerIcon !== null ? markerIcon.src : markerIconError,
        iconSize: isHovered ? iconSize.map((dim) => dim * 1.4) : iconSize,
        iconAnchor: iconAnchor,
        popupAnchor: [7, -10],
        className: "leaflet-marker-icon-transition", // Add class for transition
      }),
    [markerIcon, iconSize, iconAnchor, isHovered]
	);

	const calculateGrowthLeft = () => {
		if (zoomLevel <= 4) return "0px";
		if (zoomLevel === 5) return "4px";
		if (zoomLevel === 6) return "10px";
		if (zoomLevel === 7) return "12px";
		if (zoomLevel === 8) return "14px";
		if (zoomLevel === 9) return "18px";
		return "8px";
	};

	const calculateGrowthRight = () => {
		if (zoomLevel <= 4) return "0px";
		if (zoomLevel === 5) return "-1px";
		if (zoomLevel >= 6) return "-4px";
		return "-4px";
	};

  // Add this useEffect to apply the transition style
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
			.leaflet-marker-icon-transition {
				transition: all 0.5s ease;
				transformOrigin: alignRight ? "top right" : "top left",
			}
		`;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const applyStrokeStyles = () => {
      const svgElements = document.querySelectorAll(".icon-shadow");
      svgElements.forEach((svg) => {
        svg.style.stroke = "black";
        svg.style.strokeWidth = "12px";
      });
    };

    const timeoutId = setTimeout(applyStrokeStyles, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const starStyle = {
    fontSize: `${fontSize}px`,
    fontWeight: "bold",
    color: hasError
      ? "#C7303A"
      : isCanon && !isLegends
      ? "#F6A6CA"
      : !isCanon && isLegends
      ? "#529DD4"
      : isCanon && isLegends
      ? "#E3B687"
      : "#C7303A",
    WebkitTextStroke: strokeSize,
    marginTop: "0px",
    marginRight: alignRight ? marginRight : 0,
    marginLeft: !alignRight ? marginLeft : 0,
    position: "relative",
    zIndex: hasError
      ? 11
      : isCanon && !isLegends
      ? 9
      : !isCanon && isLegends
      ? 8
      : isCanon && isLegends
      ? 10
      : 7,
    transition: "transform 0.5s ease",
    transform: isHovered
      ? alignRight
        ? `scale(1.2)  translateX(${calculateGrowthRight()})`
        : `scale(1.2)  translateX(${calculateGrowthLeft()})`
      : "scale(1)",
    transformOrigin: alignRight ? "top right" : "top left",
  };

  const onTooltipClick = () => {
    if (markerRef.current) {
      markerRef.current.leafletElement.fireEvent("click");
    }
  };

  if (zoomLevel < 2) {
    return null;
  }

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={icon}
      eventHandlers={{
        mouseover: handleMouseEnter,
        mouseout: handleMouseLeave,
      }}
    >
      {zoomLevel >= 3 && starType === "MajorStar" ? (
        <Tooltip
          interactive={true}
          onClick={onTooltipClick}
          direction={alignRight === true ? "left" : "right"}
          className={alignRight ? "align-right" : "align-left"}
          opacity={1}
          permanent
        >
          <div
            className={
              alignRight
                ? "marker-popup marker-animate name-shadow align-right"
                : "marker-popup marker-animate name-shadow align-left"
            }
            style={starStyle}
          >
            {name}
          </div>
        </Tooltip>
      ) : zoomLevel >= 4 && starType === "MidStar" ? (
        <Tooltip
          interactive={true}
          onClick={onTooltipClick}
          direction={alignRight === true ? "left" : "right"}
          className={alignRight ? "align-right" : "align-left"}
          opacity={1}
          permanent
        >
          <div
            className={
              alignRight
                ? "marker-popup marker-animate name-shadow align-right"
                : "marker-popup marker-animate name-shadow align-left"
            }
            style={starStyle}
          >
            {name}
          </div>
        </Tooltip>
      ) : zoomLevel >= 5 ? (
        <Tooltip
          interactive={true}
          onClick={onTooltipClick}
          direction={alignRight === true ? "left" : "right"}
          className={alignRight ? "align-right" : "align-left"}
          opacity={1}
          permanent
        >
          <div
            className={
              alignRight
                ? "marker-popup marker-animate name-shadow align-right"
                : "marker-popup marker-animate name-shadow align-left"
            }
            style={starStyle}
          >
            {name}
          </div>
        </Tooltip>
      ) : null}
      <Popup>
        <a href={`${wiki}`} target="_blank" rel="noreferrer">
          {name} wiki page
        </a>
      </Popup>
    </Marker>
  );
};

Star.propTypes = {
  position: PropTypes.array,
  name: PropTypes.string,
  wiki: PropTypes.string,
  isCanon: PropTypes.bool,
  isLegends: PropTypes.bool,
  hasError: PropTypes.bool,
  alignRight: PropTypes.bool,
  starType: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const MemoizedStar = React.memo(Star);

export default MemoizedStar;
