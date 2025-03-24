import React, { useEffect, useState, Suspense } from "react";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import { CRS } from "leaflet";

import GridLayer from "./components/shapes/GridLayer.jsx";
import Key from "./components/ui/Key.jsx";
import Patreon from "./components/ui/Patreon.jsx";
// import AddSystemForm from "./components/AddSystem.jsx";
import { SystemProvider } from "./components/functions/SystemProvider.jsx";

const Markers = React.lazy(() => import("./components/Markers.jsx"));

const MapEvents = () => {
  useMapEvents({
    click: (e) => {
      console.log(`[${e.latlng.lat}, ${e.latlng.lng}],`);
      // navigator.clipboard.writeText(`[${e.latlng.lat}, ${e.latlng.lng}],`);
    },
    zoomend: (event) => {
      const newZoomLevel = event.target.getZoom();
      localStorage.setItem("zoomLevel", newZoomLevel.toString());
      console.log("Zoom Level:", newZoomLevel);
    },
    moveend(e) {
      const { lat, lng } = e.target.getCenter();
      localStorage.setItem("mapCenter", JSON.stringify([lat, lng]));
    },
  });
  return null;
};

function FixIOSLayout() {
  const map = useMap();

  useEffect(() => {
    // Simple iOS Safari detection
    function isIosSafari() {
      const ua = window.navigator.userAgent;
      // Check for iPhone/iPad/iPod and Safari (excluding Chrome)
      const iOSDevice = /iPad|iPhone|iPod/.test(ua);
      const safariBrowser = /Safari/.test(ua) && !/Chrome/.test(ua);
      return iOSDevice && safariBrowser;
    }

    if (!isIosSafari()) {
      // If it's NOT iOS Safari, do nothing
      return;
    }

    // Otherwise, run the fix after a short delay
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}


const minZoom = 2;
const maxZoom = 9;
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
    }
  }, []);

  // Clear cached systems on page load
  useEffect(() => {
    localStorage.removeItem("cachedSystems");
  }, []);

  const bottomLeftCoord = [
    desiredTopRightCorner[0] - squareSize * 15,
    desiredTopRightCorner[1] - squareSize * 11,
  ];

  return (
    <div className="App">
      <div className="map-container">
        <MapContainer
          preferCanvas={true}
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
            {/* <TileLayer attribution="" url="/src/assets/images/{z}/{x}/{y}.jpg" opacity={0.6} /> */}
            <TileLayer attribution="" url="" />
            <Patreon />
						<Key />
						<FixIOSLayout />
            <Suspense fallback={<div>Loading Markers...</div>}>
              <Markers />
            </Suspense>
            {/* <AddSystemForm /> */}
						<MapEvents />
            <GridLayer
              bottomLeftCoord={bottomLeftCoord}
              lineColor="#ffffff"
              lineOpacity={0.01}
              labelFont="Arial, sans-serif"
              labelColor="#ffffff"
              labelOpacity={0.1}
              squareSize={squareSize}
            />
          </SystemProvider>
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
