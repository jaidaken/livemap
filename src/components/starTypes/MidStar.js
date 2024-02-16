import React from 'react'
import { Marker, Tooltip, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useZoom } from '../functions/ZoomContext'

export default function MidStar(props) {
  const { zoomLevel } = useZoom()

  const position = props.position
  const name = props.name

  const calculateIconSize = () => {
    if (zoomLevel <= 4) return [20, 20]
    if (zoomLevel === 5) return [25, 25]
    if (zoomLevel === 6) return [30, 30]
    return 55
  }

  const iconSize = calculateIconSize()
  const iconAnchor = [iconSize[0] / 2, iconSize[1] / 2]

  const calculateMarginLeft = () => {
    if (zoomLevel <= 4) return '6px'
    if (zoomLevel === 5) return '10px'
    return '16px'
  }

  const midIcon = new Icon({
    iconUrl: '/images/marker-icon-mid.svg',
    iconSize: calculateIconSize(),
    iconAnchor: iconAnchor,
    popupAnchor: [7, -10],
  })

  const midStyle = {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#CC8A46',
    WebkitTextStroke: '1px black',
    textAlign: 'left',
    position: 'relative',
    marginLeft: calculateMarginLeft(),
  }

  return (
    <div>
      {zoomLevel >= 4 ? (
        <Marker position={position} icon={midIcon}>
          <Tooltip direction="right" opacity={1} permanent>
            <div className="major-popup" style={midStyle}>
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
              {name} wiki page
            </a>
          </Popup>
        </Marker>
      ) : null}
    </div>
  )
}
