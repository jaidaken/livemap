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

const imageWidth = 18688; // Width of the background image in pixels
const imageHeight = 18688; // Height of the background image in pixels
const centerX = -76.31; // Longitude of the center of the map
const centerY = 108.39; // Latitude of the center of the map

// Calculate half width and half height of the image
const halfWidth = imageWidth / 2;
const halfHeight = imageHeight / 2;

// Calculate the bounds
const bounds = [
  [centerY - halfHeight, centerX - halfWidth], // Bottom-left corner
  [centerY + halfHeight, centerX + halfWidth], // Top-right corner
];

console.log(bounds);

function App() {
  return (
    <div className="App">
        <div className="map-container">
          <MapContainer
            crs={CRS.Simple}
            center={[-128, 128]}
            zoom={5}
            minZoom={3}
            maxZoom={8}
            scrollWheelZoom={true}
          >
					{/* <TileLayer attribution="" url="/images/{z}/{x}/{y}.jpg" /> */}
					<TileLayer attribution="" url="" />
					<Key />
            <Markers />
            <MapEvents />
            <GridLayer
              gridSpacing={6.5}
              bottomLeftCoord={[-216.08, 56.4]}
              backgroundColor="#ffffff"
              lineColor="#000000"
              lineOpacity={0.028}
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


[

]
