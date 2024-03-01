import "leaflet/dist/leaflet.css";
import "./App.css";
import { MapContainer, TileLayer } from "react-leaflet";
// import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { CRS } from "leaflet";
import Markers from "./components/Markers.jsx";
import GridLayer from "./components/shapes/GridLayer.jsx";
import Key from "./components/ui/Key.jsx";
import { ZoomProvider } from "./components/functions/ZoomContext.jsx";
import Patreon from "./components/ui/Patreon.jsx";
// import AddSystemForm from "./components/AddSystem.jsx";
import { SystemProvider } from "./components/functions/SystemContext.jsx";

// const MapEvents = () => {
//   useMapEvents({
//     click(e) {
//       console.log(`[${e.latlng.lat}, ${e.latlng.lng}],`);
//       navigator.clipboard.writeText(`[${e.latlng.lat}, ${e.latlng.lng}],`);
//     },
//   });
//   return false;
// };

const initialCenter = [-128, 128];
const initialZoom = 5;
const minZoom = 3;
const maxZoom = 8;
const desiredTopRightCorner = [-118.57063483391609, 127.89505963740459];

function App() {
  const  squareSize= 6.8;

  const bottomLeftCoord = [
    desiredTopRightCorner[0] - squareSize * 15,
    desiredTopRightCorner[1] - squareSize * 11,
  ];
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
          doubleClickZoom={false}
        >
          <ZoomProvider>
            <SystemProvider>
              {/* <TileLayer attribution="" url="/src/assets/images/{z}/{x}/{y}.jpg" /> */}
              <TileLayer attribution="" url="" />
              <Patreon />
              <Key />
							<Markers />
							{/* <AddSystemForm /> */}
              {/* <MapEvents /> */}
              <GridLayer
                bottomLeftCoord={bottomLeftCoord}
                backgroundColor="#ffffff"
                lineColor="#000000"
                lineOpacity={0.2}
                backgroundOpacity={0}
                labelPosition="topLeft"
                labelFont="Arial, sans-serif"
                labelColor="#000000"
                labelOpacity={0.4}
                squareSize={squareSize}
              />
            </SystemProvider>
          </ZoomProvider>
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
