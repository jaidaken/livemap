import React, { useRef, useEffect, useState } from "react";
import { Marker, Tooltip, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import PropTypes from "prop-types";
import markerIconCanon from "../../assets/marker-canon.svg";
import markerIconLegends from "../../assets/marker-legends.svg";
import markerIconShared from "../../assets/marker-shared.svg";
import markerIconError from "../../assets/marker-error.svg";

const Star = (props) => {
  const {
    position,
    name,
    wiki,
    isCanon,
    isLegends,
    hasError,
    alignRight,
    starType,
  } = props;

  const markerRef = useRef(null);
  const workerRef = useRef(null);

  const [zoomLevel, setZoomLevel] = useState(() => {
    const savedZoom = localStorage.getItem("zoomLevel");
    return savedZoom ? parseInt(savedZoom) : 5;
  });

  const [iconSize, setIconSize] = useState([10, 10]);
  const [fontSize, setFontSize] = useState(12);
  const [strokeSize, setStrokeSize] = useState("1px black");
  const [marginLeft, setMarginLeft] = useState("0px");
  const [marginRight, setMarginRight] = useState("0px");

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

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../workers/star/styleWorker.js", import.meta.url)
      );
    }

    workerRef.current.postMessage({ zoomLevel, starType, hasError });

    workerRef.current.onmessage = function (e) {
      setIconSize(e.data.iconSize);
      setFontSize(e.data.fontSize);
      setStrokeSize(e.data.strokeSize);
      setMarginLeft(e.data.marginLeft);
      setMarginRight(e.data.marginRight);
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [zoomLevel, starType, hasError]);

  const calculateIcon = () => {
    let markerIcon;

    if (hasError) {
      markerIcon = markerIconError;
    } else if (isCanon && !isLegends) {
      markerIcon = markerIconCanon;
    } else if (!isCanon && isLegends) {
      markerIcon = markerIconLegends;
    } else if (isCanon && isLegends) {
      markerIcon = markerIconShared;
    } else {
      markerIcon = markerIconError;
    }

    return markerIcon;
  };

  const markerIcon = calculateIcon();

  const iconAnchor = iconSize.map((dim) => dim / 2);

  const icon = new Icon({
    iconUrl: markerIcon !== null ? markerIcon : markerIconError,
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: [7, -10],
  });

  useEffect(() => {
    const applyStrokeStyles = () => {
      const svgElements = document.querySelectorAll(".icon-shadow");
      svgElements.forEach((svg) => {
        svg.style.stroke = "black";
        svg.style.strokeWidth = "12px";
      });
    };

    const timeoutId = setTimeout(applyStrokeStyles, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const starStyle = {
    fontSize: `${fontSize}px`,
    fontWeight: "bold",
    color: hasError
      ? "#C7303A"
      : isCanon && !isLegends
      ? "#F6A6CA"
      : !isCanon && isLegends
      ? "#529DD4"
      : isCanon && isLegends
      ? "#E3B687"
      : "#C7303A",
    WebkitTextStroke: strokeSize,
    textAlign: alignRight ? "right" : "left",
    marginTop: "0px",
    marginRight: marginRight,
    marginLeft: marginLeft,
    position: "relative",
    zIndex: hasError
      ? 11
      : isCanon && !isLegends
      ? 9
      : !isCanon && isLegends
      ? 8
      : isCanon && isLegends
      ? 10
      : 7,
  };

  const onTooltipClick = () => {
    if (markerRef.current) {
      markerRef.current.leafletElement.fireEvent("click");
    }
  };

  return (
    <div className="">
      {zoomLevel >= 2 ? (
        <Marker ref={markerRef} position={position} icon={icon}>
          {zoomLevel >= 3 && starType === "MajorStar" ? (
            <Tooltip
              interactive={true}
              onClick={onTooltipClick}
              direction={alignRight === true ? "left" : "right"}
              opacity={1}
              permanent
            >
              <div
                className="marker-popup marker-animate name-shadow"
                style={starStyle}
              >
                {name}
              </div>
            </Tooltip>
          ) : zoomLevel >= 4 && starType === "MidStar" ? (
            <Tooltip
              interactive={true}
              onClick={onTooltipClick}
              direction={alignRight === true ? "left" : "right"}
              opacity={1}
              permanent
            >
              <div
                className="marker-popup marker-animate name-shadow"
                style={starStyle}
              >
                {name}
              </div>
            </Tooltip>
          ) : zoomLevel >= 5 ? (
            <Tooltip
              interactive={true}
              onClick={onTooltipClick}
              direction={alignRight === true ? "left" : "right"}
              opacity={1}
              permanent
            >
              <div
                className="marker-popup marker-animate name-shadow"
                style={starStyle}
              >
                {name}
              </div>
            </Tooltip>
          ) : null}
          <Popup>
            <a href={`${wiki}`} target="_blank" rel="noreferrer">
              {name} wiki page
            </a>
          </Popup>
        </Marker>
      ) : null}
    </div>
  );
};

Star.propTypes = {
  position: PropTypes.array,
  name: PropTypes.string,
  wiki: PropTypes.string,
  isCanon: PropTypes.bool,
  isLegends: PropTypes.bool,
  hasError: PropTypes.bool,
  alignRight: PropTypes.bool,
  starType: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const MemoizedStar = React.memo(Star);

export default MemoizedStar;
