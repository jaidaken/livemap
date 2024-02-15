import React, { useState } from 'react';
import { Polygon, useMap } from 'react-leaflet';
import { innerRim } from './plots/innerRim';

export default function PolygonObject(props) {
  const [ZoomLevel, setZoomLevel] = useState(3);
  const map = useMap();

  map.on('zoomend', () => {
    setZoomLevel(map.getZoom());
  });

  const { color, opacity  } = props; // Destructure the props

  // Define your styles within the component
  const Style = {
      fillColor: color || '#0079C0', // Use the provided color prop or default to '#0079C0'
      fillOpacity: opacity || 1,
      color: '#202933',
      dashArray: ZoomLevel <= 3 ? '12 12' : '24 24',
      weight: ZoomLevel <= 3 ? 5 : ZoomLevel <= 5 ? 10 : 15,
      lineCap: 'square'
    }
		

  // Select the appropriate style based on the prop
  // const selectedStyle = styles[style] || styles.deepCoreStyle; // Default to deepCoreStyle if not specified

  return (
    <div>
			<Polygon
				positions={innerRim}
				pathOptions={Style}
			/>
    </div>
  );
}
