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

  const [zoomLevel, setZoomLevel] = useState(map.getZoom());
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

  useEffect(() => {
    if (allSystems.length > 0) {
      const filteredSystems = allSystems.filter((system) => {
        // Apply filtering logic based on activeFilters
        if (
          activeFilters.includes("shared") &&
          system.isCanon &&
          system.isLegends
        )
          return true;
        if (
          activeFilters.includes("canon") &&
          system.isCanon &&
          !system.isLegends
        )
          return true;
        if (
          activeFilters.includes("legends") &&
          !system.isCanon &&
          system.isLegends
        )
          return true;
        return false;
			});

			const customSvgIcon = `<svg viewBox="0 0 8684 8684" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2">
  <g fill-rule="nonzero">
    <path d="M8681 4335.12c-2528.89 0-4338.71 1817.35-4336.5 4340.29C4342.296 6152.48 2517.56 4335.12.42 4335.12c2517.13 0 4338.71-1816.18 4336.5-4340.29 2.204 2524.1 1815.18 4340.29 4344.08 4340.29" fill="#ebffff"/>
    <path d="M8681 4335.12l-.446-510.692c-1376.19-1.17-2610.79 503.646-3480.43 1373.58-869.65 868.762-1374.36 2093.24-1361.39 3477.39h1023.32c-1.212-1384.15-519.821-2608.62-1390.99-3477.39-871.167-869.934-2094.88-1374.75-3471.07-1373.58l.892 1021.38c1376.19 2.35 2599.03-503.646 3468.67-1372.4 869.65-868.758 1386.12-2094.41 1384.91-3478.56h-1023.32c-10.55 1384.15 496.296 2609.8 1367.46 3478.56 871.166 868.759 2106.65 1374.76 3482.83 1372.4l-.892-1021.38.446 510.692-.446-510.692c-1129.18-1.17-2082.28-405.029-2753.31-1074.21-671.034-670.354-1071.78-1615.42-1072.77-2755.38h-1023.32c-10.767 1139.95-409.854 2085.02-1079.72 2755.38-669.862 669.179-1622.25 1073.04-2751.43 1074.21l.891 1021.38c1129.18 2.35 2082.28 405.033 2753.31 1074.21 671.033 671.525 1071.78 1616.6 1084.53 2755.38h1023.32c-.996-1138.78 398.096-2083.85 1067.96-2755.38 669.863-669.179 1622.26-1071.86 2751.43-1074.21l-.892-1021.38.446 510.692" fill="#e3b685"/>
  </g>
</svg>`;


      const newMarkers = filteredSystems.map((system) => ({
        id: system.id,
        position: [system.latitude, system.longitude],
        // If the system has a custom icon property set, use it:
        // customIcon: markerShared,
				customIcon: customSvgIcon,
				markerSpriteAnchor: [0.5, 0.5],
        // Optionally, include an iconId (required if you're using customIcon caching)
        // iconId: `${system.id}`,
        // Only use iconColor if no customIcon is provided
        iconColor: system.customIcon ? undefined : getIconColor(system),
        tooltip: system.name,
        popup: `<a href="${system.wiki}" target="_blank" rel="noreferrer">${system.name} wiki page</a>`,
        onClick: () => {
          console.log(`Marker ${system.id} clicked`);
          map.flyTo([system.latitude, system.longitude], 10);
        },
      }));
      // console.log("Visible markers:", newMarkers);
      setVisibleMarkers(newMarkers);
    }
  }, [allSystems, activeFilters, map]);

  // const updateVisibleMarkers = useCallback(() => {
  // 	if (!map || allSystems.length === 0) return;

  // 	const bounds = map.getBounds();
  // 	const simpleBounds = {
  // 		north: bounds.getNorth(),
  // 		south: bounds.getSouth(),
  // 		east: bounds.getEast(),
  // 		west: bounds.getWest(),
  // 	};

  // 	const worker = new Worker(new URL("./workers/markerWorker.js", import.meta.url));
  // 	worker.postMessage({ allSystems, bounds: simpleBounds, activeFilters });

  // 	worker.onmessage = function (e) {
  // 		setVisibleMarkers(e.data.map((marker) => ({ ... marker})));
  // 		worker.terminate();
  // 	};
  // }, [map, allSystems, activeFilters]);

  const handleMapChange = useCallback(() => {
    setZoomLevel(map.getZoom());
    // updateVisibleMarkers();
    localStorage.setItem(
      "mapCenter",
      JSON.stringify([map.getCenter().lat, map.getCenter().lng])
    );
  }, [map]);

  useEffect(() => {
    map.on("zoomend", handleMapChange);
    map.on("moveend", handleMapChange);

    return () => {
      map.off("zoomend", handleMapChange);
      map.off("moveend", handleMapChange);
    };
  }, [map, loading, handleMapChange]);

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
      {/* {!loading &&
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
                <MemoizedStar
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
				)} */}


      {!loading && (
				<PixiMarkers zoomLevel={zoomLevel} visibleMarkers={visibleMarkers} allSystems={allSystems} activeFilters={activeFilters} map={map} />
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
