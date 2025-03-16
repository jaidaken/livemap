import { useEffect } from "react";
import { useMap } from "react-leaflet";
import PropTypes from "prop-types";
import L, { Control } from "leaflet";

const Filter = ({ activeFilters, onFilterChange }) => {
  const map = useMap();

  useEffect(() => {
    const handleCheckboxChange = (filter) => {
      onFilterChange(filter);
    };

    const filterControl = Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create(
          "div",
          "leaflet-control leaflet-control-custom filter-container"
        );

        const title = document.createElement("div");
        title.textContent = "Filters";
        title.classList.add("filter-title");
        div.appendChild(title);

        const createCheckbox = (filter, label) => {
          const checkbox = document.createElement("input");
					checkbox.type = "checkbox";
					checkbox.checked = activeFilters.includes(filter);
					checkbox.id = `${filter}-id`;
          checkbox.addEventListener("change", () => handleCheckboxChange(filter));

          const checkboxLabel = document.createElement("label");
          checkboxLabel.appendChild(checkbox);
          checkboxLabel.appendChild(document.createTextNode(` ${label}`));
          checkboxLabel.classList.add("filter-item");

          return checkboxLabel;
        };

        const legendsCheckbox = createCheckbox("legends", "Legends");
        const canonCheckbox = createCheckbox("canon", "Canon");

        div.appendChild(canonCheckbox);
        div.appendChild(legendsCheckbox);

        return div;
      },
    });

    const filterControlInstance = new filterControl({ position: 'bottomleft' });
    map.addControl(filterControlInstance);

    return () => {
      map.removeControl(filterControlInstance);
    };
  }, [map, activeFilters, onFilterChange]);

  return null;
};

Filter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default Filter;
