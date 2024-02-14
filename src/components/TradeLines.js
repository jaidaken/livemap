import React, { useState } from "react";
import { Polyline, Polygon, Tooltip, useMapEvents } from "react-leaflet";

export default function TradeLines() {
  let [ZoomLevel, setZoomLevel] = useState(3);

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
  });

  const lineStyle = {
    weight: ZoomLevel <= 4 ? 5 : ZoomLevel === 5 ? 10 : ZoomLevel === 6 ? 30 : ZoomLevel === 7 ? 50 : 20,
    opacity: 1,
    color: "white",
  };

  const byssRunStyle = {
    color: "white",
		fontSize: ZoomLevel === 4 ? 20 : ZoomLevel === 5 ? 30 : ZoomLevel === 6 ? 100 : ZoomLevel === 7 ? 180 : 0,
		marginLeft: ZoomLevel === 4 ? 0 : ZoomLevel === 5 ? 0 : ZoomLevel === 6 ? -90 : ZoomLevel === 7 ? -120 : 0,
		marginBottom: ZoomLevel === 4 ? 0 : ZoomLevel === 5 ? 20 : ZoomLevel === 6 ? 100 : ZoomLevel === 7 ? 300 : 0,
		transform: "rotate(-40deg)"
	};

	const byssCords = [-102.25, 91.9375]

  const byssRun = [
    [
      [-121.93, 96.9],
      [-117.40625, 92.65625],
      [-113.0625, 90],
      [-108.90625, 89.78125],
      [-104.90625, 91],
      [-101.6875, 93.875],
      [-99.66, 97.96],
      [-94.9375, 101.1875],
      [-93.671875, 103.328125],
      [-92.2, 106.73],
      [-91.65625, 108.15625],
      [-90.78, 109.08],
    ],
  ];

  return (
		<div>
			{ZoomLevel >= 3 ? (
      <div className="ByssRun">
        <Polyline pathOptions={lineStyle} positions={byssRun} />
        <Polygon
          color="transparent"
          positions={[
            [byssCords],
            [byssCords],
            [byssCords],
          ]}
					>
						{ZoomLevel >= 4 ? (
        <Tooltip direction="right" offset={[-10, -20]} opacity={1} permanent>
            <div style={byssRunStyle}>Byss Run</div>
							</Tooltip>
						) : null}
        </Polygon>
				</div>
			) : null}
    </div>
  );
}
