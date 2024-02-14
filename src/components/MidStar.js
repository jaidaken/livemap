import React from "react";
import {
  Marker,
  Tooltip,
  Popup,
} from "react-leaflet";
import { Icon } from "leaflet";
import ZoomLevel from "./ZoomLevel.js";

export default function MidStar(props) {
	const position = props.position
	const name = props.name

	const midIcon = new Icon({
    iconUrl: "/images/marker-icon-mid.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [7, -10],
	});

  const midStyle = {
    fontSize: 30,
    fontWeight: "bold",
    color: "#CC8A46",
		WebkitTextStroke: "1px black",
		textAlign: "left",
		position: "relative",
		marginLeft: "20px"
	};

  return (
    <div>
      {ZoomLevel >= 3 ? (
        <Marker position={position} icon={midIcon}>
          <Tooltip direction="right" opacity={1} permanent>
            <div className="major-popup" style={midStyle}>
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
