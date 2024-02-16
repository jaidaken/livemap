import React, {useState}  from "react";
import {
  Marker,
  Tooltip,
	Popup,
	useMapEvents
} from "react-leaflet";
import { Icon } from "leaflet";

export default function MajorStar(props) {

	let [ZoomLevel, setZoomLevel] = useState(5);

	const mapEvents = useMapEvents({
		zoomend: () => {
			setZoomLevel(mapEvents.getZoom());
		},
	});

	const position = props.position
	const name = props.name

	const iconSize = ZoomLevel <= 4 ? [20, 20] : ZoomLevel === 5 ? [35, 35] : [40, 40];
  const iconAnchor = iconSize.map(dim => dim / 2); // Calculate anchor as half of size

	const majorIcon = new Icon({
    iconUrl: "/images/marker-icon-major.svg",
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: [7, -10],
	});

	const majorStyle = {
    fontSize: ZoomLevel <=3 ? 25 : ZoomLevel === 4 ? 30 : ZoomLevel === 5 ? 35 : ZoomLevel === 6 ? 40 : 55,
    fontWeight: "bold",
    color: "#B56327",
		WebkitTextStroke: "1px black",
		textAlign: "left",
		position: "relative",
		marginLeft: ZoomLevel <= 4 ? "6px" : ZoomLevel === 5  ? "10px" : "16px",
	};

  return (
    <div>
      {ZoomLevel >= 4 ? (
        <Marker position={position} icon={majorIcon}>
          <Tooltip direction="right" opacity={1} permanent>
            <div className="major-popup" style={majorStyle}>
              {name}
            </div>
          </Tooltip>
          <Popup >
						<a href={`https://starwars.fandom.com/wiki/${name.replace(/ /g,"_")}`} target="_blank" rel="noreferrer"> {name} wiki page</a>
				</Popup>
        </Marker>
      ) : null}
    </div>
  );
}
