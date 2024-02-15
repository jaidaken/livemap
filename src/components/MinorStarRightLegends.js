import React, {useState}  from "react";
import {
  Marker,
  Tooltip,
	Popup,
	useMapEvents
} from "react-leaflet";
import { Icon } from "leaflet";

export default function MinorStarRight(props) {

	let [ZoomLevel, setZoomLevel] = useState(3);

	const mapEvents = useMapEvents({
		zoomend: () => {
			setZoomLevel(mapEvents.getZoom());
		},
	});

	const position = props.position
	const name = props.name

  const minorIcon = new Icon({
    iconUrl: "/images/marker-legend.svg",
    iconSize: ZoomLevel <=3 ? [20, 20] : [32,32],
    iconAnchor: ZoomLevel <=3 ? [10, 10] : [16,16],
    popupAnchor: [7, -10],
	});

	const minorStyleRight = {
    fontSize: ZoomLevel <= 3 ? 20 : 30,
    fontWeight: "bold",
    color: "#67ACD7",
		WebkitTextStroke: ZoomLevel <= 3 ? "0.5px black" : "1px black",
		textAlign: "left",
		position: "relative",
		marginLeft: ZoomLevel <= 3 ? "8px" : "15px"
	};

  return (
    <div>
      {ZoomLevel >= 3 ? (
        <Marker position={position} icon={minorIcon}>
          <Tooltip direction="right" opacity={1} permanent>
            <div className="major-popup" style={minorStyleRight}>
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
