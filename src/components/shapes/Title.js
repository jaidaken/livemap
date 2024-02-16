import React from 'react'
import { Polygon, Tooltip } from 'react-leaflet'
import { useZoom } from '../functions/ZoomContext'

export default function TitleObject(props) {
  const { zoomLevel } = useZoom()

  const { text, coords, color } = props

  const Style = {
    color: color || '#231F20',
    fontSize:
      zoomLevel <= 3
        ? 20
        : zoomLevel === 4
        ? 25
        : zoomLevel === 5
        ? 40
        : zoomLevel === 6
        ? 70
        : 120,
    lineHeight:
      zoomLevel <= 3
        ? '15px'
        : zoomLevel === 4
        ? '20px'
        : zoomLevel === 5
        ? '30px'
        : zoomLevel === 6
        ? '55px'
        : '90px',
    transform: 'translate(-53.5%, -5%)',
  }

  const lines = text.split('\n')

  return (
    <div>
      <Polygon color="transparent" positions={[coords, coords, coords]}>
        <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>
          <div className="title-span" style={Style}>
            {lines.map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </Tooltip>
      </Polygon>
    </div>
  )
}
