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
      <MajorStar ZoomLevel={ZoomLevel} position={[-128, 128]} name={"Galactic Center"} />
			<MajorStar position={[-118.578125, 127.8984375]} name={"Coruscant"} />

			<MidStar position={[-130.828125, 138.40625]} name={"Corellia"} />

			<MinorStarLeft position={[-131.859375, 133.953125]} name={"Dybrin"} />
			<MinorStarLeft position={[-132.2421875, 134.328125]} name={"Fex"} />
			<MinorStarLeft position={[-129.46875, 134.7421875]} name={"Ojom"} />
			<MinorStarLeft position={[-128.7890625, 133.828125]} name={"Cosia"} />
			<MinorStarLeft position={[-121.09375, 128.0625]} name={"Nacon"} />
			<MinorStarLeft position={[-121.984375, 132.59375]} name={"Cerberon"} />

			<MinorStarRight position={[-130.53125, 124.8828125]} name={"Byss"} />
			<MinorStarRight position={[-124.6796875, 125.109375]} name={"Prakith"} />
			<MinorStarRight position={[-122.3671875, 128.078125]} name={"Empress Teta"} />
			<MinorStarRight position={[-123.984375, 128.0078125]} name={"Typhon"} />
			<MinorStarRight position={[-131.796875, 127.0546875]} name={"Kalist"} />
			<MinorStarRight position={[-135.1640625, 128.6875]} name={"Khomm"} />
			<MinorStarRight position={[-134.1796875, 127.109375]} name={"Constancia"} />
			<MinorStarRight position={[-120.9765625, 128.7578125]} name={"Lope"} />
			<MinorStarRight position={[-122.359375, 131.25]} name={"Vulpter"} />

			<MinorStarRightLegends position={[-125.7109375, 128.6328125]} name={"Tsoss Beacon"} />
			<MinorStarRightLegends position={[-120.5859375, 128.046875]} name={"Jerrilek"} />
			<MinorStarRightLegends position={[-132.5078125, 127.046875]} name={"Zamael"} />
			<MinorStarRightLegends position={[-133.3359375, 126.8515625]} name={"Lialic"} />
			<MinorStarRightLegends position={[-134.6328125, 128.7421875]} name={"Crystan"} />
			<MinorStarRightLegends position={[-121.3671875, 131.078125]} name={"Besero"} />
			<MinorStarRightLegends position={[-121.5859375, 129.859375]} name={"Primus Goluud"} />
			<MinorStarRightLegends position={[-121.34375, 128.6328125]} name={"Starswarm Cluster"} />

      <MinorStarLeftLegends position={[-125.9453125, 123.1015625]} name={"Odik"} />
      <MinorStarLeftLegends position={[-122.78125, 127.4609375]} name={"Keeara Major"} />
      <MinorStarLeftLegends position={[-122.296875, 127.2578125]} name={"Symbia"} />
      <MinorStarLeftLegends position={[-134.8515625, 127.59375]} name={"Dulvoyinn"} />
      <MinorStarLeftLegends position={[-130.2265625, 134.1796875]} name={"Eclipse"} />
      <MinorStarLeftLegends position={[-129.0546875, 135.0078125]} name={"Ottabesk"} />
      <MinorStarLeftLegends position={[-128.609375, 135.0859375]} name={"Hakassi"} />
      <MinorStarLeftLegends position={[-127.8359375, 134.765625]} name={"Ebaq"} />
      <MinorStarLeftLegends position={[-127.4296875, 133.234375]} name={"Tarkin's fang"} />
      <MinorStarLeftLegends position={[-126.1640625, 135.3515625]} name={"Thoadeye"} />
      <MinorStarLeftLegends position={[-124.0703125, 132.6171875]} name={"Had Abbadon"} />
      <MinorStarLeftLegends position={[-123.703125, 134.1953125]} name={"Dremulae"} />
      <MinorStarLeftLegends position={[-122.875, 133.609375]} name={"Cambria"} />
      <MinorStarLeftLegends position={[-121.59375, 128.1484375]} name={"Kuar"} />



			<PolygonObject
      positions={"innerRim"}
      color="#1B609F"
      opacity={0.1}
			/>

			<CircleObject
        center={[-128, 128]}
        radius={17.98}
				color="#006CB5"
				opacity={0.1}
      />
      <CircleObject
        center={[-128, 128]}
        radius={13.4}
				color="#0073BB"
				opacity={0.1}
      />
      <CircleObject
        center={[-128, 128]}
        radius={7.78}
				color="#0079C0"
				opacity={1}
      />

      <TradeLines />

			<TitleObject color="" coords={[-127.625, 125.625]} text={`D E E P\nC O R E`} />
			<TitleObject color="" coords={[-133.1875, 119.0625]} text={`C O R E\nW O R L D S`} />
			<TitleObject color="" coords={[-136.875, 114.78125]} text={`C O L O N I E S`} />
			<TitleObject color="" coords={[-142.5625, 111.4375]} text={`I N N E R\nR I M`} />
			<TitleObject color="" coords={[-147.1875, 108.5625]} text={`E X P A N S I O N\nR E G I O N`} />
			<TitleObject color="" coords={[-154, 107.0625]} text={`M I D\nR I M`} />
			<TitleObject color="" coords={[-160.1875, 101.125]} text={`O U T E R\nR I M`} />
			<TitleObject color="" coords={[-133.75, 89.1875]} text={`U N K N O W N\nR E G I O N S`} />
			<TitleObject color="" coords={[-122.375, 179.625]} text={`H U T T\nS P A C E`} />


    </div>
  );
}
