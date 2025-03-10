import { useState, useEffect } from "react";
import { Polyline } from "react-leaflet";
import PropTypes from "prop-types";

TradeLine.propTypes = {
  color: PropTypes.string,
  lineStyle: PropTypes.string,
  plot: PropTypes.string,
};

export default function TradeLine(props) {
  const savedZoom = localStorage.getItem("zoomLevel");
  const zoomLevel = savedZoom ? parseInt(savedZoom) : 5;

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
    if (zoomLevel <= 3) return 2;
    if (zoomLevel === 4) return 5;
    if (zoomLevel === 5) return 6;
    if (zoomLevel === 6) return 8;
    if (zoomLevel === 7) return 15;
    return 20;
  };

  const majStyle = {
    weight: calculateMajWeight(),
    opacity: 1,
    color: color || "white",
  };

  const calculateMinWeight = () => {
    if (zoomLevel <= 3) return 0.5;
    if (zoomLevel === 4) return 1;
    if (zoomLevel === 5) return 2;
    if (zoomLevel === 6) return 3;
    if (zoomLevel === 7) return 5;
    return 8;
  };

  const minStyle = {
    weight: calculateMinWeight(),
    opacity: 1,
    color: color || "white",
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
    color: color || "white",
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
    color: color || "white",
	};



  const getStyle = (lineStyle) => {
    switch (lineStyle) {
      case "majStyle":
        return majStyle;
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
          <Polyline positions={positions} pathOptions={style} />
        </div>
      ) : null}
    </div>
  );
}
