import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { createRoot } from "react-dom/client";
import SearchBar from "../functions/SearchBar";
import L from "leaflet";
import PropTypes from "prop-types";

const SearchBarUI = ({ systems, onSystemSelect }) => {
  const map = useMap();

  useEffect(() => {
    const SearchBarControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create(
          "div",
          "leaflet-control leaflet-control-search search-container"
        );

        createRoot(div).render(
          <SearchBar systems={systems} onSystemSelect={onSystemSelect} />
        );

        return div;
      },
    });

    const searchBarControlInstance = new SearchBarControl({
      position: "topright",
    });
    searchBarControlInstance.addTo(map);

    return () => {
      map.removeControl(searchBarControlInstance);
    };
  }, [map, systems, onSystemSelect]);

  return null;
};

SearchBarUI.propTypes = {
  systems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    })
  ).isRequired,
  onSystemSelect: PropTypes.func.isRequired,
};

export default SearchBarUI;
