import React, { useState } from "react";
import "./Markers.css";
import { useMap } from "react-leaflet";
import MajorStar from "./components/MajorStar.js";
import MidStar from "./components/MidStar.js";
import MinorStarLeft from "./components/MinorStarLeft.js";
import MinorStarLeftLegends from "./components/MinorStarLeftLegends.js";
import MinorStarRight from "./components/MinorStarRight.js";
import MinorStarRightLegends from "./components/MinorStarRightLegends.js";
import CircleObject from "./components/Circle.js";
import TradeLines from "./components/TradeLines.js";
import TitleObject from "./components/Title.js";
import PolygonObject from "./components/Polygon.js";

export default function Markers() {
  const [ZoomLevel, setZoomLevel] = useState(3);
  const map = useMap();

  map.on("zoomend", () => {
    setZoomLevel(map.getZoom());
	});



  return (
    <div>
      <MajorStar
        ZoomLevel={ZoomLevel}
        position={[-112.22, 108.75]}
        name={"Galactic Center"}
      />
      <MajorStar position={[-76.31, 108.39]} name={"Coruscant"} />
      <MidStar position={[-123.17, 148.45]} name={"Corellia"} />
      <MinorStarLeft position={[-127.08, 131.48]} name={"Dybrin"} />
      <MinorStarRight position={[-121.93, 96.9]} name={"Byss"} />
      <MinorStarRightLegends position={[-103.47, 111.19]} name={"Tsoss Beacon"} />
      <MinorStarRight position={[-99.66, 97.96]} name={"Prakith"} />
      <MinorStarRight position={[-90.78, 109.08]} name={"Empress Teta"} />
      <MinorStarRightLegends position={[-84.02, 108.97]} name={"Jerrilek"} />
      <MinorStarLeftLegends position={[-104.43, 90.09]} name={"Odik"} />
      <MinorStarLeftLegends position={[-92.2, 106.73]} name={"Keeara Major"} />
      <MinorStarLeftLegends position={[-90.52, 105.94]} name={"Symbia"} />
      <MinorStarRight position={[-90.78, 109.08]} name={"Empress Teta"} />
      <MinorStarRight position={[-96.96875, 108.75]} name={"Typhon"} />


			<PolygonObject
      positions={"innerRim"}
      color="#1B609F"
      opacity={1}
			/>

			<CircleObject
        center={[-112.22, 108.75]}
        radius={68.55}
				color="#006CB5"
				opacity={1}
      />
      <CircleObject
        center={[-112.22, 108.75]}
        radius={51.35}
				color="#0073BB"
				opacity={1}
      />
      <CircleObject
        center={[-112.22, 108.75]}
        radius={29.57}
				color="#0079C0"
				opacity={1}
      />

      <TradeLines />

			<TitleObject color="" coords={[-110, 93]} text={`D E E P\nC O R E`} />
			<TitleObject color="" coords={[-131.6875, 65.96875]} text={`C O R E\nW O R L D S`} />
			<TitleObject color="" coords={[-145.6875, 48.4375]} text={`C O L O N I E S`} />
			<TitleObject color="" coords={[-168.5625, 40.125]} text={`I N N E R\nR I M`} />
			<TitleObject color="" coords={[-195.75, 28.625]} text={`E X P A N S I O N\nR E G I O N`} />


    </div>
  );
}
