import React, { useState, useEffect, useCallback } from "react";
import { fetchSystems } from "./functions/fetch.jsx";
import { useMap } from "react-leaflet";
import { useSystemContext } from "./functions/SystemContext.jsx";
import SearchBarUI from "./ui/SearchBarUI.jsx";
import Filter from "./ui/filter.jsx";
import Star from "./shapes/Star.jsx";
import MemoNebulaPlots from "./plots/NebulaPlots.jsx";
import MemoAreaPlots from "./plots/AreaPlots.jsx";
import MemoTerritoryPlots from "./plots/TerritoryPlots.jsx";
import MemoLanePlots from "./plots/LanePlots.jsx";

// const starComponents = {
//   MajorStar: React.lazy(() => import("./startypes/MajorStar.jsx")),
//   MidStar: React.lazy(() => import("./startypes/MidStar.jsx")),
//   MinorStar: React.lazy(() => import("./startypes/MinorStar.jsx")),
// };

export default function Markers() {
  const map = useMap();

  const savedZoom = localStorage.getItem("zoomLevel");
  const zoomLevel = savedZoom ? parseInt(savedZoom) : 5;

  const [starSystems, setStarSystems] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  const [activeFilters, setActiveFilters] = useState([
    "legends",
    "canon",
    "shared",
  ]);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchSystems();
      setStarSystems(data);
      setLoading(false);
      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, []);

  const updateVisibleMarkers = useCallback(() => {
    if (!map) {
      return;
    }

    const bounds = map.getBounds();

    const markers = starSystems.filter(
      ({ latitude, longitude, isCanon, isLegends, isShared }) => {
        const isCanonVisible = activeFilters.includes("canon");
        const isLegendsVisible = activeFilters.includes("legends");
        const isSharedVisible = activeFilters.includes("shared");

        if (
          (isCanon && isCanonVisible && !isShared) ||
          (isLegends && isLegendsVisible && !isShared) ||
          (isShared && isSharedVisible)
        ) {
          return bounds.contains([latitude, longitude]);
        } else {
          return false;
        }
      }
    );

    setVisibleMarkers(markers);
  }, [map, starSystems, activeFilters]);

  const handleFilterChange = useCallback((filter) => {
    setActiveFilters((prevFilters) => {
      if (prevFilters.includes(filter)) {
        return prevFilters.filter((f) => f !== filter);
      } else {
        return [...prevFilters, filter];
      }
    });
  }, []);

  useEffect(() => {
    let timer;

    // Single handler for both zoom and move events
    const handleMapChange = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        updateVisibleMarkers();
      }, 500);
    };

    if (map) {
      map.on("zoomend", handleMapChange);
      map.on("moveend", handleMapChange);

      if (!dataFetched) {
        fetchData();
      } else {
        updateVisibleMarkers();
      }

      return () => {
        map.off("zoomend", handleMapChange);
        map.off("moveend", handleMapChange);
      };
    }
  }, [map, dataFetched, fetchData, updateVisibleMarkers]);

  useEffect(() => {
    if (!loading) {
      updateVisibleMarkers();
    }
  }, [loading, zoomLevel, updateVisibleMarkers]);

  const { newSystemAdded, handleAddSystem } = useSystemContext();

  useEffect(() => {
    if (newSystemAdded === true) {
      handleAddSystem();
      fetchData();
      updateVisibleMarkers();
    }
  }, [newSystemAdded, fetchData, updateVisibleMarkers, handleAddSystem]);

  const handleSystemSelect = useCallback(
    (selectedSystem) => {
      const { latitude, longitude } = selectedSystem;
      map.flyTo([latitude, longitude], 10);
    },
    [map]
  );

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
                <Star
                  position={[latitude, longitude]}
                  name={name}
                  wiki={wiki}
                  isCanon={isCanon}
                  isLegends={isLegends}
                  hasError={hasError}
                  alignRight={alignRight}
                  starType={starType} // Pass the starType property
                />
              </React.Suspense>
            );
          }
        )}

      <SearchBarUI systems={starSystems} onSystemSelect={handleSystemSelect} />

      <Filter
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />

      <MemoAreaPlots />

      <MemoTerritoryPlots />

      <MemoNebulaPlots />

      <MemoLanePlots />
    </div>
  );
}
