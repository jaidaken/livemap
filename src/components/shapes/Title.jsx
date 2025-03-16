import { Polygon, Tooltip } from "react-leaflet";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const TitleObject = (props) => {

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
      <Polygon className="marker-animate" color="transparent" positions={[coords, coords, coords]}>
        <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>
          <div className="title-span marker-animate" style={Style}>
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
};

TitleObject.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string,
  coords: PropTypes.array,
};

const MemoizedTitleObject = React.memo(TitleObject);

export default MemoizedTitleObject;
