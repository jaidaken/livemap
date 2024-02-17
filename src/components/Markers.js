import React, { useState, useEffect, useCallback } from 'react'
import './Markers.css'
import CircleObject from './shapes/Circle.js'
import TradeLines from './shapes/TradeLines.js'
import TitleObject from './shapes/Title.js'
import PolygonObject from './shapes/Polygon.js'
import { fetchSystems } from './functions/fetch.js'
import { useMap } from 'react-leaflet'
import { useZoom } from './functions/ZoomContext.js'

const starComponents = {
  MajorStar: React.lazy(() => import('./starTypes/MajorStar.js')),
  MidStar: React.lazy(() => import('./starTypes/MidStar.js')),
  MinorStarLeft: React.lazy(() => import('./starTypes/MinorStarLeft.js')),
  MinorStarLeftLegends: React.lazy(() =>
    import('./starTypes/MinorStarLeftLegends.js'),
  ),
  MinorStarRight: React.lazy(() => import('./starTypes/MinorStarRight.js')),
  MinorStarRightLegends: React.lazy(() =>
    import('./starTypes/MinorStarRightLegends.js'),
  ),
  // Add more star types as needed
}

export default function Markers() {
  const map = useMap()
  const { zoomLevel } = useZoom()

  const [starSystems, setStarSystems] = useState([])
  const [visibleMarkers, setVisibleMarkers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchSystems()
      setStarSystems(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }, [])

  const updateVisibleMarkers = useCallback(() => {
    if (!map) {
      return
    }

    const bounds = map.getBounds()
    const markers = starSystems.filter(({ latitude, longitude }) =>
      bounds.contains([latitude, longitude]),
    )
    setVisibleMarkers(markers)
  }, [map, starSystems])

  useEffect(() => {
    fetchData()

    const handleZoomEnd = () => {
      updateVisibleMarkers()
    }

    const handleMoveEnd = () => {
      updateVisibleMarkers()
    }

    if (map) {
      map.on('zoomend', handleZoomEnd)
      map.on('moveend', handleMoveEnd)

      return () => {
        map.off('zoomend', handleZoomEnd)
        map.off('moveend', handleMoveEnd)
      }
    }
  }, [map, fetchData, updateVisibleMarkers])

  useEffect(() => {
    if (!loading) {
      updateVisibleMarkers()
    }
  }, [loading, zoomLevel, updateVisibleMarkers])

  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading &&
        visibleMarkers.map(({ id, name, latitude, longitude, starType }) => {
          const StarComponent = starComponents[starType]

          if (!StarComponent) {
            console.error(`Component not found for starType: ${starType}`)
            return null
          }

          return (
            <React.Suspense key={id} fallback={<div>Loading...</div>}>
              <StarComponent position={[latitude, longitude]} name={name} />
            </React.Suspense>
          )
        })}

			<PolygonObject plot="innerRim" color="#1B609F" opacity={0.2} />
			<PolygonObject plot="expansionRegion" color="#25538A" opacity={0.2} />
			<PolygonObject plot="midRim" color="#264476" opacity={0.2} />
			<PolygonObject plot="outerRim" color="#2D3E6E" opacity={0.2} />
			<PolygonObject plot="huttSpace" color="#2C446C" line="#FF7200" opacity={1} lineOpacity={1} dash={1} />

      <CircleObject
        center={[-128, 128]}
        radius={17.98}
        color="#006CB5"
        opacity={1}
      />
      <CircleObject
        center={[-128, 128]}
        radius={13.4}
        color="#0073BB"
        opacity={1}
      />
      <CircleObject
        center={[-128, 128]}
        radius={7.78}
        color="#0079C0"
        opacity={1}
      />

      <TradeLines />

      <TitleObject
        color=""
        coords={[-127.625, 125.625]}
        text={`D E E P\nC O R E`}
      />
      <TitleObject
        color=""
        coords={[-133.1875, 119.0625]}
        text={`C O R E\nW O R L D S`}
      />
      <TitleObject
        color=""
        coords={[-136.875, 114.78125]}
        text={`C O L O N I E S`}
      />
      <TitleObject
        color=""
        coords={[-142.5625, 111.4375]}
        text={`I N N E R\nR I M`}
      />
      <TitleObject
        color=""
        coords={[-147.1875, 108.5625]}
        text={`E X P A N S I O N\nR E G I O N`}
      />
      <TitleObject color="" coords={[-154, 107.0625]} text={`M I D\nR I M`} />
      <TitleObject
        color=""
        coords={[-160.1875, 101.125]}
        text={`O U T E R\nR I M`}
      />
      <TitleObject
        color=""
        coords={[-133.75, 89.1875]}
        text={`U N K N O W N\nR E G I O N S`}
      />
      <TitleObject
        color=""
        coords={[-122.375, 179.625]}
        text={`H U T T\nS P A C E`}
      />
    </div>
  )
}
