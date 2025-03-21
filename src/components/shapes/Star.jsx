import React, { useRef, useEffect, useState } from "react";
import { Marker, Tooltip, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import PropTypes from "prop-types";
import markerIconCanon from "../../assets/marker-canon.svg";
import markerIconLegends from "../../assets/marker-legends.svg";
import markerIconShared from "../../assets/marker-shared.svg";
import markerIconError from "../../assets/marker-error.svg";
// import markerIconMajor from "../../assets/marker-icon-major.svg";
// import markerIconMid from "../../assets/marker-icon-mid.svg";

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

  useEffect(() => {
    const handleZoomChange = () => {
      const updatedZoom = parseInt(localStorage.getItem("zoomLevel") || "5");
      setZoomLevel(updatedZoom);
    };

    window.addEventListener("storage", handleZoomChange);
    window.addEventListener("zoomend", handleZoomChange);

    const interval = setInterval(handleZoomChange, 500);

    return () => {
      window.removeEventListener("storage", handleZoomChange);
      window.removeEventListener("zoomend", handleZoomChange);
      clearInterval(interval);
    };
  }, []);

  const calculateIcon = () => {
    let markerIcon;

    if (hasError) {
      markerIcon = markerIconError;
    } else if (isCanon && !isLegends) {
      markerIcon = markerIconCanon;
    } else if (!isCanon && isLegends) {
      markerIcon = markerIconLegends;
    } else if (isCanon && isLegends) {
      markerIcon = markerIconShared;
    } else {
      markerIcon = markerIconError;
    }

    return markerIcon;
  };

  const markerIcon = calculateIcon();

  const calculateIconSize = () => {
    let iconSize;

    if (hasError) {
      iconSize = [10, 10];
    } else if (starType === "MajorStar") {
      iconSize = calculateMajorIconSize();
    } else if (starType === "MidStar") {
      iconSize = calculateMidIconSize();
    } else if (starType === "MicroStar") {
      iconSize = calculateMicroIconSize();
    } else {
      iconSize = calculateMinIconSize();
    }

    return iconSize;
  };

  const calculateMajorIconSize = () => {
    if (zoomLevel <= 3) return [20, 20];
    if (zoomLevel === 4) return [20, 20];
    if (zoomLevel === 5) return [30, 30];
    if (zoomLevel === 6) return [40, 40];
    if (zoomLevel === 7) return [40, 40];
    if (zoomLevel === 8) return [40, 40];
    if (zoomLevel === 9) return [40, 40];
    return [55, 55];
  };

  const calculateMidIconSize = () => {
    if (zoomLevel <= 4) return [18, 18];
    if (zoomLevel === 5) return [22, 22];
    if (zoomLevel === 6) return [30, 30];
    if (zoomLevel === 7) return [40, 40];
    if (zoomLevel === 8) return [55, 55];
    if (zoomLevel === 9) return [70, 70];
    return [55, 55];
  };

  const calculateMicroIconSize = () => {
    if (zoomLevel <= 5) return [0, 0];
    if (zoomLevel === 6) return [15, 15];
    if (zoomLevel === 7) return [20, 20];
    if (zoomLevel === 8) return [22, 22];
    return [20, 20];
  };

  const calculateMinIconSize = () => {
    if (zoomLevel <= 5) return [15, 15];
    if (zoomLevel === 6) return [25, 25];
    if (zoomLevel === 7) return [30, 30];
    if (zoomLevel === 8) return [35, 35];
    if (zoomLevel === 9) return [40, 40];
    return [20, 20];
  };

  const calculateMajorFontSize = () => {
    if (zoomLevel === 3) return 30;
    if (zoomLevel === 4) return 30;
    if (zoomLevel === 5) return 35;
    if (zoomLevel === 6) return 40;
    return 55;
  };

  const calculateMajorMargin = () => {
    if (zoomLevel <= 4) return "6px";
    if (zoomLevel === 5) return "12px";
    if (zoomLevel === 6) return "16px";
    return "24px";
  };

  const calculateMajorMarginRight = () => {
    if (zoomLevel <= 4) return "6px";
    if (zoomLevel === 5) return "12px";
    if (zoomLevel === 6) return "18px";
    return "24px";
  };

  const calculateMajorStroke = () => {
    if (zoomLevel <= 4) return "0.6px black";
    if (zoomLevel === 5) return "0.7px black";
    if (zoomLevel === 6) return "0.8px black";
    return "1px black";
  };

  const calculateMidFontSize = () => {
    if (zoomLevel === 4) return 18;
    if (zoomLevel === 5) return 22;
    if (zoomLevel === 6) return 30;
    if (zoomLevel === 7) return 40;
    return 55;
  };

  const calculateMidMargin = () => {
    if (zoomLevel <= 4) return "6px";
    if (zoomLevel === 5) return "10px";
    if (zoomLevel === 6) return "12px";
    if (zoomLevel === 7) return "18px";
    return "26px";
  };

  const calculateMidMarginRight = () => {
    if (zoomLevel <= 4) return "6px";
    if (zoomLevel === 5) return "10px";
    if (zoomLevel === 6) return "12px";
    if (zoomLevel === 7) return "18px";
    return "26px";
  };

  const calculateMidStroke = () => {
    if (zoomLevel <= 4) return "0.6px black";
    if (zoomLevel === 5) return "0.7px black";
    if (zoomLevel === 6) return "0.8px black";
    return "1px black";
  };

  const calculateMicroFontSize = () => {
    if (zoomLevel <= 6) return 0;
    if (zoomLevel === 7) return 22;
    return 30;
  };

  const calculateMicroMargin = () => {
    if (zoomLevel <= 7) return "8px";
    return "10px";
  };

  const calculateMicroMarginRight = () => {
    if (zoomLevel <= 7) return "8px";
    return "10px";
  };

  const calculateMicroStroke = () => {
    if (zoomLevel <= 7) return "0.8px black";
    return "0.8px black";
  };

  const calculateFontSize = () => {
    if (zoomLevel === 5) return 21;
    if (zoomLevel === 6) return 35;
    if (zoomLevel === 7) return 40;
    if (zoomLevel >= 8) return 45;
    return 30;
  };

  const calculateMarginLeft = () => {
    if (zoomLevel <= 4) return "0px";
    if (zoomLevel === 5) return "4px";
    if (zoomLevel === 6) return "10px";
    if (zoomLevel === 7) return "12px";
    if (zoomLevel === 8) return "14px";
    if (zoomLevel === 9) return "18px";
    return "8px";
  };

  const calculateMarginRight = () => {
    if (zoomLevel <= 4) return "0px";
    if (zoomLevel === 5) return "4px";
    if (zoomLevel === 6) return "10px";
    if (zoomLevel === 7) return "12px";
    if (zoomLevel === 8) return "14px";
    if (zoomLevel === 9) return "18px";
    return "8px";
  };

  const calculateStroke = () => {
    if (zoomLevel === 5) return "0.8px";
    if (zoomLevel === 6) return "1px";
    if (zoomLevel === 7) return "1.5px";
    if (zoomLevel === 8) return "1.8px";
    return "1px";
  };

  const iconSize = calculateIconSize();
  const iconAnchor = iconSize.map((dim) => dim / 2);

  const icon = new Icon({
    iconUrl: markerIcon !== null ? markerIcon : markerIconError,
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: [7, -10],
    className: "icon-shadow",
  });

  useEffect(() => {
    const applyStrokeStyles = () => {
      const svgElements = document.querySelectorAll(".icon-shadow");
      svgElements.forEach((svg) => {
        svg.style.stroke = "black";
        svg.style.strokeWidth = "12px";
      });
    };

    // Apply styles after a short delay
    const timeoutId = setTimeout(applyStrokeStyles, 100);

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, []);
  // Apply different styles based on starType
  const starStyle =
    starType === "MajorStar"
      ? {
          fontSize: calculateMajorFontSize(),
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
          WebkitTextStroke: calculateMajorStroke(),
          textAlign: "left",
          zIndex: hasError
            ? 11
            : isCanon && !isLegends
            ? 9
            : !isCanon && isLegends
            ? 8
            : isCanon && isLegends
            ? 10
            : 7,
          position: "relative",
          marginTop: "-5px",
          marginRight: calculateMajorMarginRight(),
          marginLeft: calculateMajorMargin(),
        }
      : starType === "MidStar"
      ? {
          fontSize: calculateMidFontSize(),
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
          WebkitTextStroke: calculateMidStroke(),
          textAlign: "left",
          zIndex: hasError
            ? 11
            : isCanon && !isLegends
            ? 9
            : !isCanon && isLegends
            ? 8
            : isCanon && isLegends
            ? 10
            : 7,
          position: "relative",
          marginTop: "-5px",
          marginRight: calculateMidMarginRight(),
          marginLeft: calculateMidMargin(),
        }
      : starType === "MicroStar"
      ? {
          fontSize: calculateMicroFontSize(),
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
          WebkitTextStroke: calculateMicroStroke(),
          textAlign: "left",
          zIndex: hasError
            ? 11
            : isCanon && !isLegends
            ? 9
            : !isCanon && isLegends
            ? 8
            : isCanon && isLegends
            ? 10
            : 7,
          position: "relative",
          marginTop: "-5px",
          marginRight: calculateMicroMarginRight(),
          marginLeft: calculateMicroMargin(),
        }
      : {
          fontSize: calculateFontSize(),
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
          WebkitTextStroke: `${calculateStroke()} black`,
          textAlign: alignRight ? "right" : "left",
          marginTop: zoomLevel >= 7 ? "-4px" : "0px",
          marginRight: calculateMarginRight(),
          marginLeft: calculateMarginLeft(),
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
        };

  const onTooltipClick = () => {
    if (markerRef.current) {
      markerRef.current.leafletElement.fireEvent("click");
    }
  };

  return (
    <div className="">
      {zoomLevel >= 2 ? (
        <Marker ref={markerRef} position={position} icon={icon}>
          {zoomLevel >= 3 && starType === "MajorStar" ? (
            <Tooltip
              interactive={true}
              onClick={onTooltipClick}
              direction={alignRight === true ? "left" : "right"}
              opacity={1}
              permanent
            >
              <div
                className="marker-popup marker-animate name-shadow"
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
              opacity={1}
              permanent
            >
              <div
                className="marker-popup marker-animate name-shadow"
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
              opacity={1}
              permanent
            >
              <div
                className="marker-popup marker-animate name-shadow"
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
      ) : null}
    </div>
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
