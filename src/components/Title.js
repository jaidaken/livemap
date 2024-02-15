import React, { useState } from 'react';
import { Polygon, Tooltip, useMap } from 'react-leaflet';

export default function TitleObject(props) {
  const [ZoomLevel, setZoomLevel] = useState(3);
  const map = useMap();

  map.on('zoomend', () => {
    setZoomLevel(map.getZoom());
  });

  const { text, coords, color  } = props; // Destructure the props

  // Define your styles within the component
  const Style = {
    color: color || "#231F20",
    fontSize:
      ZoomLevel <= 3 ? 40 : ZoomLevel === 4 ? 75 : ZoomLevel === 5 ? 180 : 250,
    lineHeight:
      ZoomLevel <= 3
        ? "30px"
        : ZoomLevel === 4
        ? "60px"
        : ZoomLevel === 5
        ? "160px"
        : "200px",
  };

  const lines = text.split('\n');
  // Select the appropriate style based on the prop
  // const selectedStyle = styles[style] || styles.deepCoreStyle; // Default to deepCoreStyle if not specified

  return (
    <div>
      <Polygon
        color="transparent"
        positions={[
          coords,
          coords,
          coords,
        ]}
      >
        <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>
				<div className='title-span' style={Style}>
            {lines.map((line, index) => (
              <span key={index}>{line}<br /></span>
            ))}
          </div>
        </Tooltip>
      </Polygon>
    </div>
  );
}
