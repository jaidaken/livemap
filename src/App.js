import React from "react";
import "leaflet/dist/leaflet.css";
import "./App.css";
import {
  MapContainer,
  TileLayer,
} from "react-leaflet";
import { CRS } from "leaflet";
import Markers from "./Markers.js";

const offlineMap = "/images/{z}/{x}/{y}.png";

const bounds = [
  [51.49, -0.08],
  [51.5, -0.06],
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="map-container">
          <MapContainer
            crs={CRS.Simple}
            center={[-120, 120]}
            zoom={3}
            minZoom={2}
            maxZoom={7}
						scrollWheelZoom={true}
          >
            <TileLayer attribution="" url={offlineMap} />
            <Markers />
          </MapContainer>
          {/* <MapEvents />
					{ Zoom >= 5 ? <Marker> your marker options and params </Marker> : null } */}
        </div>
      </header>
    </div>
  );
}

export default App;
