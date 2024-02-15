import React, {useState}  from "react";
import {
  Marker,
  Tooltip,
	Popup,
	useMapEvents
} from "react-leaflet";
import { Icon } from "leaflet";

export default function MinorStarLeft(props) {

	let [ZoomLevel, setZoomLevel] = useState(3);

	const mapEvents = useMapEvents({
		zoomend: () => {
			setZoomLevel(mapEvents.getZoom());
		},
	});


	const position = props.position
	const name = props.name

  const minorIcon = new Icon({
    iconUrl: "/images/marker-icon.svg",
    iconSize: ZoomLevel <=3 ? [20, 20] : [32,32],
    iconAnchor: ZoomLevel <=3 ? [10, 10] : [16,16],
    popupAnchor: [7, -10],
	});

  const minorStyleLeft = {
    fontSize: ZoomLevel <= 3 ? 20 : 30,
    fontWeight: "bold",
    color: "#E3B687",
		WebkitTextStroke: ZoomLevel <= 3 ? "0.5px black" : "1px black",
		textAlign: "right",
		marginTop: "-4px",
		marginRight: ZoomLevel <= 3 ? "8px" : "15px",
		position: "relative"
	};

  return (
    <div>
      {ZoomLevel >= 3 ? (
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
