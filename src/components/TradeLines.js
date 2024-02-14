import React from 'react'
import { Polyline, Polygon, Tooltip } from 'react-leaflet'
import ZoomLevel from './ZoomLevel';

export default function TradeLines() {

	const lineStyle = {
    weight: 10,
		opacity: 1,
		color: "white",
	};


const titleStyle = {
	color: "white",
	fontSize: ZoomLevel <= 3 ? 20 : ZoomLevel === 4 ? 75 : ZoomLevel === 5 ? 180 : 10,
	lineHeight: ZoomLevel <= 3 ? "30px" : ZoomLevel === 4 ? "60px" : ZoomLevel === 5 ? "160px" : "200px"
}

  const byssRun = [
    [
			[-121.93, 96.9],
			[-117.40625, 92.65625],
			[-113.0625, 90],
			[-108.90625, 89.78125],
			[-104.90625, 91],
			[-101.6875, 93.875],
			[-99.53125, 97.8203125],
			[-94.9375, 101.1875],
			[-93.671875, 103.328125],
			[-92.2, 106.73],
			[-91.65625, 108.15625],
			[-90.78, 109.08],
    ]
	];

	return (
		<div>
			<Polyline pathOptions={lineStyle} positions={byssRun} />
			<Polygon
        color="transparent"
        positions={[
          [-110, 93],
          [-110, 93],
          [-110, 93],
        ]}
      >
        <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>
          <div style={titleStyle}>
            Byss Run
          </div>
				</Tooltip>
      </Polygon>
		</div>
	)
}

