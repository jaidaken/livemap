import React from "react";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { CRS } from "leaflet";
import Markers from "./Markers.js";
import GridLayer from "./components/GridLayer.js";
import Key from "./components/Key.js";

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
        <div className="map-container">
          <MapContainer
            crs={CRS.Simple}
            center={[-120, 120]}
            zoom={3}
            minZoom={2}
            maxZoom={7}
            scrollWheelZoom={true}
          >
					{/* <TileLayer attribution="" url="/images/{z}/{x}/{y}.png" /> */}
					<TileLayer attribution="" url="" />
					<Key />
            <Markers />
            <MapEvents />
            <GridLayer
              gridSpacing={25}
              topLeftCoord={[-451.32, -166.61]}
              backgroundColor="#ffffff"
              lineColor="#000000"
              lineOpacity={0.05}
              backgroundOpacity={0}
              labelPosition="topLeft"
              labelFont="Arial, sans-serif"
              labelColor="#000000"
              labelOpacity={0.2}
            />
          </MapContainer>

        </div>
    </div>
  );
}

export default App;
