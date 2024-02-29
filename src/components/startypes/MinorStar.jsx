import { Marker, Tooltip, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useZoom } from "../functions/ZoomContext";
import PropTypes from "prop-types";
import markerIconCanon from '../../assets/marker-canon.svg';
import markerIconLegends from '../../assets/marker-legends.svg';
import markerIconError from '../../assets/marker-error.svg';

MinorStarLeft.propTypes = {
  position: PropTypes.array,
  name: PropTypes.string,
  wiki: PropTypes.string,
	isCanon: PropTypes.bool,
	isLegends: PropTypes.bool,
	hasError: PropTypes.bool,
	alignRight: PropTypes.bool
};

export default function MinorStarLeft(props) {
  const { zoomLevel } = useZoom();

  const { position, name, wiki, isCanon, isLegends, hasError, alignRight } = props;

  const markerIcon = hasError
    ? markerIconError
    : isCanon === true && isLegends === false
    ? markerIconCanon
    : isLegends === true && isCanon === false
    ? markerIconLegends
    : markerIconError;

  const calculateIconSize = () => {
    if (zoomLevel <= 5) return [10, 10];
    if (zoomLevel === 6) return [15, 15];
    return [20, 20];
  };

  const iconSize = calculateIconSize();
  const iconAnchor = iconSize.map((dim) => dim / 2);

  const minorIcon = new Icon({
		iconUrl: markerIcon !== null ? markerIcon : markerIconError,
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: [7, -10],
  });

  const calculateFontSize = () => {
    if (zoomLevel <= 5) return 15;
    if (zoomLevel === 6) return 20;
    return 30;
  };

  const calculateStroke = () => {
    if (zoomLevel <= 5) return "0.3px black";
    if (zoomLevel === 6) return "0.5px black";
    return "1px black";
  };

  const calculateMarginRight = () => {
    if (zoomLevel <= 5) return "2px";
    if (zoomLevel === 6) return "4px";
    return "8px";
	};

	const calculateMarginLeft = () => {
    if (zoomLevel <= 5) return "2px";
    if (zoomLevel === 6) return "4px";
    return "8px";
  };

  const minorStyleLeft = {
    fontSize: calculateFontSize(),
    fontWeight: "bold",
		color: hasError
		? "red"
		: isCanon
		? "#E3B687"
		: "#67ACD7",
    WebkitTextStroke: calculateStroke(),
    textAlign: "right",
    marginTop: "-4px",
    marginRight: calculateMarginRight(),
    position: "relative",
    zIndex: 1,
	};

	const minorStyleRight = {
    fontSize: calculateFontSize(),
    fontWeight: "bold",
		color: hasError
		? "red"
		: isCanon
		? "#E3B687"
		: "#67ACD7",
    WebkitTextStroke: calculateStroke(),
    textAlign: "left",
    position: "relative",
    marginLeft: calculateMarginLeft(),
    zIndex: 1,
  };

  return (
    <div>
      {zoomLevel >= 3 ? (
        <Marker position={position} icon={minorIcon}>
          {zoomLevel >= 6 ? (
            <Tooltip direction={alignRight === true ? "left" : "right"} opacity={1} permanent>
              <div className="canon-popup" style={alignRight === true ? minorStyleLeft : minorStyleRight}>
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