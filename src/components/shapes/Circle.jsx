import { useEffect, useState } from "react";
import { Circle } from "react-leaflet";
import PropTypes from "prop-types";

CircleObject.propTypes = {
	radius: PropTypes.number.isRequired,
	center: PropTypes.array.isRequired,
	color:PropTypes.string,
	opacity:PropTypes.number,
}

export default function CircleObject(props) {

		const [zoomLevel, setZoomLevel] = useState(() => {
			const savedZoom = localStorage.getItem("zoomLevel");
			return savedZoom ? parseInt(savedZoom) : 5;
		});

		useEffect(() => {
			const handleZoomChange = () => {
				const updatedZoom = parseInt(localStorage.getItem("zoomLevel") || "5");
				setZoomLevel(updatedZoom);
			};

			window.addEventListener("storage", handleZoomChange);
			window.addEventListener("zoomend", handleZoomChange);

			const interval = setInterval(handleZoomChange, 500);

			return () => {
				window.removeEventListener("storage", handleZoomChange);
				window.removeEventListener("zoomend", handleZoomChange);
				clearInterval(interval);
			};
		}, []);

  const { radius, center, color, opacity } = props;

  const calculateDashArray = (radius, zoomLevel) => {
    const circumference = 4 * Math.PI * radius;

    // Adjust dashCount based on zoom level
    const baseDashCount = 12;
    let zoomAdjustedDashCount = baseDashCount - zoomLevel;

    // Limit the dashCount to avoid too many dashes
    const maxDashCount = 12;

    if (zoomAdjustedDashCount < 1) {
      zoomAdjustedDashCount = 1;
    } else if (zoomAdjustedDashCount > maxDashCount) {
      zoomAdjustedDashCount = maxDashCount;
    }

    const dashLength = circumference / zoomAdjustedDashCount;

    return `${dashLength} `.repeat(zoomAdjustedDashCount).trim();
  };

  const dashArray = calculateDashArray(radius, zoomLevel);

  const calculateWeight = () => {
    if (zoomLevel <= 3) return 1;
    if (zoomLevel === 4) return 2;
    if (zoomLevel === 5) return 3;
    if (zoomLevel === 6) return 4;
    return 6;
  };

  const Style = {
    fillColor: color || "#0079C0",
    fillOpacity: opacity || 1,
    color: "#202933",
    dashArray: dashArray,
    weight: calculateWeight(),
    lineCap: "square",
  };

  return (
    <div>
      <Circle center={center} pathOptions={Style} radius={radius} className="marker-animate"/>
    </div>
  );
}
