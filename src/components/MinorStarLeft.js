import React, { useState} from "react";
import {
  Marker,
  Tooltip,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { Icon } from "leaflet";

export default function MinorStarLeft(props) {
	const position = props.position
	const name = props.name

  let [zoomLevel, setZoomLevel] = useState(3);

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
	});

  const minorIcon = new Icon({
    iconUrl: "/images/marker-icon.svg",
    iconSize: zoomLevel <=3 ? [20, 20] : [32,32],
    iconAnchor: zoomLevel <=3 ? [10, 10] : [16,16],
    popupAnchor: [7, -10],
	});

  const minorStyleLeft = {
    fontSize: zoomLevel <= 3 ? 20 : 30,
    fontWeight: "bold",
    color: "#E3B687",
		WebkitTextStroke: zoomLevel <= 3 ? "0.5px black" : "1px black",
		textAlign: "right",
		marginTop: "-4px",
		marginRight: zoomLevel <= 3 ? "8px" : "15px",
		position: "relative"
	};

  return (
    <div>
      {zoomLevel >= 3 ? (
        <Marker position={position} icon={minorIcon}>
          <Tooltip direction="left" opacity={1} permanent>
            <div className="major-popup" style={minorStyleLeft}>
              {name}
            </div>
          </Tooltip>
          <Popup >
					<a href={`https://starwars.fandom.com/wiki/${name.replace(/ /g,"_")}`} target="_blank" rel="noreferrer">Wiki</a>
				</Popup>
        </Marker>
      ) : null}
    </div>
  );
}
