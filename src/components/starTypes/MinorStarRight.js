import React from 'react'
import { Marker, Tooltip, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useZoom } from '../functions/ZoomContext'

export default function MinorStarRight(props) {
  const { zoomLevel } = useZoom()
  const position = props.position
  const name = props.name

  const calculateIconSize = () => {
    if (zoomLevel <= 5) return [10, 10]
    if (zoomLevel === 6) return [15, 15]
    return [20, 20]
  }

  const iconSize = calculateIconSize()
  const iconAnchor = iconSize.map((dim) => dim / 2)

  const minorIcon = new Icon({
    iconUrl: '/images/marker-icon.svg',
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: [7, -10],
  })

  const calculateFontSize = () => {
    if (zoomLevel <= 5) return 15
    if (zoomLevel === 6) return 20
    return 30
  }

  const calculateStroke = () => {
    if (zoomLevel <= 5) return '0.3px black'
    if (zoomLevel === 6) return '0.5px black'
    return '1px black'
  }

  const calculateMarginLeft = () => {
    if (zoomLevel <= 5) return '2px'
    if (zoomLevel === 6) return '4px'
    return '8px'
  }

  const minorStyleRight = {
    fontSize: calculateFontSize(),
    fontWeight: 'bold',
    color: '#E3B687',
    WebkitTextStroke: calculateStroke(),
    textAlign: 'left',
    position: 'relative',
    marginLeft: calculateMarginLeft(),
  }

  return (
    <div>
      {zoomLevel >= 5 ? (
        <Marker position={position} icon={minorIcon}>
          {zoomLevel >= 6 ? (
            <Tooltip direction="right" opacity={1} permanent>
              <div className="major-popup" style={minorStyleRight}>
                {name}
              </div>
            </Tooltip>
          ) : null}
          <Popup>
            <a
              href={`https://starwars.fandom.com/wiki/${name.replace(
                / /g,
                '_',
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              {name} wiki page
            </a>
          </Popup>
        </Marker>
      ) : null}
    </div>
  )
}
