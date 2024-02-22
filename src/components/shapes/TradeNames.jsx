import { Polygon, Tooltip } from "react-leaflet";
import { useZoom } from "../functions/ZoomContext";
import PropTypes from "prop-types";

TradeNames.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string,
	rotation: PropTypes.string,
	coords: PropTypes.array,
	textStyle: PropTypes.string
};

export default function TradeNames(props) {
  const { zoomLevel } = useZoom();

  const { text, coords, color, rotation, textStyle } = props;

  const calculateMajFontSize = () => {
    if (zoomLevel <= 5) return 12;
    if (zoomLevel === 6) return 25;
    if (zoomLevel === 7) return 70;
    return 120;
  };

  const calculateMinFontSize = () => {
    if (zoomLevel <= 5) return 0;
    if (zoomLevel === 6) return 10;
    if (zoomLevel === 7) return 20;
    return 40;
  };

  const majStyle = {
    color: color || "#231F20",
    fontSize: calculateMajFontSize(),
    letterSpacing: ".15rem",
    transform: `translate(-53.5%, -5%) rotate(${rotation}) `,
  };

  const minStyle = {
    color: color || "#231F20",
    fontSize: calculateMinFontSize(),
    letterSpacing: ".1rem",
    transform: `translate(-53.5%, -5%) rotate(${rotation}) `,
  };

  const getStyle = (lineStyle) => {
    switch (lineStyle) {
      case "majStyle":
        return majStyle;
      case "minStyle":
        return minStyle;
      default:
        return [];
    }
  };

  const lines = text.split("\n");
  const style = getStyle(textStyle) || [];

  return (
    <div>
      <Polygon color="transparent" positions={[coords, coords, coords]}>
        {zoomLevel >= 5 ? (
          <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>
            <div className="title-span" style={style}>
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
}
