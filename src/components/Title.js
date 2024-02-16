import React, { useState } from 'react';
import { Polygon, Tooltip, useMap } from 'react-leaflet';

export default function TitleObject(props) {
  const [ZoomLevel, setZoomLevel] = useState(5);
  const map = useMap();

  map.on('zoomend', () => {
    setZoomLevel(map.getZoom());
  });

  const { text, coords, color  } = props;

	const Style = {
		color: color || "#231F20",
		fontSize:
			ZoomLevel <= 3 ? 20 : ZoomLevel === 4 ? 25 : ZoomLevel === 5 ? 40 : ZoomLevel === 6 ? 70 : 120,
		lineHeight:
			ZoomLevel <= 3
				? "15px"
				: ZoomLevel === 4
				? "20px"
				: ZoomLevel === 5
				? "30px"
				: ZoomLevel === 6
				? "55px"
				: "90px",
		transform: "translate(-53.5%, -5%)",
	}

  const lines = text.split('\n');

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
