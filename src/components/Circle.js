import React from 'react'
import { Circle } from 'react-leaflet'
import { useZoom } from './ZoomContext'

export default function CircleObject(props) {
  const { zoomLevel } = useZoom()

  const { radius, center, color, opacity } = props

  const calculateDashArray = (radius, zoomLevel) => {
    const circumference = 2 * Math.PI * radius

    // Adjust dashCount based on zoom level
    const baseDashCount = 4 // Adjust the base number of dashes
    let zoomAdjustedDashCount = baseDashCount - zoomLevel

    // Limit the dashCount to avoid too many dashes
    const maxDashCount = 8 // You can adjust this value based on your preference

    if (zoomAdjustedDashCount < 1) {
      zoomAdjustedDashCount = 1
    } else if (zoomAdjustedDashCount > maxDashCount) {
      zoomAdjustedDashCount = maxDashCount
    }

    const dashLength = circumference / zoomAdjustedDashCount

    return `${dashLength} `.repeat(zoomAdjustedDashCount).trim()
  }

  const dashArray = calculateDashArray(radius, zoomLevel)

  const calculateWeight = () => {
    if (zoomLevel <= 3) return 1
    if (zoomLevel === 4) return 2
    if (zoomLevel === 5) return 3
    if (zoomLevel === 6) return 4
    return 6
  }

  const Style = {
    fillColor: color || '#0079C0',
    fillOpacity: opacity || 1,
    color: '#202933',
    dashArray: dashArray,
    weight: calculateWeight(),
    lineCap: 'square',
  }

  return (
    <div>
      <Circle center={center} pathOptions={Style} radius={radius} />
    </div>
  )
}
