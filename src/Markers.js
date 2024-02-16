import React, { useState, useEffect } from "react";
import "./Markers.css";
import CircleObject from "./components/Circle.js";
import TradeLines from "./components/TradeLines.js";
import TitleObject from "./components/Title.js";
import PolygonObject from "./components/Polygon.js";
import { fetchSystems } from "./components/fetch.js";

const starComponents = {
  MajorStar: React.lazy(() => import("./components/MajorStar.js")),
  MidStar: React.lazy(() => import("./components/MidStar.js")),
  MinorStarLeft: React.lazy(() => import("./components/MinorStarLeft.js")),
  MinorStarLeftLegends: React.lazy(() => import("./components/MinorStarLeftLegends.js")),
  MinorStarRight: React.lazy(() => import("./components/MinorStarRight.js")),
  MinorStarRightLegends: React.lazy(() => import("./components/MinorStarRightLegends.js")),
  // Add more star types as needed
};

export default function Markers() {

  const [starSystems, setStarSystems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchSystems();
      setStarSystems(data);
    }

    fetchData();
	}, []);


  return (
    <div>
      {/*

      <MinorStarLeftLegends position={[-125.9453125 123.1015625]} name={"Odik"} />
      <MinorStarLeftLegends position={[-122.78125 127.4609375]} name={"Keeara Major"} />
      <MinorStarLeftLegends position={[-122.296875 127.2578125]} name={"Symbia"} />
      <MinorStarLeftLegends position={[-134.8515625 127.59375]} name={"Dulvoyinn"} />
      <MinorStarLeftLegends position={[-130.2265625 134.1796875]} name={"Eclipse"} />
      <MinorStarLeftLegends position={[-129.0546875 135.0078125]} name={"Ottabesk"} />
      <MinorStarLeftLegends position={[-128.609375 135.0859375]} name={"Hakassi"} />
      <MinorStarLeftLegends position={[-127.8359375 134.765625]} name={"Ebaq"} />
      <MinorStarLeftLegends position={[-127.4296875 133.234375]} name={"Tarkin's fang"} />
      <MinorStarLeftLegends position={[-126.1640625 135.3515625]} name={"Thoadeye"} />
      <MinorStarLeftLegends position={[-124.0703125 132.6171875]} name={"Had Abbadon"} />
      <MinorStarLeftLegends position={[-123.703125 134.1953125]} name={"Dremulae"} />
      <MinorStarLeftLegends position={[-122.875 133.609375]} name={"Cambria"} />
      <MinorStarLeftLegends position={[-121.59375 128.1484375]} name={"Kuar"} />

			<MinorStarRightLegends position={[-125.7109375, 128.6328125]} name={"Tsoss Beacon"} />
			<MinorStarRightLegends position={[-120.5859375, 128.046875]} name={"Jerrilek"} />
			<MinorStarRightLegends position={[-132.5078125, 127.046875]} name={"Zamael"} />
			<MinorStarRightLegends position={[-133.3359375, 126.8515625]} name={"Lialic"} />
			<MinorStarRightLegends position={[-134.6328125, 128.7421875]} name={"Crystan"} />
			<MinorStarRightLegends position={[-121.3671875, 131.078125]} name={"Besero"} />
			<MinorStarRightLegends position={[-121.5859375, 129.859375]} name={"Primus Goluud"} />
			<MinorStarRightLegends position={[-121.34375, 128.6328125]} name={"Starswarm Cluster"} />
			<MinorStarRightLegends position={[-119.5, 127.8984375]} name={"Ruan"} />
			<MinorStarRightLegends position={[-119.9140625, 127.953125]} name={"Kaikielius"} /> */}

{starSystems.map(({ id, name, latitude, longitude, starType }) => {
        const StarComponent = starComponents[starType];

        if (!StarComponent) {
          // Handle missing starType or provide a fallback component
          console.error(`Component not found for starType: ${starType}`);
          return null;
        }

        return (
          <React.Suspense key={id} fallback={<div>Loading...</div>}>
            <StarComponent position={[latitude, longitude]} name={name} />
          </React.Suspense>
        );
      })}

      {/* Rest of the components */}

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
