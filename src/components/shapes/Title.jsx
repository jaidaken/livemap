import { Polygon, Tooltip } from "react-leaflet";
import { useZoom } from "../functions/ZoomContext";
import PropTypes from "prop-types";

TitleObject.propTypes = {
	color: PropTypes.string,
	text: PropTypes.string,
	coords: PropTypes.array
};

export default function TitleObject(props) {
  const { zoomLevel } = useZoom();

  const { text, coords, color } = props;

  const calculateFontSize = () => {
    if (zoomLevel <= 3) return 20;
    if (zoomLevel === 4) return 25;
    if (zoomLevel === 5) return 40;
    if (zoomLevel === 6) return 70;
    return 120;
  };

  const calculateLineHeight = () => {
    if (zoomLevel <= 3) return "15px";
    if (zoomLevel === 4) return "20px";
    if (zoomLevel === 5) return "30px";
    if (zoomLevel === 6) return "55px";
    return "90px";
  };

  const Style = {
    color: color || "#231F20",
    fontSize: calculateFontSize(),
    lineHeight: calculateLineHeight(),
    transform: "translate(-53.5%, -5%)",
    zIndex: 1,
  };

  const lines = text.split("\n");

  return (
    <div>
      <Polygon color="transparent" positions={[coords, coords, coords]}>
        <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>
          <div className="title-span" style={Style}>
            {lines.map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </Tooltip>
      </Polygon>
    </div>
  );
}
