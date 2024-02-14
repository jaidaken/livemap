import React, { useState} from "react";
import {
  Marker,
  Tooltip,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { Icon } from "leaflet";

export default function MajorStar(props) {
	const position = props.position
	const name = props.name

  let [zoomLevel, setZoomLevel] = useState(3);

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
	});

	const majorIcon = new Icon({
    iconUrl: "/images/marker-icon-major.svg",
    iconSize: zoomLevel <=3 ? [40, 40] : [40,40],
    iconAnchor: [20, 20],
    popupAnchor: [7, -10],
	});

	const majorStyle = {
    fontSize: zoomLevel <=3 ? 40 : zoomLevel === 4 ? 50 : zoomLevel === 5 ? 60 : zoomLevel === 6 ? 70 : 80,
    fontWeight: "bold",
    color: "#B56327",
		WebkitTextStroke: "1px black",
		textAlign: "left",
		position: "relative",
		marginLeft: "20px"
	};

  return (
    <div>
      {zoomLevel >= 3 ? (
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
