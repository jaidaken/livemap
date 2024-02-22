import "leaflet/dist/leaflet.css";
import "./App.css";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { CRS } from "leaflet";
import Markers from "./components/Markers.jsx";
import GridLayer from "./components/shapes/GridLayer.jsx";
import Key from "./components/shapes/Key.jsx";
import { ZoomProvider } from "./components/functions/ZoomContext.jsx";
import Patreon from "./components/shapes/Patreon.jsx";
import AddSystemForm from "./components/AddSystem.jsx";
import { SystemProvider } from "./components/functions/SystemContext.jsx";

const MapEvents = () => {
  useMapEvents({
    click(e) {
      console.log(`[${e.latlng.lat}, ${e.latlng.lng}],`);
      navigator.clipboard.writeText(`[${e.latlng.lat}, ${e.latlng.lng}],`);
    },
  });
  return false;
};

// Constants for initial map configuration
const initialCenter = [-128, 128];
const initialZoom = 5;
const minZoom = 3;
const maxZoom = 8;

function App() {
  return (
    <div className="App">
      <div className="map-container">
        <MapContainer
          crs={CRS.Simple}
          center={initialCenter}
          zoom={initialZoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          scrollWheelZoom={true}
        >
					<ZoomProvider>
						<SystemProvider >
            <TileLayer
              attribution=""
              url="/src/assets/images/{z}/{x}/{y}.jpg"
            />
            {/* <TileLayer attribution="" url="" /> */}
            <Patreon />
            <Key />
            {/* <AddSystemForm /> */}
            <Markers />
            <MapEvents />
            <GridLayer
              gridSpacing={6.7}
              bottomLeftCoord={[-219.08, 54.197]}
              backgroundColor="#ffffff"
              lineColor="#000000"
              lineOpacity={0.028}
              backgroundOpacity={0}
              labelPosition="topLeft"
              labelFont="Arial, sans-serif"
              labelColor="#000000"
              labelOpacity={0.2}
							/>
							</SystemProvider >
          </ZoomProvider>
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
