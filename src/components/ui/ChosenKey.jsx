import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const ChosenKey = () => {
  const map = useMap();

  useEffect(() => {
    const TerritoryKeyControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create(
          "div",
          "leaflet-control leaflet-control-custom key-container"
        );
        div.innerHTML = `
          <div class="key-item">
            <div style="
						  background: #CD6C3D;
							width: 20px;
							height: 20px;
							border-radius: 50%;
							display: inline-block;
							margin-right: 5px;">
						</div>
            <span>Rebels</span>
          </div>

          <div class="key-item">
            <div style="background:rgb(231, 193, 39); width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 5px;"></div>
            <span>Hutts</span>
          </div>

          <div class="key-item">
            <div style="background: #01258D; width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 5px;"></div>
            <span>Empire</span>
          </div>

          <div class="key-item">
            <div style="background: #5F5F5F; width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 5px;"></div>
            <span>Tarkin's Empire</span>
          </div>

          <div class="key-item">
            <div style="background: #8129A8; width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 5px;"></div>
            <span>Royen's Secularists</span>
          </div>

					<div class="key-item">
            <div style="background: #5E0909; width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 5px;"></div>
            <span>Cult of Maul</span>
          </div>
					<div class="key-item">
            <div style="background:rgb(99, 146, 68); width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 5px;"></div>
            <span>Mandalore Revolt</span>
          </div>
        `;
        return div;
      },
    });

    const territoryKeyControlInstance = new TerritoryKeyControl({
      position: "bottomright",
    });
    map.addControl(territoryKeyControlInstance);

    return () => {
      map.removeControl(territoryKeyControlInstance);
    };
  }, [map]);

  return null;
};

export default ChosenKey;
