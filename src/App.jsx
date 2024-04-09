import "leaflet/dist/leaflet.css";
import "./App.css";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { CRS } from "leaflet";
import Markers from "./components/Markers.jsx";
import GridLayer from "./components/shapes/GridLayer.jsx";
import Key from "./components/ui/Key.jsx";
import Patreon from "./components/ui/Patreon.jsx";
// import AddSystemForm from "./components/AddSystem.jsx";
import { SystemProvider } from "./components/functions/SystemContext.jsx";
import { useEffect, useState } from "react";

const MapEvents = () => {
  useMapEvents({
    click: (e) => {
      console.log(`[${e.latlng.lat}, ${e.latlng.lng}],`);
      // navigator.clipboard.writeText(`[${e.latlng.lat}, ${e.latlng.lng}],`);
    },
    zoomend: (event) => {
      const newZoomLevel = event.target.getZoom();
      localStorage.setItem("zoomLevel", newZoomLevel.toString());
		},
		moveend(e) {
      const { lat, lng } = e.target.getCenter();
      localStorage.setItem("mapCenter", JSON.stringify([lat, lng]));
      console.log("Map center saved to local storage:", [lat, lng]);
    }
  });
  return null;
};

const minZoom = 2;
const maxZoom = 8;
const desiredTopRightCorner = [-111.508, 128.0];

function App() {
	const squareSize = 11.616;

	const [initialZoom, setInitialZoom] = useState(() => {
		const savedZoom = localStorage.getItem("zoomLevel");
		return savedZoom ? parseInt(savedZoom) : 5;
	});

	const [initialCenter, setInitialCenter] = useState(() => {
		const savedCenter = localStorage.getItem("mapCenter");
		return savedCenter ? JSON.parse(savedCenter) : [-128, 128];
	});

	const handleMapMoveEnd = (event) => {
    const newCenter = event.target.getCenter();
    setInitialCenter([newCenter.lat, newCenter.lng]);
  };

	useEffect(() => {
		const savedZoom = localStorage.getItem("zoomLevel");
		if (savedZoom) {
			setInitialZoom(parseInt(savedZoom));
			console.log("Initial zoom level set from local storage:", parseInt(savedZoom));
		}
	}, []);

	useEffect(() => {
		console.log("Initial zoom level:", initialZoom);
	}, [initialZoom]);

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
					whenCreated={(map) => {
            map.on("moveend", handleMapMoveEnd);
          }}
        >
            <SystemProvider>
              {/* <TileLayer
                attribution=""
                url="/src/assets/images/{z}/{x}/{y}.jpg"
              /> */}
              <TileLayer attribution="" url="" />
              <Patreon />
              <Key />
              <Markers />
              {/* <AddSystemForm /> */}
              <MapEvents />
              <GridLayer
                bottomLeftCoord={bottomLeftCoord}
                lineColor="#ffffff"
                lineOpacity={0.08}
                lineWeight={3}
                backgroundOpacity={0}
                labelPosition="topLeft"
                labelFont="Arial, sans-serif"
                labelColor="#ffffff"
                labelOpacity={0.3}
                squareSize={squareSize}
              />
            </SystemProvider>
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
