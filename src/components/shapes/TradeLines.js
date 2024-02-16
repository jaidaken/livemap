import React from 'react'
import { Polyline, Polygon, Tooltip } from 'react-leaflet'
import { useZoom } from '../functions/ZoomContext'
import { byssRun } from './tradelines/byssRun'

export default function TradeLines() {
  const { zoomLevel } = useZoom()

  const calculateWeight = () => {
    if (zoomLevel <= 3) return 2
    if (zoomLevel === 4) return 3
    if (zoomLevel === 5) return 4
    if (zoomLevel === 6) return 8
    return 15
  }

  const lineStyle = {
    weight: calculateWeight(),
    opacity: 1,
    color: 'white',
  }

  const calculateFontSize = () => {
    if (zoomLevel <= 5) return 20
    if (zoomLevel === 6) return 30
    if (zoomLevel === 7) return 50
    if (zoomLevel === 8) return 80
    return 0
  }
  const calculateMarginLeft = () => {
    if (zoomLevel <= 5) return -5
    return -10
  }
  const calculateMarginBottom = () => {
    if (zoomLevel <= 5) return 10
    if (zoomLevel === 6) return 20
    if (zoomLevel === 7) return 80
    if (zoomLevel === 8) return 200
    return 0
  }

  const byssRunStyle = {
    color: 'white',
    fontSize: calculateFontSize(),
    marginLeft: calculateMarginLeft(),
    marginBottom: calculateMarginBottom(),
    transform: 'rotate(-40deg)',
  }

  const byssCords = [-125.40625, 123.453125]

  return (
    <div>
      {zoomLevel >= 3 ? (
        <div className="ByssRun">
          <Polyline pathOptions={lineStyle} positions={byssRun} />
          <Polygon
            color="transparent"
            positions={[[byssCords], [byssCords], [byssCords]]}
          >
            {zoomLevel >= 5 ? (
              <Tooltip
                direction="right"
                offset={[-10, -20]}
                opacity={1}
                permanent
              >
                <div style={byssRunStyle}>Byss Run</div>
              </Tooltip>
            ) : null}
          </Polygon>
        </div>
      ) : null}
    </div>
  )
}
