import React from 'react'
import 'leaflet/dist/leaflet.css'
import './App.css'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { CRS } from 'leaflet'
import Markers from './components/Markers.js'
import GridLayer from './components/shapes/GridLayer.js'
import Key from './components/shapes/Key.js'
import { ZoomProvider } from './components/functions/ZoomContext.js'
import Patreon from './components/shapes/Patreon.js'

const MapEvents = () => {
  useMapEvents({
    click(e) {
      console.log(`[${e.latlng.lat}, ${e.latlng.lng}],`)
      navigator.clipboard.writeText(`[${e.latlng.lat}, ${e.latlng.lng}],`)
    },
  })
  return false
}

// Constants for initial map configuration
const initialCenter = [-128, 128]
const initialZoom = 5
const minZoom = 3
const maxZoom = 8

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
            {/* <TileLayer attribution="" url="/images/{z}/{x}/{y}.jpg" /> */}
						<TileLayer attribution="" url="" />
						<Patreon />
            <Key />
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
          </ZoomProvider>
        </MapContainer>
      </div>
    </div>
  )
}

export default App
