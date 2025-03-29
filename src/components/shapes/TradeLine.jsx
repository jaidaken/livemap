import React, { useState, useEffect } from "react";
import { Polyline } from "react-leaflet";
import PropTypes from "prop-types";

// Ensure TradeLine is declared before usage
const TradeLine = (props) => {
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

  const { plot, lineStyle, color } = props;

  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const importTradeline = async () => {
      try {
        const tradelineModule = await import(`./tradelines/${plot}.jsx`);
        setPositions(tradelineModule[plot] || []);
      } catch (error) {
        console.error(`Error importing tradeline "${plot}":`, error);
        setPositions([]);
      }
    };

    importTradeline();
  }, [plot]);

  const calculateMajWeight = () => {
    if (zoomLevel <= 3) return 4;
    if (zoomLevel === 4) return 5;
    if (zoomLevel === 5) return 7;
    if (zoomLevel === 6) return 10;
    if (zoomLevel === 7) return 15;
    return 20;
  };

  const majStyle = {
    weight: calculateMajWeight(),
    opacity: 1,
    color: color || "#82899e",
	};

	const calculateMidWeight = () => {
    if (zoomLevel <= 3) return 0.6;
    if (zoomLevel === 4) return 3;
    if (zoomLevel === 5) return 4;
    if (zoomLevel === 6) return 6;
    if (zoomLevel === 7) return 10;
    return 8;
  };

  const midStyle = {
    weight: calculateMidWeight(),
    opacity: 1,
    color: color || "#82899e",
  };

  const calculateMinWeight = () => {
    if (zoomLevel <= 3) return 0.2;
    if (zoomLevel === 4) return 1;
    if (zoomLevel === 5) return 2;
    if (zoomLevel === 6) return 3;
    if (zoomLevel === 7) return 5;
    return 8;
  };

  const minStyle = {
    weight: calculateMinWeight(),
    opacity: 1,
    color: color || "#82899e",
  };

  const calculateDash = () => {
    if (zoomLevel <= 4) return "1, 3";
    if (zoomLevel === 5) return "2, 5";
    if (zoomLevel === 6) return "4, 10";
    if (zoomLevel === 7) return "4, 16";
    return "6, 24";
  };

  const dashStyle = {
    weight: calculateMinWeight(),
    opacity: 1,
    dashArray: calculateDash(),
    color: color || "#c75d16",
  };

  const calculateMicroWeight = () => {
    if (zoomLevel <= 4) return 0;
    if (zoomLevel === 5) return 1;
    if (zoomLevel === 6) return 1.5;
    if (zoomLevel === 7) return 3;
    if (zoomLevel === 8) return 4;
    return 5;
  };

  const microStyle = {
    weight: calculateMicroWeight(),
    opacity: 1,
    color: color || "#82899e",
  };

  const getStyle = (lineStyle) => {
    switch (lineStyle) {
      case "majStyle":
        return majStyle;
      case "midStyle":
        return midStyle;
      case "minStyle":
        return minStyle;
      case "dashStyle":
        return dashStyle;
      case "microStyle":
        return microStyle;
      default:
        return [];
    }
  };

  // const positions = tradelines[plot] || [];
  const style = getStyle(lineStyle) || [];

  return (
    <div>
      {zoomLevel >= 2 ? (
        <div>
          <Polyline
            className="marker-animate"
            positions={positions}
            pathOptions={style}
            zIndex={4}
          />
        </div>
      ) : null}
    </div>
  );
};

TradeLine.propTypes = {
  color: PropTypes.string,
  lineStyle: PropTypes.string,
  plot: PropTypes.string,
};

// Memoize the TradeLine component to prevent unnecessary re-renders
const MemoizedTradeLine = React.memo(TradeLine);

export default MemoizedTradeLine;
