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

  const calculateDashArray = () => {
    if (zoomLevel <= 3) return [25, 25];
    if (zoomLevel === 4) return [28, 28];
    if (zoomLevel === 5) return [32, 32];
    if (zoomLevel === 6) return [37, 37];
    return [45, 45];
  };

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
      <Polygon positions={positions} pathOptions={Style} className="marker-animate"/>
    </div>
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
