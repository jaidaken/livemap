import { useState, useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import { fetchSystems } from "./functions/fetch.jsx";
import { useSystemContext } from "./functions/useSystemContext.jsx";
import SearchBarUI from "./ui/SearchBarUI.jsx";
import Filter from "./ui/filter.jsx";

import PixiMarkers from "./shapes/PixiMarkers.jsx";

import MemoAreaPlots from "./plots/AreaPlots.jsx";
import MemoTerritoryPlots from "./plots/TerritoryPlots.jsx";
import MemoNebulaPlots from "./plots/NebulaPlots.jsx";
import MemoLanePlots from "./plots/LanePlots.jsx";
// import MemoizedStar from "./shapes/Star.jsx";

export default function Markers() {
  const map = useMap();
  const { newSystemAdded, handleAddSystem } = useSystemContext();

  const [zoomLevel, setZoomLevel] = useState(map.getZoom());
  const [allSystems, setAllSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([
    "legends",
    "canon",
    "shared",
  ]);

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

  useEffect(() => {
    const debouncedFetchAllData = debounce(() => {
      fetchAllData();
    }, 100);

    debouncedFetchAllData();

    return () => {
      debouncedFetchAllData.cancel && debouncedFetchAllData.cancel();
    };
  }, [fetchAllData]);

  useEffect(() => {
    if (newSystemAdded) {
      console.log("New system added, fetching data...");
      fetchAllData();
      handleAddSystem(); // Reset state after fetching
    }
  }, [newSystemAdded, fetchAllData, handleAddSystem]);

	const handleZoomEnd = useCallback(() => {
		const currentZoom = map.getZoom();
		console.log("Zoom changed to:", currentZoom);
		setZoomLevel(currentZoom);
	}, [map]);

	const handleMoveEnd = useCallback(() => {
		localStorage.setItem(
			"mapCenter",
			JSON.stringify([map.getCenter().lat, map.getCenter().lng])
		);
		// console.log("center changed");
	}, [map]);

	useEffect(() => {
		map.on("zoomend", handleZoomEnd);
		map.on("moveend", handleMoveEnd);

		return () => {
			map.off("zoomend", handleZoomEnd);
			map.off("moveend", handleMoveEnd);
		};
	}, [map, handleZoomEnd, handleMoveEnd]);

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

      {!loading && (
        <PixiMarkers
          key="pixi-markers" // explicitly stable key
          allSystems={allSystems}
          activeFilters={activeFilters}
          map={map}
          zoomLevel={zoomLevel}
          loading={loading}
        />
      )}

      <SearchBarUI systems={allSystems} onSystemSelect={handleSystemSelect} />

      <Filter
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />

      <MemoAreaPlots zoomLevel={zoomLevel} />
      <MemoTerritoryPlots zoomLevel={zoomLevel} />
      <MemoNebulaPlots zoomLevel={zoomLevel} />
      <MemoLanePlots zoomLevel={zoomLevel} />
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
