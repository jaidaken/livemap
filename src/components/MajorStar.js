import React from 'react'
import { Marker, Tooltip, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useZoom } from './ZoomContext'

export default function MajorStar(props) {
  const { zoomLevel } = useZoom()

  const { position, name } = props

  const calculateFontSize = () => {
    if (zoomLevel === 4) return 25
    if (zoomLevel === 5) return 30
    if (zoomLevel === 6) return 40
    return 55
  }

  const calculateIconSize = () => {
    if (zoomLevel <= 4) return [20, 20]
    if (zoomLevel === 5) return [30, 30]
    if (zoomLevel === 6) return [40, 40]
    return 55
  }

  const iconSize = calculateIconSize()
  const iconAnchor = [iconSize[0] / 2, iconSize[1] / 2] // Calculate anchor as half of size

  const majorIcon = new Icon({
    iconUrl: '/images/marker-icon-major.svg',
    iconSize: calculateIconSize(),
    iconAnchor: iconAnchor,
    popupAnchor: [7, -10],
  })

  const majorStyle = {
    fontSize: calculateFontSize(),
    fontWeight: 'bold',
    color: '#B56327',
    WebkitTextStroke: '1px black',
    textAlign: 'left',
    position: 'relative',
    marginLeft: zoomLevel <= 4 ? '6px' : zoomLevel === 5 ? '12px' : '16px',
  }

  return (
    <div>
      {zoomLevel >= 4 ? (
        <Marker position={position} icon={majorIcon}>
          <Tooltip direction="right" opacity={1} permanent>
            <div className="major-popup" style={majorStyle}>
              {name}
            </div>
          </Tooltip>
          <Popup>
            <a
              href={`https://starwars.fandom.com/wiki/${name.replace(
                / /g,
                '_',
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              {' '}
              {name} wiki page
            </a>
          </Popup>
        </Marker>
      ) : null}
    </div>
  )
}
