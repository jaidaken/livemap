import React, { useState, useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import { fetchSystems } from "./functions/fetch.jsx";
// import { useSystemContext } from "./functions/SystemContext.jsx";
import SearchBarUI from "./ui/SearchBarUI.jsx";
import Filter from "./ui/filter.jsx";
import Star from "./shapes/Star.jsx";

import MemoAreaPlots from "./plots/AreaPlots.jsx";
import MemoTerritoryPlots from "./plots/TerritoryPlots.jsx";
import MemoNebulaPlots from "./plots/NebulaPlots.jsx";
import MemoLanePlots from "./plots/LanePlots.jsx";

// export default function Markers() {
//   const map = useMap();

//   const savedZoom = localStorage.getItem("zoomLevel");
//   const zoomLevel = savedZoom ? parseInt(savedZoom) : 5;

//   const [starSystems, setStarSystems] = useState([]);
//   const [visibleMarkers, setVisibleMarkers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [dataFetched, setDataFetched] = useState(false);

//   const [activeFilters, setActiveFilters] = useState([
//     "legends",
//     "canon",
//     "shared",
//   ]);

//   const fetchData = useCallback(async () => {
//     try {
//       const data = await fetchSystems();
//       setStarSystems(data);
//       setLoading(false);
//       setDataFetched(true);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//     }
//   }, []);

//   const updateVisibleMarkers = useCallback(() => {
//     if (!map) {
//       return;
//     }

export default function Markers() {
  const map = useMap();

  const [allSystems, setAllSystems] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeFilters, setActiveFilters] = useState([
    "legends",
    "canon",
    "shared",
  ]);

  // 1. Fetch everything one time when the component mounts (or page refreshes)
  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        const data = await fetchSystems(); // this returns *all* systems
        setAllSystems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching systems:", error);
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  // 2. Whenever map moves/zooms, or filters change, figure out which systems are visible
  const updateVisibleMarkers = useCallback(() => {
    if (!map || allSystems.length === 0) return;

    const bounds = map.getBounds();

    //     const markers = starSystems.filter(
    //       ({ latitude, longitude, isCanon, isLegends, isShared }) => {
    //         const isCanonVisible = activeFilters.includes("canon");
    //         const isLegendsVisible = activeFilters.includes("legends");
    //         const isSharedVisible = activeFilters.includes("shared");

    //         if (
    //           (isCanon && isCanonVisible && !isShared) ||
    //           (isLegends && isLegendsVisible && !isShared) ||
    //           (isShared && isSharedVisible)
    //         ) {
    //           return bounds.contains([latitude, longitude]);
    //         } else {
    //           return false;
    //         }
    //       }
    //     );

    //     setVisibleMarkers(markers);
    //   }, [map, starSystems, activeFilters]);

    //   const handleFilterChange = useCallback((filter) => {
    //     setActiveFilters((prevFilters) => {
    //       if (prevFilters.includes(filter)) {
    //         return prevFilters.filter((f) => f !== filter);
    //       } else {
    //         return [...prevFilters, filter];
    //       }
    //     });
    //   }, []);

    //   useEffect(() => {
    //     let timer;

    //     // Single handler for both zoom and move events
    //     const handleMapChange = () => {
    //       clearTimeout(timer);
    //       timer = setTimeout(() => {
    //         updateVisibleMarkers();
    //       }, 500);
    //     };

    //     if (map) {
    //       map.on("zoomend", handleMapChange);
    //       map.on("moveend", handleMapChange);

    //       if (!dataFetched) {
    //         fetchData();
    //       } else {
    //         updateVisibleMarkers();
    //       }

    //       return () => {
    //         map.off("zoomend", handleMapChange);
    //         map.off("moveend", handleMapChange);
    //       };
    //     }
    //   }, [map, dataFetched, fetchData, updateVisibleMarkers]);

    //   useEffect(() => {
    //     if (!loading) {
    //       updateVisibleMarkers();
    //     }
    //   }, [loading, zoomLevel, updateVisibleMarkers]);

    //   const { newSystemAdded, handleAddSystem } = useSystemContext();

    //   useEffect(() => {
    //     if (newSystemAdded === true) {
    //       handleAddSystem();
    //       fetchData();
    //       updateVisibleMarkers();
    //     }
    //   }, [newSystemAdded, fetchData, updateVisibleMarkers, handleAddSystem]);

    //   const handleSystemSelect = useCallback(
    //     (selectedSystem) => {
    //       const { latitude, longitude } = selectedSystem;
    //       map.flyTo([latitude, longitude], 10);
    //     },
    //     [map]
    //   );

    //   return (
    //     <div>
    //       {loading && <div>Loading...</div>}
    //       {!loading &&
    //         visibleMarkers.map(
    //           ({
    //             id,
    //             name,
    //             latitude,
    //             longitude,
    //             starType,
    //             wiki,
    //             isCanon,
    //             isLegends,
    //             hasError,
    //             alignRight,
    //           }) => {
    //             return (
    //               <React.Suspense key={id} fallback={<div>Loading...</div>}>
    //                 <Star
    //                   position={[latitude, longitude]}
    //                   name={name}
    //                   wiki={wiki}
    //                   isCanon={isCanon}
    //                   isLegends={isLegends}
    //                   hasError={hasError}
    //                   alignRight={alignRight}
    //                   starType={starType} // Pass the starType property
    //                 />
    //               </React.Suspense>
    //             );
    //           }
    //         )}

    //       <SearchBarUI systems={starSystems} onSystemSelect={handleSystemSelect} />

    //       <Filter
    //         activeFilters={activeFilters}
    //         onFilterChange={handleFilterChange}
    //       />

    //       <MemoAreaPlots />

    //       <MemoTerritoryPlots />

    //       <MemoNebulaPlots />

    //       <MemoLanePlots />
    //     </div>
    //   );
    // }

    // Filter by bounding box in the client (optional):
    // only keep systems in view
    const inView = allSystems.filter(({ latitude, longitude }) =>
      bounds.contains([latitude, longitude])
    );

    // Also apply the user’s canon/legends filters
    const filtered = inView.filter(({ isCanon, isLegends, isShared }) => {
      const isCanonVisible = activeFilters.includes("canon");
      const isLegendsVisible = activeFilters.includes("legends");
      const isSharedVisible = activeFilters.includes("shared");

      return (
        (isCanon && isCanonVisible && !isShared) ||
        (isLegends && isLegendsVisible && !isShared) ||
        (isShared && isSharedVisible)
      );
    });

    setVisibleMarkers(filtered);
  }, [map, allSystems, activeFilters]);

  // 3. Re-run `updateVisibleMarkers` when the user moves/zooms or changes filters
  useEffect(() => {
    let timer;
    if (map) {
      const handleMapChange = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          updateVisibleMarkers();
        }, 0);
      };
      map.on("zoomend", handleMapChange);
      map.on("moveend", handleMapChange);

      // Initial compute after we have the data
      if (!loading) {
        updateVisibleMarkers();
      }

      return () => {
        map.off("zoomend", handleMapChange);
        map.off("moveend", handleMapChange);
      };
    }
  }, [map, loading, updateVisibleMarkers]);

  const handleSystemSelect = useCallback(
    (selectedSystem) => {
      // E.g., fly to the system’s lat/lng
      const { latitude, longitude } = selectedSystem;
      map.flyTo([latitude, longitude], 10);
    },
    [map]
  );

  // Also recalc if filters change
  useEffect(() => {
    updateVisibleMarkers();
  }, [activeFilters, updateVisibleMarkers]);

  function handleFilterChange(filter) {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  }

  return (
    <div>
      {loading && <div>Loading...</div>}

      {!loading &&
        visibleMarkers.map((sys) => {
          const {
            id,
            latitude,
            longitude,
            name,
            wiki,
            isCanon,
            isLegends,
            starType,
          } = sys;
          return (
            <React.Suspense fallback={<div>Loading...</div>} key={id}>
              <Star
                position={[latitude, longitude]}
                name={name}
                wiki={wiki}
                isCanon={isCanon}
                isLegends={isLegends}
                starType={starType}
              />
            </React.Suspense>
          );
        })}

      <SearchBarUI systems={allSystems} onSystemSelect={handleSystemSelect} />

      <Filter
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />

      {/* Memoized static layers */}
      <MemoAreaPlots />
      <MemoTerritoryPlots />
      <MemoNebulaPlots />
      <MemoLanePlots />
    </div>
  );
}
