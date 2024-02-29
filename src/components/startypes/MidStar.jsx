import { useRef, useEffect } from "react";
import { Marker, Tooltip, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useZoom } from "../functions/ZoomContext";
import PropTypes from "prop-types";
import markerIconCanon from '../../assets/marker-canon.svg';
import markerIconLegends from '../../assets/marker-legends.svg';
import markerIconError from '../../assets/marker-error.svg';

MidStar.propTypes = {
  position: PropTypes.array,
  name: PropTypes.string,
  wiki: PropTypes.string,
  isCanon: PropTypes.bool,
  hasError: PropTypes.bool,
};

export default function MidStar(props) {
  const { zoomLevel } = useZoom();

  const minor = useRef();

  useEffect(() => {
    // You can set a different zIndex for the marker after it has been added to the map
    if (minor.current) {
      minor.current.setZIndexOffset(1500);
    }
  }, []);

  const { position, name, wiki, isCanon, hasError } = props;

  const markerIcon = hasError
    ? markerIconError
    : isCanon === true
    ? markerIconCanon
    : markerIconLegends;

  const calculateIconSize = () => {
    if (zoomLevel <= 4) return [18, 18];
    if (zoomLevel === 5) return [22, 22];
    if (zoomLevel === 6) return [30, 30];
    if (zoomLevel === 7) return [40, 40];
    return [55, 55];
  };

  const iconSize = calculateIconSize();
  const iconAnchor = [iconSize[0] / 2, iconSize[1] / 2];

  const calculateMarginLeft = () => {
    if (zoomLevel <= 4) return "6px";
    if (zoomLevel === 5) return "10px";
    if (zoomLevel === 6) return "12px";
    if (zoomLevel === 7) return "18px";
    return "26px";
  };

  const calculateStroke = () => {
    if (zoomLevel <= 4) return "0.6px black";
    if (zoomLevel === 5) return "0.7px black";
    if (zoomLevel === 6) return "0.8px black";
    return "1px black";
  };

  const midIcon = new Icon({
		iconUrl: markerIcon !== null ? markerIcon : markerIconError,
    iconSize: calculateIconSize(),
    iconAnchor: iconAnchor,
    popupAnchor: [7, -10],
  });

  const calculateFontSize = () => {
    if (zoomLevel === 4) return 18;
    if (zoomLevel === 5) return 22;
    if (zoomLevel === 6) return 30;
    if (zoomLevel === 7) return 40;
    return 55;
  };

  const midStyle = {
    fontSize: calculateFontSize(),
    fontWeight: "bold",
		color: hasError
		? "red"
		: isCanon
		? "#CC8A46"
		: "#67ACD7",
    WebkitTextStroke: calculateStroke(),
    textAlign: "left",
    position: "relative",
    marginLeft: calculateMarginLeft(),
  };

  return (
    <div>
      {zoomLevel >= 3 ? (
        <Marker ref={minor} position={position} icon={midIcon}>
          {zoomLevel >= 4 ? (
            <Tooltip direction="right" opacity={1} permanent>
              <div className="canon-popup" style={midStyle}>
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
