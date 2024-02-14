import React,  { useState }  from "react";
import "leaflet/dist/leaflet.css";
import "./App.css";
import {
  MapContainer,
	TileLayer,
	useMapEvents
} from "react-leaflet";
import { CRS } from "leaflet";
import Markers from "./Markers.js";

const offlineMap = "/images/{z}/{x}/{y}.png";

const MapEvents = () => {
  useMapEvents({
    click(e) {
      console.log(`[${e.latlng.lat}, ${e.latlng.lng}]`);
    },
  });
  return false;
};

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
						<MapEvents />
          </MapContainer>
        </div>
      </header>
    </div>
  );
}

export default App;
