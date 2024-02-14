import { useState } from "react";
import { useMapEvents } from "react-leaflet";

export default function ZoomLevel() {

	let [ZoomLevel, setZoomLevel] = useState(3);

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
	});

	return (
		null
	)
}

