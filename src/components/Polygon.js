import React from 'react'
import { Polygon } from 'react-leaflet'
import { innerRim } from './plots/innerRim'
import { useZoom } from './ZoomContext'

export default function PolygonObject(props) {
  const { zoomLevel } = useZoom()

  const { color, opacity } = props // Destructure the props

  // Define your styles within the component
  const Style = {
    fillColor: color || '#0079C0', // Use the provided color prop or default to '#0079C0'
    fillOpacity: opacity || 1,
    color: '#202933',
    dashArray: zoomLevel <= 3 ? '12 12' : '24 24',
    weight: zoomLevel <= 3 ? 5 : zoomLevel <= 5 ? 10 : 15,
    lineCap: 'square',
  }

  // Select the appropriate style based on the prop
  // const selectedStyle = styles[style] || styles.deepCoreStyle; // Default to deepCoreStyle if not specified

  return (
    <div>
      <Polygon positions={innerRim} pathOptions={Style} />
    </div>
  )
}
