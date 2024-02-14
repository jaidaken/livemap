import React from "react";
import {
  Marker,
  Tooltip,
  Popup,
} from "react-leaflet";
import { Icon } from "leaflet";
import ZoomLevel from "./ZoomLevel.js";

export default function MajorStar(props) {
	const position = props.position
	const name = props.name


	const majorIcon = new Icon({
    iconUrl: "/images/marker-icon-major.svg",
    iconSize: ZoomLevel <=3 ? [40, 40] : [40,40],
    iconAnchor: [20, 20],
    popupAnchor: [7, -10],
	});

	const majorStyle = {
    fontSize: ZoomLevel <=3 ? 40 : ZoomLevel === 4 ? 50 : ZoomLevel === 5 ? 60 : ZoomLevel === 6 ? 70 : 80,
    fontWeight: "bold",
    color: "#B56327",
		WebkitTextStroke: "1px black",
		textAlign: "left",
		position: "relative",
		marginLeft: "20px"
	};

  return (
    <div>
      {ZoomLevel >= 3 ? (
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
