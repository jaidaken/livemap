import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { Control } from "leaflet";

const Filter = () => {
  const map = useMap();

  useEffect(() => {
    const handleCheckboxChange = (imgSrc, popupClass) => {
      const elementsToHide = document.querySelectorAll(`img[src="${imgSrc}"]:not(.key-container img)`);
			const popupsToHide = document.querySelectorAll(`.${popupClass}:not(.key-container .${popupClass})`);


      elementsToHide.forEach((element) => {
        element.style.display = element.style.display === "none" ? "block" : "none";
      });

      popupsToHide.forEach((popup) => {
        popup.style.display = popup.style.display === "none" ? "block" : "none";
      });

      // Additional image sources for Canon box
      if (imgSrc === '/src/assets/marker-icon.svg') {
        const majorElementsToHide = document.querySelectorAll(`img[src="/src/assets/marker-icon-major.svg"]:not(.key-container img)`);
        const midElementsToHide = document.querySelectorAll(`img[src="/src/assets/marker-icon-mid.svg"]:not(.key-container img)`);

        majorElementsToHide.forEach((element) => {
          element.style.display = element.style.display === "none" ? "block" : "none";
        });

        midElementsToHide.forEach((element) => {
          element.style.display = element.style.display === "none" ? "block" : "none";
        });
      }
    };

    const patreonControl = Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create(
          "div",
          "leaflet-control leaflet-control-custom filter-container"
        );
        div.innerHTML = `
          <div class="filter-box">
            <input type="checkbox" id="Legends-checkbox" name="Legends" value="Legends" checked>
            <label for="Legends"> Legends</label><br>
            <input type="checkbox" id="Canon-checkbox" name="Canon" value="Canon" checked>
            <label for="Canon"> Canon</label><br>
          </div>
        `;
				const legend = "/src/assets/marker-legend.svg"
				const canon = "/src/assets/marker-icon.svg"

				div.querySelector("#Legends-checkbox").addEventListener("change", () => handleCheckboxChange(legend, 'legends-popup'));
        div.querySelector("#Canon-checkbox").addEventListener("change", () => handleCheckboxChange(canon, 'canon-popup'));
        return div;
      },
    });

    const patreonControlInstance = new patreonControl({
      position: "bottomleft",
    });

    map.addControl(patreonControlInstance);

    return () => {
      map.removeControl(patreonControlInstance);
    };
  }, [map]);

  return null;
};

export default Filter;
