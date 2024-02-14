import React, {useState} from "react";
import "./Markers.css"
import {
  Tooltip,
	Polygon,
	useMapEvents
} from "react-leaflet";
import MajorStar from "./components/MajorStar.js";
import MidStar from "./components/MidStar.js";
import MinorStarLeft from "./components/MinorStarLeft.js"
import MinorStarRight from "./components/MinorStarRight.js"
import CircleObject from "./components/Circle.js";
import TradeLines from "./components/TradeLines.js";

export default function Markers() {

	let [ZoomLevel, setZoomLevel] = useState(3);

	const mapEvents = useMapEvents({
		zoomend: () => {
			setZoomLevel(mapEvents.getZoom());
		},
	});

	const titleStyle = {
		color: "#231F20",
		fontSize: ZoomLevel <= 3 ? 40 : ZoomLevel === 4 ? 75 : ZoomLevel === 5 ? 180 : 250,
		lineHeight: ZoomLevel <= 3 ? "30px" : ZoomLevel === 4 ? "60px" : ZoomLevel === 5 ? "160px" : "200px"
	}
  const deepCoreStyle = {
		fillColor: "#0079C0",
		fillOpacity: 1,
    color: "#202933",
    dashArray: ZoomLevel <= 3 ? "12 12" : "24 24",
    weight: ZoomLevel <= 3 ? 5 : ZoomLevel <= 5 ? 10 : 15,
		lineCap: "square",
		zIndex: 1
	};

	const coreWorldsStyle = {
		fillColor: "#0073BB",
		fillOpacity: 0.2,
    color: "#202933",
    dashArray: ZoomLevel <= 3 ? "12 12" : "24 24",
    weight: ZoomLevel <= 3 ? 5 : ZoomLevel <= 5 ? 10 : 15,
		lineCap: "square",
		zIndex: 1
	};



	return (


		<div>
			<MajorStar ZoomLevel={ZoomLevel} position={[-112.22, 108.75]} name={"Galactic Center"} />
			<MajorStar position={[-76.31, 108.39]} name={"Coruscant"}/>
			<MidStar position={[-123.17, 148.45]} name={"Corellia"}/>
			<MinorStarLeft position={[-127.08, 131.48]} name={"Dybrin"} />
			<MinorStarRight position={[-121.93, 96.9]} name={"Byss"} />
			<MinorStarRight position={[-103.47, 111.19]} name={"Tsoss Beacon"} />
			<MinorStarRight position={[-99.66, 97.96]} name={"Prakith"} />
			<MinorStarRight position={[-90.78, 109.08]} name={"Empress Teta"} />
			<MinorStarRight position={[-84.02, 108.97]} name={"Jerrilek"} />
			<MinorStarLeft position={[-104.43, 90.09]} name={"Odik"} />
			<MinorStarLeft position={[-92.2, 106.73]} name={"Keeara Major"} />
			<MinorStarLeft position={[-90.52, 105.94]} name={"Symbia"} />
			<MinorStarRight position={[-90.78, 109.08]} name={"Empress Teta"} />
			<MinorStarRight position={[-96.96875, 108.75]} name={"Typhon"} />

			<CircleObject center={[-112.22, 108.75]} radius={51.35} style={coreWorldsStyle} />
			<CircleObject center={[-112.22, 108.75]} radius={29.57} style={deepCoreStyle} />

			<TradeLines />

			<Polygon
        color="transparent"
        positions={[
          [-110, 93],
          [-110, 93],
          [-110, 93],
        ]}
      >
        <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>
          <div style={titleStyle}>
            D E E P <br /> C O R E
          </div>
				</Tooltip>
      </Polygon>
    </div>
  );
}
