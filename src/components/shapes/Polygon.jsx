import React, { useState, useEffect } from "react";
import { Polygon } from "react-leaflet";
import PropTypes from "prop-types";

const PolygonObject = (props) => {
  const savedZoom = localStorage.getItem("zoomLevel");
  const zoomLevel = savedZoom ? parseInt(savedZoom) : 5;

  const { color, line, lineOpacity, opacity, dash, plot } = props;

  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const importPolygon = async () => {
      try {
        const tradelineModule = await import(`./plots/${plot}.jsx`);
        setPositions(tradelineModule[plot] || []);
      } catch (error) {
        console.error(`Error importing nebula "${plot}":`, error);
        setPositions([]);
      }
    };

    importPolygon();
  }, [plot]);

  const calculateWeight = () => {
    if (zoomLevel <= 3) return 1;
    if (zoomLevel === 4) return 2;
    if (zoomLevel === 5) return 3;
    if (zoomLevel === 6) return 4;
    return 6;
  };

  return (
    <Polygon
      positions={positions}
      color={color}
      weight={calculateWeight()}
      opacity={opacity}
      dashArray={dash}
      lineCap={line}
      lineJoin={line}
      fillOpacity={lineOpacity}
    />
  );
};

PolygonObject.propTypes = {
  color: PropTypes.string,
  line: PropTypes.string,
  lineOpacity: PropTypes.number,
  opacity: PropTypes.number,
  dash: PropTypes.number,
  plot: PropTypes.string,
};

// Memoize the PolygonObject component to prevent unnecessary re-renders
const MemoizedPolygonObject = React.memo(PolygonObject);

export default MemoizedPolygonObject;
