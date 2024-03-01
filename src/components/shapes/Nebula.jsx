import { useState, useEffect } from "react";
import { Polygon } from "react-leaflet";
import { useZoom } from "../functions/ZoomContext";
import PropTypes from "prop-types";

NebulaObject.propTypes = {
  color: PropTypes.string,
  line: PropTypes.string,
  lineOpacity: PropTypes.number,
  opacity: PropTypes.number,
  dash: PropTypes.number,
  plot: PropTypes.string,
};

export default function NebulaObject(props) {
  const { zoomLevel } = useZoom();
  const { color, line, lineOpacity, opacity, dash, plot } = props;

	const [positions, setPositions] = useState([]);

  useEffect(() => {
    const importNebula = async () => {
      try {
        const tradelineModule = await import(`./nebula/${plot}.jsx`);
        setPositions(tradelineModule[plot] || []);
      } catch (error) {
        console.error(`Error importing nebula "${plot}":`, error);
        setPositions([]);
      }
    };

    importNebula();
	}, [plot]);

  const calculateWeight = () => {
    if (zoomLevel <= 3) return 1;
    if (zoomLevel === 4) return 2;
    if (zoomLevel === 5) return 3;
    if (zoomLevel === 6) return 4;
    return 6;
  };

  const calculateDashArray = () => {
    if (zoomLevel <= 3) return [25, 25];
    if (zoomLevel === 4) return [28, 28];
    if (zoomLevel === 5) return [32, 32];
    if (zoomLevel === 6) return [37, 37];
    return [45, 45];
  };

  // Define your styles within the component

  const Style = {
    fillColor: color || "#0079C0",
    fillOpacity: opacity || 1,
    color: line || "#202933",
    opacity: lineOpacity || 1,
    dashArray: dash || calculateDashArray(),
    weight: calculateWeight(),
    lineCap: "square",
  };

  return (
    <div>
      <Polygon positions={positions} pathOptions={Style} />
    </div>
  );
}
