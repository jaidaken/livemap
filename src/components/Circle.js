import React, { useState } from 'react';
import { Circle, useMap } from 'react-leaflet';

export default function CircleObject(props) {
  const [ZoomLevel, setZoomLevel] = useState(3);
  const map = useMap();

  map.on('zoomend', () => {
    setZoomLevel(map.getZoom());
  });

  const { radius, center, color, opacity  } = props; // Destructure the props

  // Define your styles within the component
  const Style = {
      fillColor: color || '#0079C0', // Use the provided color prop or default to '#0079C0'
      fillOpacity: opacity || 1,
      color: '#202933',
      dashArray: ZoomLevel <= 3 ? '12 12' : '24 24',
      weight: ZoomLevel <= 3 ? 1 : ZoomLevel === 4 ? 2 : ZoomLevel === 5 ? 3 : ZoomLevel >= 6 ? 4 : 6,
      lineCap: 'square'
    }


  // Select the appropriate style based on the prop
  // const selectedStyle = styles[style] || styles.deepCoreStyle; // Default to deepCoreStyle if not specified

  return (
    <div>
      <Circle
        center={center}
        pathOptions={Style} // Use the selected style
        radius={radius}
      />
    </div>
  );
}
