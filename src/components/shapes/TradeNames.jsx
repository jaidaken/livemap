import React, { useEffect, useState } from "react";
import { Polygon, Tooltip } from "react-leaflet";
import PropTypes from "prop-types";

// Ensure TradeNames is declared before usage
const TradeNames = (props) => {
  const { text, coords, color, rotation, textStyle } = props;
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

  // const [zoomLevel, setZoomLevel] = useState(5);

  const calculateMajFontSize = () => {
    if (zoomLevel <= 4) return 12;
    if (zoomLevel === 5) return 20;
    if (zoomLevel === 6) return 30;
    if (zoomLevel === 7) return 50;
    return 120;
  };

  const calculateMinFontSize = () => {
    if (zoomLevel <= 4) return 0;
    if (zoomLevel === 5) return 10;
    if (zoomLevel === 6) return 15;
    if (zoomLevel === 7) return 20;
    return 40;
  };

  const calculateNebFontSize = () => {
    if (zoomLevel <= 5) return 0;
    if (zoomLevel === 6) return 15;
    if (zoomLevel === 7) return 20;
    return 40;
  };

  const majStyle = {
    color: color || "#231F20",
    fontSize: calculateMajFontSize(),
    letterSpacing: ".15rem",
    transform: `translate(-53.5%, -5%) rotate(${rotation}) `,
    opacity: 1,
  };

  const minStyle = {
    color: color || "#231F20",
    fontSize: calculateMinFontSize(),
    letterSpacing: ".1rem",
    lineHeight: "1",
    transform: `translate(-53.5%, -5%) rotate(${rotation}) `,
    opacity: 1,
  };

  const nebStyle = {
    color: color || "#231F20",
    fontSize: calculateNebFontSize(),
    letterSpacing: ".1rem",
    lineHeight: "1",
    transform: `translate(-53.5%, -5%) rotate(${rotation}) `,
    opacity: 1,
  };

  const getStyle = (lineStyle) => {
    switch (lineStyle) {
      case "majStyle":
        return majStyle;
      case "minStyle":
        return minStyle;
      case "nebStyle":
        return nebStyle;
      default:
        return [];
    }
  };

  const lines = text.split("\n");
  const style = getStyle(textStyle) || [];

  return (
    <div>
      <Polygon color="transparent" positions={[coords, coords, coords]}>
        {zoomLevel >= 4 ? (
          <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>
            <div className="title-span tradeName" style={style}>
              {lines.map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </Tooltip>
        ) : null}
      </Polygon>
    </div>
  );
};

TradeNames.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string,
  rotation: PropTypes.string,
  coords: PropTypes.array,
  textStyle: PropTypes.string,
};

const MemoizedTradeNames = React.memo(TradeNames);

export default MemoizedTradeNames;
