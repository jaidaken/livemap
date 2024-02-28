import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon from "../../assets/marker-icon.svg";
import markerLegend from "../../assets/marker-legend.svg";

const Key = () => {
  const map = useMap();

	useEffect(() => {
    const KeyControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create(
          "div",
          "leaflet-control leaflet-control-custom key-container"
        );
        div.innerHTML = `
          <div class="key-item">
            <img src=${markerIcon} alt="Canon" />
            <span>Canon</span>
          </div>
          <div class="key-item">
            <img src=${markerLegend} alt="Legends" />
            <span>Legends</span>
          </div>
        `;
        return div;
      },
    });

    const keyControlInstance = new KeyControl({ position: "bottomright" });
    map.addControl(keyControlInstance);

    return () => {
      map.removeControl(keyControlInstance);
    };
  }, [map]);

  return null;
};

export default Key;
