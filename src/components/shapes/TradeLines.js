import React from 'react'
import { Polyline, Polygon, Tooltip } from 'react-leaflet'
import { useZoom } from '../functions/ZoomContext'

export default function TradeLines() {
  const { zoomLevel } = useZoom()

  const lineStyle = {
    weight:
      zoomLevel <= 3
        ? 2
        : zoomLevel === 4
        ? 3
        : zoomLevel === 5
        ? 4
        : zoomLevel === 6
        ? 8
        : 15,
    opacity: 1,
    color: 'white',
  }

  const byssRunStyle = {
    color: 'white',
    fontSize:
      zoomLevel === 5
        ? 20
        : zoomLevel === 6
        ? 30
        : zoomLevel === 7
        ? 50
        : zoomLevel === 8
        ? 80
        : 0,
    marginLeft:
      zoomLevel === 5
        ? -5
        : zoomLevel === 6
        ? -10
        : zoomLevel === 7
        ? -10
        : zoomLevel === 8
        ? -10
        : 0,
    marginBottom:
      zoomLevel === 5
        ? 10
        : zoomLevel === 6
        ? 20
        : zoomLevel === 7
        ? 80
        : zoomLevel === 8
        ? 200
        : 0,
    transform: 'rotate(-40deg)',
  }

  const byssCords = [-125.40625, 123.453125]

  const byssRun = [
    [
      [-130.53125, 124.8828125],
      [-128.3203125, 123.1015625],
      [-127.265625, 122.9921875],
      [-126.234375, 123.28125],
      [-125.328125, 124.0078125],
      [-124.6796875, 125.109375],
      [-123.4140625, 126.0703125],
      [-122.78125, 127.4609375],
      [-122.6171875, 127.859375],
      [-122.3671875, 128.078125],
    ],
  ]

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
