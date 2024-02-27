import { useState } from "react";
import PropTypes from "prop-types";

const SearchBar = ({ systems, onSystemSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectSystem = (system) => {
    onSystemSelect(system);
    setSearchQuery("");
	};

	const filteredSystems = searchQuery
	? systems.filter((system) =>
			system.name.toLowerCase().includes(searchQuery.toLowerCase())
		)
	: [];

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a system..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <ul>
          {filteredSystems.map((system) => (
            <li key={system.id} onClick={() => handleSelectSystem(system)}>
              {system.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  systems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    })
  ).isRequired,
  onSystemSelect: PropTypes.func.isRequired,
};

export default SearchBar;
