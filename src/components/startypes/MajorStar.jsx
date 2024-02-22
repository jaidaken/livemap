import { useRef, useEffect } from "react";
import { Marker, Tooltip, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useZoom } from "../functions/ZoomContext";
import PropTypes from "prop-types";
import markerIcon from '../../assets/marker-icon-major.svg'

MajorStar.propTypes = {
  position: PropTypes.array,
  name: PropTypes.string,
};

export default function MajorStar(props) {
  const { zoomLevel } = useZoom();

  const major = useRef();

  useEffect(() => {
    // You can set a different zIndex for the marker after it has been added to the map
    if (major.current) {
      major.current.setZIndexOffset(1600);
    }
  }, []);

  const { position, name } = props;

  const calculateIconSize = () => {
    if (zoomLevel <= 3) return [15, 15];
    if (zoomLevel === 4) return [20, 20];
    if (zoomLevel === 5) return [30, 30];
    if (zoomLevel === 6) return [40, 40];
    return [55, 55];
  };

  const iconSize = calculateIconSize();
  const iconAnchor = [iconSize[0] / 2, iconSize[1] / 2]; // Calculate anchor as half of size

  const majorIcon = new Icon({
    iconUrl: markerIcon,
    iconSize: calculateIconSize(),
    iconAnchor: iconAnchor,
    popupAnchor: [7, -10],
  });

  const calculateFontSize = () => {
    if (zoomLevel === 4) return 25;
    if (zoomLevel === 5) return 30;
    if (zoomLevel === 6) return 40;
    return 55;
  };

  const calculateMarginSize = () => {
    if (zoomLevel <= 4) return "6px";
    if (zoomLevel === 5) return "12px";
    if (zoomLevel === 6) return "16px";
    return "24px";
  };

  const calculateStroke = () => {
    if (zoomLevel <= 4) return "0.6px black";
    if (zoomLevel === 5) return "0.7px black";
    if (zoomLevel === 6) return "0.8px black";
    return "1px black";
  };

  const majorStyle = {
    fontSize: calculateFontSize(),
    fontWeight: "bold",
    color: "#B56327",
    WebkitTextStroke: calculateStroke(),
    textAlign: "left",
    position: "relative",
    marginLeft: calculateMarginSize(),
    zIndex: 610,
  };

  return (
    <div>
      {zoomLevel >= 3 ? (
        <Marker ref={major} position={position} icon={majorIcon}>
          {zoomLevel >= 4 ? (
            <Tooltip direction="right" opacity={1} permanent>
              <div className="major-popup" style={majorStyle}>
                {name}
              </div>
            </Tooltip>
          ) : null}
          <Popup>
            <a
              href={`https://starwars.fandom.com/wiki/${name.replace(
                / /g,
                "_"
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              {name} wiki page
            </a>
          </Popup>
        </Marker>
      ) : null}
    </div>
  );
}
