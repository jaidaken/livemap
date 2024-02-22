import { Polyline } from "react-leaflet";
import { useZoom } from "../functions/ZoomContext";
import { byssRun } from "./tradelines/byssRun";
import { goluud } from "./tradelines/goluud";
import { korosTrunk } from "./tradelines/korosTrunk";
import { carbonite } from "./tradelines/carbonite";
import PropTypes from "prop-types";

TradeLine.propTypes = {
  color: PropTypes.string,
  lineStyle: PropTypes.string,
  plot: PropTypes.string,
};

export default function TradeLine(props) {
  const { zoomLevel } = useZoom();
  const { plot, lineStyle, color } = props;

  const calculateMajWeight = () => {
    if (zoomLevel <= 3) return 2;
    if (zoomLevel === 4) return 3;
    if (zoomLevel === 5) return 4;
    if (zoomLevel === 6) return 8;
    if (zoomLevel === 7) return 15;
    return 25;
  };

  const majStyle = {
    weight: calculateMajWeight(),
    opacity: 1,
    color: color || "white",
  };

  const calculateMinWeight = () => {
    if (zoomLevel <= 3) return 0;
    if (zoomLevel === 4) return 2;
    if (zoomLevel === 5) return 3;
    if (zoomLevel === 6) return 4;
    if (zoomLevel === 7) return 6;
    return 10;
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

  const getPositions = (plot) => {
    switch (plot) {
      case "byssRun":
        return byssRun;
      case "goluud":
        return goluud;
      case "korosTrunk":
        return korosTrunk;
      case "carbonite":
        return carbonite;
      default:
        return [];
    }
  };

  const getStyle = (lineStyle) => {
    switch (lineStyle) {
      case "majStyle":
        return majStyle;
      case "minStyle":
        return minStyle;
      case "dashStyle":
        return dashStyle;
      default:
        return [];
    }
  };

  const positions = getPositions(plot) || [];
  const style = getStyle(lineStyle) || [];

  return (
    <div>
      {zoomLevel >= 3 ? (
        <div className="ByssRun">
          <Polyline positions={positions} pathOptions={style} />
        </div>
      ) : null}
    </div>
  );
}
