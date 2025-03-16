import React, { useState, useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import { fetchSystems } from "./functions/fetch.jsx";
import { useSystemContext } from "./functions/useSystemContext.jsx";
import SearchBarUI from "./ui/SearchBarUI.jsx";
import Filter from "./ui/filter.jsx";
import Star from "./shapes/Star.jsx";
import MemoAreaPlots from "./plots/AreaPlots.jsx";
import MemoTerritoryPlots from "./plots/TerritoryPlots.jsx";
import MemoNebulaPlots from "./plots/NebulaPlots.jsx";
import MemoLanePlots from "./plots/LanePlots.jsx";

const MemoStar = React.memo(Star);

export default function Markers() {
  const map = useMap();
  const { newSystemAdded, handleAddSystem } = useSystemContext();

  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  useEffect(() => {
    const handleMapChange = () => setZoomLevel(map.getZoom());
    map.on("zoomend", handleMapChange);

    return () => {
      map.off("zoomend", handleMapChange);
    };
  }, [map]);

  const [allSystems, setAllSystems] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([
    "legends",
    "canon",
    "shared",
  ]);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSystems();
      setAllSystems(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching systems:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const updateVisibleMarkers = useCallback(() => {
    if (!map || allSystems.length === 0) return;

    const bounds = map.getBounds();

    const filtered = allSystems.filter(
      ({ latitude, longitude, isCanon, isLegends, isShared }) => {
        const inView = bounds.contains([latitude, longitude]);
        const matchesFilter =
          (isCanon && activeFilters.includes("canon") && !isShared) ||
          (isLegends && activeFilters.includes("legends") && !isShared) ||
          (isShared && activeFilters.includes("shared"));

        return inView && matchesFilter;
      }
    );

    setVisibleMarkers(filtered);
  }, [map, allSystems, activeFilters]);

  useEffect(() => {
    const handleMapChange = () => {
      updateVisibleMarkers();
      localStorage.setItem(
        "mapCenter",
        JSON.stringify([map.getCenter().lat, map.getCenter().lng])
      );
    };

    // Debounce handleMapChange to reduce frequency of updates
    const debouncedHandleMapChange = debounce(handleMapChange, 200);

    map.on("zoomend", debouncedHandleMapChange);
    map.on("moveend", debouncedHandleMapChange);

    if (!loading) {
      updateVisibleMarkers();
    }

    return () => {
      map.off("zoomend", debouncedHandleMapChange);
      map.off("moveend", debouncedHandleMapChange);
    };
  }, [map, loading, updateVisibleMarkers]);

  useEffect(() => {
    if (newSystemAdded) {
      fetchAllData();
      handleAddSystem(); // Reset state after fetching
    }
  }, [newSystemAdded, fetchAllData, updateVisibleMarkers, handleAddSystem]);

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

  useEffect(() => {
    updateVisibleMarkers();
  }, [activeFilters, updateVisibleMarkers]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading &&
        visibleMarkers.map(
          ({
            id,
            name,
            latitude,
            longitude,
            starType,
            wiki,
            isCanon,
            isLegends,
            hasError,
            alignRight,
          }) => {
            return (
              <React.Suspense key={id} fallback={<div>Loading...</div>}>
                <MemoStar
                  position={[latitude, longitude]}
                  name={name}
                  starType={starType}
                  wiki={wiki}
                  isCanon={isCanon}
                  isLegends={isLegends}
                  hasError={hasError}
                  alignRight={alignRight}
                />
              </React.Suspense>
            );
          }
        )}

      <SearchBarUI systems={allSystems} onSystemSelect={handleSystemSelect} />

      <Filter
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />

      {/* Memoized static layers */}
      <MemoAreaPlots zoomLevel={zoomLevel} />
      <MemoTerritoryPlots zoomLevel={zoomLevel} />
      <MemoNebulaPlots zoomLevel={zoomLevel} />
      <MemoLanePlots zoomLevel={zoomLevel} />
    </div>
  );
}

// Debounce function to limit the rate of function execution
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
