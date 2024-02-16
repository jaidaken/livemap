import React, {useState}  from "react";
import {
  Marker,
  Tooltip,
	Popup,
	useMapEvents
} from "react-leaflet";
import { Icon } from "leaflet";

export default function MinorStarLeft(props) {

	let [ZoomLevel, setZoomLevel] = useState(5);

	const mapEvents = useMapEvents({
		zoomend: () => {
			setZoomLevel(mapEvents.getZoom());
		},
	});


	const position = props.position
	const name = props.name

	const iconSize = ZoomLevel <= 5 ? [10, 10] : ZoomLevel === 6 ? [15, 15] : ZoomLevel === 6 ? [15, 15] : [20,20];
	const iconAnchor = iconSize.map(dim => dim / 2); // Calculate anchor as half of size

  const minorIcon = new Icon({
    iconUrl: "/images/marker-legend.svg",
		iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: [7, -10],
	});

  const minorStyleLeft = {
    fontSize: ZoomLevel <= 5 ? 15 : ZoomLevel ===6  ? 20 : 30,
    fontWeight: "bold",
    color: "#67ACD7",
		WebkitTextStroke: ZoomLevel <= 5 ? "0.3px black" : ZoomLevel === 6 ? "0.5px black" : "1px black",
		textAlign: "right",
		marginTop: "-4px",
		marginRight: ZoomLevel <= 5 ? "2px" : ZoomLevel ===6  ? "4px" : "8px",
		position: "relative"
	};

  return (
    <div>
      {ZoomLevel >= 5 ? (
        <Marker position={position} icon={minorIcon}>
          <Tooltip direction="left" opacity={1} permanent>
            <div className="major-popup" style={minorStyleLeft}>
              {name}
            </div>
          </Tooltip>
          <Popup >
					<a href={`https://starwars.fandom.com/wiki/${name.replace(/ /g,"_")}`} target="_blank" rel="noreferrer">{name} wiki page</a>
				</Popup>
        </Marker>
      ) : null}
    </div>
  );
}
