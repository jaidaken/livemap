import { useRef } from "react";
import { Marker, Tooltip, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useZoom } from "../functions/ZoomContext";
import PropTypes from "prop-types";
import markerIconCanon from "../../assets/marker-canon.svg";
import markerIconLegends from "../../assets/marker-legends.svg";
import markerIconShared from "../../assets/marker-shared.svg";
import markerIconError from "../../assets/marker-error.svg";
import markerIconMajor from "../../assets/marker-icon-major.svg";
import markerIconMid from "../../assets/marker-icon-mid.svg";

Star.propTypes = {
  position: PropTypes.array,
  name: PropTypes.string,
  wiki: PropTypes.string,
  isCanon: PropTypes.bool,
  isLegends: PropTypes.bool,
  hasError: PropTypes.bool,
  alignRight: PropTypes.bool,
  starType: PropTypes.string, // Include the starType property
};

export default function Star(props) {
  const { zoomLevel } = useZoom();
  const markerRef = useRef(null);

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

  const calculateIcon = () => {
    let markerIcon;

    if (hasError) {
      markerIcon = markerIconError;
    } else if (starType === "MajorStar") {
      markerIcon = markerIconMajor;
    } else if (starType === "MidStar") {
      markerIcon = markerIconMid;
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

  const calculateMajorIconSize = () => {
    if (zoomLevel <= 3) return [15, 15];
    if (zoomLevel === 4) return [20, 20];
    if (zoomLevel === 5) return [30, 30];
    if (zoomLevel === 6) return [40, 40];
    return [55, 55];
  };

  const calculateMidIconSize = () => {
    if (zoomLevel <= 4) return [18, 18];
    if (zoomLevel === 5) return [22, 22];
    if (zoomLevel === 6) return [30, 30];
    if (zoomLevel === 7) return [40, 40];
    return [55, 55];
  };

  const calculateMinIconSize = () => {
    if (zoomLevel <= 5) return [10, 10];
    if (zoomLevel === 6) return [15, 15];
    return [20, 20];
  };

  const calculateIconSize = () => {
    let iconSize;

    if (hasError) {
      iconSize = [10, 10];
    } else if (starType === "MajorStar") {
      iconSize = calculateMajorIconSize();
    } else if (starType === "MidStar") {
      iconSize = calculateMidIconSize();
    } else {
      iconSize = calculateMinIconSize();
    }

    return iconSize;
  };

  const iconSize = calculateIconSize();
  const iconAnchor = iconSize.map((dim) => dim / 2);

  const icon = new Icon({
    iconUrl: markerIcon !== null ? markerIcon : markerIconError,
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: [7, -10],
  });

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

  const calculateFontSize = () => {
    if (zoomLevel === 5) return 21;
    if (zoomLevel === 6) return 35;
		if (zoomLevel === 7) return 40;
		if (zoomLevel >= 8) return 45;
    return 30;
  };

  const calculateMajorMarginSize = () => {
    if (zoomLevel <= 4) return "6px";
    if (zoomLevel === 5) return "12px";
    if (zoomLevel === 6) return "16px";
    return "24px";
  };

  const calculateMidMargin = () => {
    if (zoomLevel <= 4) return "6px";
    if (zoomLevel === 5) return "10px";
    if (zoomLevel === 6) return "12px";
    if (zoomLevel === 7) return "18px";
    return "26px";
  };

  const calculateMarginRight = () => {
    if (zoomLevel <= 5) return "0px";
    if (zoomLevel === 6) return "4px";
    return "8px";
  };

  const calculateMarginLeft = () => {
    if (zoomLevel <= 5) return "0px";
    if (zoomLevel === 6) return "4px";
    return "8px";
  };

  const calculateMajorStroke = () => {
    if (zoomLevel <= 4) return "0.6px black";
    if (zoomLevel === 5) return "0.7px black";
    if (zoomLevel === 6) return "0.8px black";
    return "1px black";
  };

  const calculateMidStroke = () => {
    if (zoomLevel <= 4) return "0.6px black";
    if (zoomLevel === 5) return "0.7px black";
    if (zoomLevel === 6) return "0.8px black";
    return "1px black";
  };

  const calculateStroke = () => {
    if (zoomLevel === 5) return "0.8px";
		if (zoomLevel === 6) return "1px";
		if (zoomLevel === 7) return "1.5px";
		if (zoomLevel === 8) return "1.8px";
    return "1px";
  };

  // Apply different styles based on starType
  const starStyle =
    starType === "MajorStar"
      ? {
          fontSize: calculateMajorFontSize(),
          fontWeight: "bold",
          color: hasError ? "#C7303A" : isCanon ? "#B56327" : "#67ACD7",
          WebkitTextStroke: calculateMajorStroke(),
          textAlign: "left",
          position: "relative",
          marginLeft: calculateMajorMarginSize(),
          zIndex: 610,
        }
      : starType === "MidStar"
      ? {
          fontSize: calculateMidFontSize(),
          fontWeight: "bold",
          color: hasError ? "#C7303A" : isCanon ? "#CC8A46" : "#67ACD7",
          WebkitTextStroke: calculateMidStroke(),
          textAlign: "left",
          position: "relative",
          marginLeft: calculateMidMargin(),
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
					marginTop: "-4px",
          marginRight: calculateMarginRight(),
          marginLeft: calculateMarginLeft(),
          position: "relative",
          zIndex: 1,
        };

  const onTooltipClick = () => {
    if (markerRef.current) {
      markerRef.current.leafletElement.fireEvent("click");
    }
  };

  return (
    <div>
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
              <div className="marker-popup" style={starStyle}>
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
              <div className="marker-popup" style={starStyle}>
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
              <div className="marker-popup" style={starStyle}>
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
}
