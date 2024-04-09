/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext, useState, useEffect } from "react";
import { useMapEvents } from "react-leaflet";
import PropTypes from "prop-types";

const ZoomContext = createContext();

export const ZoomProvider = ({ children }) => {
  let [zoomLevel, setZoomLevel] = useState(5);

  useMapEvents({
    zoomend: (event) => {
      const newZoomLevel = event.target.getZoom();
      setZoomLevel(newZoomLevel);
    },
  });

  useEffect(() => {
    console.log(zoomLevel);
  }, [zoomLevel]);

  return (
    <ZoomContext.Provider value={{ zoomLevel, setZoomLevel }}>
      {children}
    </ZoomContext.Provider>
  );
};

ZoomProvider.propTypes = {
  children: PropTypes.node,
};

export const useZoom = () => {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error("useZoom must be used within a ZoomProvider");
  }
  return context;
};
