import React from 'react'
import { Marker, Tooltip, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useZoom } from '../functions/ZoomContext'

export default function MajorStar(props) {
  const { zoomLevel } = useZoom()

  const { position, name } = props


  const calculateIconSize = () => {
    if (zoomLevel <= 4) return [20, 20]
    if (zoomLevel === 5) return [30, 30]
    if (zoomLevel === 6) return [40, 40]
		return [55, 55];
  }

  const iconSize = calculateIconSize()
  const iconAnchor = [iconSize[0] / 2, iconSize[1] / 2] // Calculate anchor as half of size

  const majorIcon = new Icon({
    iconUrl: '/images/marker-icon-major.svg',
    iconSize: calculateIconSize(),
    iconAnchor: iconAnchor,
    popupAnchor: [7, -10],
	})

	const calculateFontSize = () => {
    if (zoomLevel === 4) return 25
    if (zoomLevel === 5) return 30
    if (zoomLevel === 6) return 40
    return 55
  }

	const calculateMarginSize = () => {
    if (zoomLevel <= 4) return '6px'
    if (zoomLevel === 5) return '12px'
    if (zoomLevel === 6) return '16px'
		return '24px';
	}

	const calculateStroke= () => {
    if (zoomLevel <= 4) return '0.6px black'
    if (zoomLevel === 5) return '0.7px black'
    if (zoomLevel === 6) return '0.8px black'
		return '1px black';
  }

  const majorStyle = {
    fontSize: calculateFontSize(),
    fontWeight: 'bold',
    color: '#B56327',
    WebkitTextStroke: calculateStroke(),
    textAlign: 'left',
    position: 'relative',
    marginLeft: calculateMarginSize(),
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
