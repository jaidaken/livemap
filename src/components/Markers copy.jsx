import { useState, useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import { fetchSystems } from "./functions/fetch.jsx";
import { useSystemContext } from "./functions/useSystemContext.jsx";
import SearchBarUI from "./ui/SearchBarUI.jsx";
import Filter from "./ui/filter.jsx";
import PixiOverlay from "react-leaflet-pixi-overlay";

// Helper: determine icon color based on system properties
const getIconColor = (system) => {
  if (system.hasError) return "#C7303A";
  if (system.isCanon && !system.isLegends) return "#F6A6CA";
  if (!system.isCanon && system.isLegends) return "#529DD4";
  if (system.isCanon && system.isLegends) return "#E3B687";
  return "#C7303A";
};

export default function Markers() {
  const map = useMap();
  const { newSystemAdded, handleAddSystem } = useSystemContext();

  const [allSystems, setAllSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([
    "legends",
    "canon",
    "shared",
  ]);
  const [markers, setMarkers] = useState([]);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching systems...");
      const data = await fetchSystems();
      setAllSystems(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching systems:", error);
      setLoading(false);
    }
  }, []);

  // Debounce fetching data
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchAllData();
    }, 100);
    debouncedFetch();
    return () => {
      debouncedFetch.cancel && debouncedFetch.cancel();
    };
  }, [fetchAllData]);

  // Refetch if a new system is added
  useEffect(() => {
    if (newSystemAdded) {
      console.log("New system added, fetching data...");
      fetchAllData();
      handleAddSystem(); // Reset the flag after fetching
    }
  }, [newSystemAdded, fetchAllData, handleAddSystem]);

  // Prepare markers based on allSystems and activeFilters
  useEffect(() => {
    if (allSystems.length > 0) {
      const filteredSystems = allSystems.filter((system) => {
        // Apply filtering logic based on activeFilters
        if (activeFilters.includes("shared") && system.isCanon && system.isLegends)
          return true;
        if (activeFilters.includes("canon") && system.isCanon && !system.isLegends)
          return true;
        if (activeFilters.includes("legends") && !system.isCanon && system.isLegends)
          return true;
        return false;
      });

      const newMarkers = filteredSystems.map((system) => ({
        id: system.id,
        position: [system.latitude, system.longitude],
        iconColor: getIconColor(system),
        tooltip: system.name,
        popup: `<a href="${system.wiki}" target="_blank" rel="noreferrer">${system.name} wiki page</a>`,
        onClick: () => {
          console.log(`Marker ${system.id} clicked`);
          map.flyTo([system.latitude, system.longitude], 10);
        },
      }));

      setMarkers(newMarkers);
    }
  }, [allSystems, activeFilters, map]);

  const handleSystemSelect = useCallback(
    (selectedSystem) => {
      const { latitude, longitude } = selectedSystem;
      map.flyTo([latitude, longitude], 10);
    },
    [map]
  );

  const handleFilterChange = useCallback((filter) => {
    setActiveFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
  }, []);

  return (
    <div>
      {loading && <div>Loading...</div>}
      <SearchBarUI systems={allSystems} onSystemSelect={handleSystemSelect} />
      <Filter activeFilters={activeFilters} onFilterChange={handleFilterChange} />

      {/* Pass marker data to PixiMarkers */}
      {!loading && markers.length > 0 && <PixiOverlay markers={markers} />}
    </div>
  );
}

function debounce(func, wait) {
  let timeout;
  function debounced(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
}
