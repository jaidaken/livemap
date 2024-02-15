import React, { useState } from "react";
import "./Markers.css";
import { Tooltip, Polygon, useMap } from "react-leaflet";
import MajorStar from "./components/MajorStar.js";
import MidStar from "./components/MidStar.js";
import MinorStarLeft from "./components/MinorStarLeft.js";
import MinorStarLeftLegends from "./components/MinorStarLeftLegends.js";
import MinorStarRight from "./components/MinorStarRight.js";
import MinorStarRightLegends from "./components/MinorStarRightLegends.js";
import CircleObject from "./components/Circle.js";
import TradeLines from "./components/TradeLines.js";

export default function Markers() {
  const [ZoomLevel, setZoomLevel] = useState(3);
  const map = useMap();

  map.on("zoomend", () => {
    setZoomLevel(map.getZoom());
  });

  const titleStyle = {
    color: "#231F20",
    fontSize:
      ZoomLevel <= 3 ? 40 : ZoomLevel === 4 ? 75 : ZoomLevel === 5 ? 180 : 250,
    lineHeight:
      ZoomLevel <= 3
        ? "30px"
        : ZoomLevel === 4
        ? "60px"
        : ZoomLevel === 5
        ? "160px"
        : "200px",
  };

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
