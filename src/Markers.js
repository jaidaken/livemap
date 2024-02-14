import React, { useState } from "react";
import "./Markers.css"
import {
  Tooltip,
  useMapEvents,
  Polygon,
	Polyline,
} from "react-leaflet";
import MajorStar from "./components/MajorStar.js";
import MidStar from "./components/MidStar.js";
import MinorStarLeft from "./components/MinorStarLeft.js"
import MinorStarRight from "./components/MinorStarRight.js"
import CircleObject from "./components/Circle.js";

export default function Markers() {
  let [zoomLevel, setZoomLevel] = useState(3);

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
	});

  const lineStyle = {
    weight: 10,
    opacity: 0.5,
    textColor: "pink",
  };

  const multiPolyline = [
    [
      [-112.22, 108.75],
      [-76.31, 108.39],
      [-162.22, 138.75],
    ],
    [
      [-112.22, 108.75],
      [-112.22, 108.75],
      [-112.22, 108.75],
    ],
	];

	const titleStyle = {
		color: "red"
	}
  const deepCoreStyle = {
		fillColor: "#0079C0",
		fillOpacity: 0.8,
    color: "#202933",
    dashArray: zoomLevel <= 3 ? "12 12" : "24 24",
    weight: zoomLevel <= 3 ? 5 : zoomLevel <= 5 ? 10 : 15,
		lineCap: "square",
	};

	const coreWorldsStyle = {
		fillColor: "#0073BB",
		fillOpacity: 0.8,
    color: "#202933",
    dashArray: zoomLevel <= 3 ? "12 12" : "24 24",
    weight: zoomLevel <= 3 ? 5 : zoomLevel <= 5 ? 10 : 15,
		lineCap: "square",
	};



	return (


		<div>
			<MajorStar position={[-112.22, 108.75]} name={"Galactic Center"} />
			<MajorStar position={[-76.31, 108.39]} name={"Coruscant"}/>
			<MidStar position={[-123.17, 148.45]} name={"Corellia"}/>
			<MinorStarLeft position={[-127.08, 131.48]} name={"Dybrin"} />
			<MinorStarRight position={[-121.93, 96.9]} name={"Byss"}/>

			<CircleObject center={[-112.22, 108.75]} radius={51.35} style={coreWorldsStyle} />
			<CircleObject center={[-112.22, 108.75]} radius={29.57} style={deepCoreStyle} />

      <Polyline pathOptions={lineStyle} positions={multiPolyline} />


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

			{/* {zoomLevel >= 3 ? (
        <Marker position={[-121.93, 96.9]} icon={minorIcon}>
          <Tooltip direction="right" opacity={1} permanent>
            <div className="major-popup" style={minorStyleRight}>
              Byss
            </div>
					</Tooltip>
					<Popup>
						<a href="https://starwars.fandom.com/wiki/byss" target="_blank" rel="noreferrer">Wiki</a>
					</Popup>
        </Marker>
			) : null}

{zoomLevel >= 3 ? (
        <Marker position={[-99.66, 97.96]} icon={minorIcon}>
          <Tooltip direction="right" opacity={1} permanent>
            <div className="major-popup" style={minorStyleRight}>
              Prakith
            </div>
					</Tooltip>
					<Popup>
						<a href="https://starwars.fandom.com/wiki/prakith" target="_blank" rel="noreferrer">Wiki</a>
					</Popup>
        </Marker>
			) : null}

{zoomLevel >= 3 ? (
        <Marker position={[-90.78, 109.08]} icon={minorIcon}>
          <Tooltip direction="right" opacity={1} permanent>
            <div className="major-popup" style={minorStyleRight}>
              Empress Teta
            </div>
					</Tooltip>
					<Popup>
						<a href="https://starwars.fandom.com/wiki/Empress_Teta" target="_blank" rel="noreferrer">Wiki</a>
					</Popup>
        </Marker>
			) : null}

{zoomLevel >= 3 ? (
        <Marker position={[-84.02, 108.97]} icon={minorIcon}>
          <Tooltip direction="right" opacity={1} permanent>
            <div className="major-popup" style={minorStyleRight}>
              Jerrilek
            </div>
					</Tooltip>
					<Popup>
						<a href="https://starwars.fandom.com/wiki/jerrilek" target="_blank" rel="noreferrer">Wiki</a>
					</Popup>
        </Marker>
			) : null}

			{zoomLevel >= 3 ? (
        <Marker position={[-104.43, 90.09]} icon={minorIcon}>
          <Tooltip direction="left" opacity={1} permanent>
            <div className="major-popup" style={minorStyleLeft}>
              Odik
            </div>
					</Tooltip>
					<Popup>
						<a href="https://starwars.fandom.com/wiki/odik" target="_blank" rel="noreferrer">Wiki</a>
					</Popup>
        </Marker>
      ) : null}

{zoomLevel >= 3 ? (
        <Marker position={[-92.2, 106.73]} icon={minorIcon}>
          <Tooltip direction="left" opacity={1} permanent>
            <div className="major-popup" style={minorStyleLeft}>
							Keeara Major
            </div>
					</Tooltip>
					<Popup>
						<a href="https://starwars.fandom.com/wiki/Keeara_Major" target="_blank" rel="noreferrer">Wiki</a>
					</Popup>
        </Marker>
			) : null}

{zoomLevel >= 3 ? (
        <Marker position={[-90.52, 105.94]} icon={minorIcon}>
          <Tooltip direction="left" opacity={1} permanent>
            <div className="major-popup" style={minorStyleLeft}>
              Symbia
            </div>
          </Tooltip>
					<Popup>
						<a href="https://starwars.fandom.com/wiki/symbia" target="_blank" rel="noreferrer">Wiki</a>
					</Popup>
        </Marker>
			) : null} */}
    </div>
  );
}
