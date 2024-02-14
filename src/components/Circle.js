import React from 'react'
import { Circle } from "react-leaflet";

export default function CircleObject(props) {

	const radius = props.radius
	const center = props.center
	const style = props.style

	return (
		<div>
      <Circle
				center={center}
        pathOptions={style}
				radius={radius}
			/>
		</div>
	)
}
