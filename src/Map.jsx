import React, { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

import { baseStyle } from "./lib/mapStyle.js";
import {
  transformCenter,
  transformCoord,
  inverseTransform,
  toMapLibreZoom,
  toLeafletZoom,
  MIN_ZOOM,
  MAX_ZOOM,
} from "./lib/coordTransform.js";
import { buildAllSources } from "./lib/buildSources.js";
import { SystemProvider } from "./components/functions/SystemProvider.jsx";
import CustomCursor from "./components/cursor/cursor.jsx";

import canonPng from "./assets/marker-canon2.png";
import sharedPng from "./assets/marker-shared2.png";
import legendsPng from "./assets/marker-legends2.png";
import errorPng from "./assets/marker-error2.png";

import SearchBar from "./components/functions/SearchBar.jsx";
import { fetchSystems } from "./components/functions/fetch.jsx";
import { useSystemContext } from "./components/functions/useSystemContext.jsx";

// MapLibre context — provides map instance to child components
export const MapContext = React.createContext(null);

// ── Constants ──────────────────────────────────────────────────────────
const DEFAULT_CENTER = [-128, 128];
const DEFAULT_ZOOM = 5;

function MapPage() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Restore saved position
  const savedCenter = useRef(() => {
    const c = localStorage.getItem("mapCenter");
    return c ? JSON.parse(c) : DEFAULT_CENTER;
  });
  const savedZoom = useRef(() => {
    const z = localStorage.getItem("zoomLevel");
    return z ? parseInt(z) : DEFAULT_ZOOM;
  });

  // Clear cached systems on mount
  useEffect(() => {
    localStorage.removeItem("cachedSystems");
  }, []);

  // ── Initialize map ───────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current) return;

    const center = typeof savedCenter.current === "function"
      ? savedCenter.current() : savedCenter.current;
    const zoom = typeof savedZoom.current === "function"
      ? savedZoom.current() : savedZoom.current;

    const { lng, lat } = transformCenter(center);

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: baseStyle,
      center: [lng, lat],
      zoom: toMapLibreZoom(zoom),
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      doubleClickZoom: false,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });

    // Disable rotation
    map.keyboard.disableRotation();
    map.touchZoomRotate.disableRotation();

    mapRef.current = map;

    map.on("load", async () => {
      await addAllLayers(map);
      setMapReady(true);
    });

    // Save position to localStorage on move/zoom
    map.on("moveend", () => {
      const c = map.getCenter();
      const original = inverseTransform([c.lng, c.lat]);
      localStorage.setItem("mapCenter", JSON.stringify(original));
      const leafletZoom = toLeafletZoom(map.getZoom());
      localStorage.setItem("zoomLevel", leafletZoom.toString());
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="App">
      <div className="map-container">
        <div ref={mapContainer} className="maplibre-container" />
        {mapReady && (
          <SystemProvider>
            <MapContext.Provider value={mapRef.current}>
              <MapOverlays map={mapRef.current} />
            </MapContext.Provider>
          </SystemProvider>
        )}
        <CustomCursor />
      </div>
    </div>
  );
}

// ── Overlays (React components over the map) ───────────────────────────

function MapOverlays({ map }) {
  const { newSystemAdded, handleAddSystem } = useSystemContext();
  const [allSystems, setAllSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(["legends", "canon", "shared"]);
  const [activePopup, setActivePopup] = useState(null);
  const popupRef = useRef(null);

  // Fetch systems
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

  useEffect(() => {
    if (newSystemAdded) {
      fetchAllData();
      handleAddSystem();
    }
  }, [newSystemAdded, fetchAllData, handleAddSystem]);

  // ── Add systems to map once loaded ────────────────────────────────────
  useEffect(() => {
    if (!allSystems.length || loading) return;

    // Build systems GeoJSON
    const systemFeatures = allSystems.map((s, idx) => ({
      type: "Feature",
      id: idx,
      properties: {
        id: s.id,
        name: s.name,
        starType: s.starType || "MicroStar",
        isCanon: s.isCanon,
        isLegends: s.isLegends,
        isShared: s.isCanon && s.isLegends,
        hasError: s.hasError,
        wiki: s.wiki || "",
        alignRight: s.alignRight || false,
        canonType: s.isCanon && s.isLegends ? "shared"
          : s.isCanon ? "canon"
          : s.isLegends ? "legends"
          : "error",
      },
      geometry: {
        type: "Point",
        coordinates: transformCoord([s.latitude, s.longitude]),
      },
    }));

    const systemsGeoJSON = { type: "FeatureCollection", features: systemFeatures };

    if (map.getSource("systems")) {
      map.getSource("systems").setData(systemsGeoJSON);
    } else {
      map.addSource("systems", { type: "geojson", data: systemsGeoJSON });
      addSystemLayers(map);
    }

    updateSystemFilters(map, activeFilters);
  }, [allSystems, loading, map]);

  // ── Update filters ────────────────────────────────────────────────────
  useEffect(() => {
    if (!map.getSource("systems")) return;
    updateSystemFilters(map, activeFilters);
  }, [activeFilters, map]);

  // ── Marker images ─────────────────────────────────────────────────────
  useEffect(() => {
    loadMarkerImages(map);
  }, [map]);

  // ── Interactions ──────────────────────────────────────────────────────
  useEffect(() => {
    const layers = ["systems-markers"];

    const onMouseEnter = (e) => {
      map.getCanvas().style.cursor = "none";
      if (e.features.length) {
        const feat = e.features[0];
        map.setFeatureState(
          { source: "systems", id: feat.id },
          { hover: true }
        );

        // Show hover enlarged icon + label
        const hoverId = feat.id;
        if (map.getLayer("systems-markers-hover")) {
          map.setFilter("systems-markers-hover", ["==", ["id"], hoverId]);
        }
        if (map.getLayer("systems-labels-hover")) {
          map.setFilter("systems-labels-hover", ["==", ["id"], hoverId]);
        }
      }
    };

    const onMouseLeave = () => {
      // Clear all hover states
      const source = map.getSource("systems");
      if (source) {
        allSystems.forEach((_, idx) => {
          map.setFeatureState({ source: "systems", id: idx }, { hover: false });
        });
      }

      // Hide hover layers
      if (map.getLayer("systems-markers-hover")) {
        map.setFilter("systems-markers-hover", ["==", ["id"], -1]);
      }
      if (map.getLayer("systems-labels-hover")) {
        map.setFilter("systems-labels-hover", ["==", ["id"], -1]);
      }
    };

    const onClick = (e) => {
      if (!e.features.length) return;
      const props = e.features[0].properties;

      // Close existing popup
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }

      const popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: true,
        offset: [0, -10],
        className: "system-popup",
      })
        .setLngLat(e.lngLat)
        .setHTML(
          `<a href="${props.wiki}" target="_blank" style="color: #0645AD; text-decoration: underline; font-family: 'Myriad Pro', sans-serif; font-weight: bold; font-size: 18px;">${props.name} Wiki Page</a>`
        )
        .addTo(map);

      popupRef.current = popup;
    };

    for (const layer of layers) {
      if (map.getLayer(layer)) {
        map.on("mouseenter", layer, onMouseEnter);
        map.on("mouseleave", layer, onMouseLeave);
        map.on("click", layer, onClick);
      }
    }

    return () => {
      for (const layer of layers) {
        if (map.getLayer(layer)) {
          map.off("mouseenter", layer, onMouseEnter);
          map.off("mouseleave", layer, onMouseLeave);
          map.off("click", layer, onClick);
        }
      }
    };
  }, [map, allSystems]);

  // ── Handle filter changes ─────────────────────────────────────────────
  const handleFilterChange = useCallback((filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  }, []);

  // ── Fly to system ─────────────────────────────────────────────────────
  const handleSystemSelect = useCallback(
    (system) => {
      const [lng, lat] = transformCoord([system.latitude, system.longitude]);
      map.easeTo({
        center: [lng, lat],
        zoom: toMapLibreZoom(6),
        duration: 2500,
        easing: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
      });
    },
    [map]
  );

  return (
    <>
      {/* Search bar — top right */}
      <div className="search-container overlay-topright">
        <SearchBar systems={allSystems} onSystemSelect={handleSystemSelect} />
      </div>

      {/* Filter — bottom left */}
      <div className="filter-container overlay-bottomleft">
        <div className="filter-title">Filters</div>
        <label className="filter-item">
          <input
            type="checkbox"
            checked={activeFilters.includes("canon")}
            onChange={() => handleFilterChange("canon")}
          />
          {" Canon"}
        </label>
        <label className="filter-item">
          <input
            type="checkbox"
            checked={activeFilters.includes("legends")}
            onChange={() => handleFilterChange("legends")}
          />
          {" Legends"}
        </label>
      </div>

      {/* Patreon — bottom left */}
      <div className="patreon-container overlay-bottomleft-lower">
        <div className="patreon-item">
          <a href="https://www.patreon.com/FantasyCartography">Patreon</a>
          <span> | </span>
          <a href="https://ko-fi.com/fantasycartographer">Ko-Fi</a>
        </div>
      </div>

      {/* Key/legend — bottom right */}
      <div className="key-container overlay-bottomright">
        <div className="key-item">
          <img src={canonPng} alt="Canon" />
          <span>Canon Only</span>
        </div>
        <div className="key-item">
          <img src={sharedPng} alt="Shared" />
          <span>Shared</span>
        </div>
        <div className="key-item">
          <img src={legendsPng} alt="Legends" />
          <span>Legends Only</span>
        </div>
      </div>
    </>
  );
}

// ── Add static layers (regions, grid, lanes, nebulae, labels) ──────────

async function addAllLayers(map) {
  const data = await buildAllSources();

  // ── Region fill layers (ordered bottom to top) ────────────────────────
  map.addSource("regions", { type: "geojson", data: data.regions });

  // Individual fill layers per region so we can set unique colors
  const regionOrder = ["outerRim", "midRim", "expansionRegion", "innerRim", "colonies", "coreWorlds", "deepCore"];
  const regionColors = {
    outerRim: "#2D3E6E",
    midRim: "#264476",
    expansionRegion: "#25538A",
    innerRim: "#1B609F",
    colonies: "#006CB5",
    coreWorlds: "#0073BB",
    deepCore: "#0079C0",
  };

  map.addLayer({
    id: "regions-fill",
    type: "fill",
    source: "regions",
    paint: {
      "fill-color": ["match", ["get", "name"],
        ...regionOrder.flatMap((n) => [n, regionColors[n]]),
        "#26244a",
      ],
      "fill-opacity": 1,
    },
  });

  // Regions outline — split into 3 zoom ranges for different dash patterns
  const regionsOutlineWidth = [
    "interpolate", ["linear"], ["zoom"],
    MIN_ZOOM, 1,
    MIN_ZOOM + 2, 2,
    MIN_ZOOM + 3, 3,
    MIN_ZOOM + 4, 4,
    MAX_ZOOM, 6,
  ];
  map.addLayer({
    id: "regions-outline-lo",
    type: "line",
    source: "regions",
    minzoom: MIN_ZOOM,
    maxzoom: 6.5,
    paint: {
      "line-color": "#202933",
      "line-width": regionsOutlineWidth,
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 5.5, 1, 6.5, 0],
      "line-dasharray": [20, 20],
    },
    layout: { "line-cap": "square" },
  });
  map.addLayer({
    id: "regions-outline-mid",
    type: "line",
    source: "regions",
    minzoom: 5.5,
    maxzoom: 9,
    paint: {
      "line-color": "#202933",
      "line-width": regionsOutlineWidth,
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 5.5, 0, 6.5, 1, 8, 1, 9, 0],
      "line-dasharray": [12, 12],
    },
    layout: { "line-cap": "square" },
  });
  map.addLayer({
    id: "regions-outline-hi",
    type: "line",
    source: "regions",
    minzoom: 8,
    paint: {
      "line-color": "#202933",
      "line-width": regionsOutlineWidth,
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0, 9, 1],
      "line-dasharray": [8, 8],
    },
    layout: { "line-cap": "square" },
  });

  // ── Territory fill ────────────────────────────────────────────────────
  map.addSource("territories", { type: "geojson", data: data.territories });
  map.addLayer({
    id: "territories-fill",
    type: "fill",
    source: "territories",
    paint: {
      "fill-color": ["get", "color"],
      "fill-opacity": 0.8,
    },
  });
  // Territories outline — split into 3 zoom ranges for different dash patterns
  const territoriesOutlineWidth = [
    "interpolate", ["linear"], ["zoom"],
    MIN_ZOOM, 1,
    MIN_ZOOM + 2, 2,
    MIN_ZOOM + 3, 3,
    MAX_ZOOM, 6,
  ];
  const terrBasePaint = {
    "line-color": ["get", "line"],
    "line-width": territoriesOutlineWidth,
    "line-opacity": ["get", "lineOpacity"],
  };
  map.addLayer({
    id: "territories-outline-lo",
    type: "line",
    source: "territories",
    minzoom: MIN_ZOOM,
    maxzoom: 6.5,
    paint: { ...terrBasePaint, "line-dasharray": [20, 20] },
    layout: { "line-cap": "square" },
  });
  map.addLayer({
    id: "territories-outline-mid",
    type: "line",
    source: "territories",
    minzoom: 6.5,
    maxzoom: 8.5,
    paint: { ...terrBasePaint, "line-dasharray": [12, 12] },
    layout: { "line-cap": "square" },
  });
  map.addLayer({
    id: "territories-outline-hi",
    type: "line",
    source: "territories",
    minzoom: 8.5,
    paint: { ...terrBasePaint, "line-dasharray": [8, 8] },
    layout: { "line-cap": "square" },
  });

  // ── Nebula fill ───────────────────────────────────────────────────────
  map.addSource("nebulae", { type: "geojson", data: data.nebulae });
  map.addLayer({
    id: "nebulae-fill",
    type: "fill",
    source: "nebulae",
    paint: {
      "fill-color": "#A080A2",
      "fill-opacity": 0.8,
    },
  });
  // Nebulae outline — split into 3 zoom ranges for different dash patterns
  const nebulaeOutlineWidth = [
    "interpolate", ["linear"], ["zoom"],
    MIN_ZOOM, 1,
    MIN_ZOOM + 2, 2,
    MIN_ZOOM + 3, 3,
    MAX_ZOOM, 6,
  ];
  map.addLayer({
    id: "nebulae-outline-lo",
    type: "line",
    source: "nebulae",
    minzoom: MIN_ZOOM,
    maxzoom: 6.5,
    paint: {
      "line-color": "#202933",
      "line-width": nebulaeOutlineWidth,
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 5.5, 0.95, 6.5, 0],
      "line-dasharray": [20, 20],
    },
    layout: { "line-cap": "square" },
  });
  map.addLayer({
    id: "nebulae-outline-mid",
    type: "line",
    source: "nebulae",
    minzoom: 5.5,
    maxzoom: 9,
    paint: {
      "line-color": "#202933",
      "line-width": nebulaeOutlineWidth,
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 5.5, 0, 6.5, 0.95, 8, 0.95, 9, 0],
      "line-dasharray": [12, 12],
    },
    layout: { "line-cap": "square" },
  });
  map.addLayer({
    id: "nebulae-outline-hi",
    type: "line",
    source: "nebulae",
    minzoom: 8,
    paint: {
      "line-color": "#202933",
      "line-width": nebulaeOutlineWidth,
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0, 9, 0.95],
      "line-dasharray": [8, 8],
    },
    layout: { "line-cap": "square" },
  });

  // ── Grid ──────────────────────────────────────────────────────────────
  map.addSource("grid-lines", { type: "geojson", data: data.grid.lines });
  map.addLayer({
    id: "grid-lines",
    type: "line",
    source: "grid-lines",
    paint: {
      "line-color": "#ffffff",
      "line-opacity": 0.01,
      "line-width": [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM, 1,
        MIN_ZOOM + 3, 3,
        MIN_ZOOM + 4, 5,
        MAX_ZOOM, 10,
      ],
    },
  });

  map.addSource("grid-labels", { type: "geojson", data: data.grid.labels });
  map.addLayer({
    id: "grid-labels",
    type: "symbol",
    source: "grid-labels",
    layout: {
      "text-field": ["get", "label"],
      "text-font": ["Open Sans Regular"],
      "text-size": [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM, 10,
        MIN_ZOOM + 1, 12,
        MIN_ZOOM + 2, 14,
        MIN_ZOOM + 3, 16,
        MIN_ZOOM + 4, 18,
        MIN_ZOOM + 5, 30,
        MAX_ZOOM, 45,
      ],
      "text-anchor": "top-left",
      "text-allow-overlap": true,
      "text-ignore-placement": true,
    },
    paint: {
      "text-color": "#ffffff",
      "text-opacity": 0.1,
    },
  });

  // ── Trade lanes ───────────────────────────────────────────────────────
  addTradeLaneLayers(map, data.lanes);

  // ── Route labels (symbol layer) ───────────────────────────────────────
  map.addSource("route-labels", { type: "geojson", data: data.labels.routeLabels });
  map.addLayer({
    id: "route-labels",
    type: "symbol",
    source: "route-labels",
    minzoom: MIN_ZOOM + 2, // leaflet zoom >= 4
    layout: {
      "text-field": ["get", "text"],
      "text-font": ["Open Sans Regular"],
      "text-size": [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM + 2, ["match", ["get", "style"],
          "major", 12,
          0,
        ],
        MIN_ZOOM + 3, ["match", ["get", "style"],
          "major", 20,
          "mid", 10,
          10,
        ],
        MIN_ZOOM + 4, ["match", ["get", "style"],
          "major", 30,
          "mid", 15,
          15,
        ],
        MIN_ZOOM + 5, ["match", ["get", "style"],
          "major", 50,
          "mid", 20,
          20,
        ],
        MIN_ZOOM + 6, ["match", ["get", "style"],
          "major", 120,
          "mid", 40,
          40,
        ],
      ],
      "text-rotate": ["get", "rotation"],
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-letter-spacing": ["match", ["get", "style"],
        "major", 0.15,
        0.1,
      ],
    },
    paint: {
      "text-color": ["get", "color"],
      "text-opacity": [
        "match", ["get", "style"],
        "major", 0.5,
        "mid", 0.5,
        0.5,
      ],
    },
  });

  // ── Nebula labels ─────────────────────────────────────────────────────
  map.addSource("nebula-labels", { type: "geojson", data: data.labels.nebulaLabels });
  map.addLayer({
    id: "nebula-labels",
    type: "symbol",
    source: "nebula-labels",
    minzoom: MIN_ZOOM + 4, // leaflet zoom >= 6
    layout: {
      "text-field": ["get", "text"],
      "text-font": ["Open Sans Regular"],
      "text-size": [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM + 4, 15,
        MIN_ZOOM + 5, 20,
        MAX_ZOOM, 40,
      ],
      "text-rotate": ["get", "rotation"],
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-letter-spacing": 0.1,
    },
    paint: {
      "text-color": "#A080A2",
      "text-opacity": 1,
    },
  });

  // ── Zone titles (HTML markers) ────────────────────────────────────────
  const titleElements = [];
  for (const title of data.zoneTitles) {
    const [lng, lat] = transformCoord(title.coords);
    const el = document.createElement("div");
    el.className = "zone-title-marker";
    el.innerHTML = title.text.split("\n").map((l) => `<span>${l}</span>`).join("<br>");
    new maplibregl.Marker({ element: el, anchor: "center" })
      .setLngLat([lng, lat])
      .addTo(map);
    titleElements.push(el);
  }

  // Smooth zoom-dependent font sizing for zone titles
  // Linearly interpolates between breakpoints for continuous zooming
  const titleStops = [
    // [maplibreZoom, fontSize, lineHeight]
    [MIN_ZOOM,     20, 15],
    [MIN_ZOOM + 1, 20, 15],
    [MIN_ZOOM + 2, 25, 20],
    [MIN_ZOOM + 3, 40, 30],
    [MIN_ZOOM + 4, 70, 55],
    [MIN_ZOOM + 5, 120, 90],
    [MAX_ZOOM,     120, 90],
  ];
  function updateZoneTitleSizes() {
    const z = map.getZoom();
    let fontSize, lineHeight;
    if (z <= titleStops[0][0]) {
      fontSize = titleStops[0][1]; lineHeight = titleStops[0][2];
    } else if (z >= titleStops[titleStops.length - 1][0]) {
      fontSize = titleStops[titleStops.length - 1][1];
      lineHeight = titleStops[titleStops.length - 1][2];
    } else {
      for (let i = 0; i < titleStops.length - 1; i++) {
        if (z >= titleStops[i][0] && z < titleStops[i + 1][0]) {
          const t = (z - titleStops[i][0]) / (titleStops[i + 1][0] - titleStops[i][0]);
          fontSize = titleStops[i][1] + t * (titleStops[i + 1][1] - titleStops[i][1]);
          lineHeight = titleStops[i][2] + t * (titleStops[i + 1][2] - titleStops[i][2]);
          break;
        }
      }
    }
    for (const el of titleElements) {
      el.style.fontSize = fontSize + "px";
      el.style.lineHeight = lineHeight + "px";
    }
  }
  updateZoneTitleSizes();
  map.on("zoom", updateZoneTitleSizes);
}

// ── Trade lane layers (one per style level) ─────────────────────────────

function addTradeLaneLayers(map, lanes) {
  const defs = [
    {
      id: "lanes-major", data: lanes.major,
      width: [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM, 4, MIN_ZOOM + 2, 5, MIN_ZOOM + 3, 7,
        MIN_ZOOM + 4, 10, MIN_ZOOM + 5, 15, MAX_ZOOM, 20,
      ],
      opacity: 0.4, color: "white",
    },
    {
      id: "lanes-mid", data: lanes.mid,
      width: [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM, 0.6, MIN_ZOOM + 2, 3, MIN_ZOOM + 3, 4,
        MIN_ZOOM + 4, 6, MIN_ZOOM + 5, 10, MAX_ZOOM, 8,
      ],
      opacity: 0.4, color: "white",
    },
    {
      id: "lanes-minor", data: lanes.minor,
      width: [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM, 0.2, MIN_ZOOM + 2, 1, MIN_ZOOM + 3, 2,
        MIN_ZOOM + 4, 3, MIN_ZOOM + 5, 5, MAX_ZOOM, 8,
      ],
      opacity: 0.4, color: "white",
    },
    // lanes-dash handled separately below (split into 3 zoom-ranged layers)
    {
      id: "lanes-micro", data: lanes.micro,
      minzoom: MIN_ZOOM + 3, // leaflet zoom >= 5
      width: [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM + 3, 1, MIN_ZOOM + 4, 1.5,
        MIN_ZOOM + 5, 3, MIN_ZOOM + 6, 4, MAX_ZOOM, 5,
      ],
      opacity: 0.4, color: "white",
    },
  ];

  for (const def of defs) {
    const sourceId = def.id;
    map.addSource(sourceId, { type: "geojson", data: def.data });
    map.addLayer({
      id: def.id,
      type: "line",
      source: sourceId,
      ...(def.minzoom ? { minzoom: def.minzoom } : {}),
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": def.color,
        "line-width": def.width,
        "line-opacity": def.opacity,
        ...(def.dasharray ? { "line-dasharray": def.dasharray } : {}),
      },
    });
  }

  // ── Dashed trade lanes — split into 3 zoom-ranged layers with crossfade ──
  map.addSource("lanes-dash", { type: "geojson", data: lanes.dash });
  const dashLayout = { "line-cap": "round", "line-join": "round" };
  map.addLayer({
    id: "lanes-dash-lo",
    type: "line",
    source: "lanes-dash",
    maxzoom: 7.5,
    layout: dashLayout,
    paint: {
      "line-color": "#c75d16",
      "line-width": [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM, 0.2, MIN_ZOOM + 3, 2,
      ],
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 6.5, 1, 7.5, 0],
      "line-dasharray": [2, 6],
    },
  });
  map.addLayer({
    id: "lanes-dash-mid",
    type: "line",
    source: "lanes-dash",
    minzoom: 6.5,
    maxzoom: 9.5,
    layout: dashLayout,
    paint: {
      "line-color": "#c75d16",
      "line-width": [
        "interpolate", ["linear"], ["zoom"],
        7, 2, 9, 5,
      ],
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 6.5, 0, 7.5, 1, 8.5, 1, 9.5, 0],
      "line-dasharray": [1.2, 3],
    },
  });
  map.addLayer({
    id: "lanes-dash-hi",
    type: "line",
    source: "lanes-dash",
    minzoom: 8.5,
    layout: dashLayout,
    paint: {
      "line-color": "#c75d16",
      "line-width": [
        "interpolate", ["linear"], ["zoom"],
        9, 5, MAX_ZOOM, 8,
      ],
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 8.5, 0, 9.5, 1],
      "line-dasharray": [0.9, 3.5],
    },
  });
}

// ── System marker layers ────────────────────────────────────────────────

async function loadMarkerImages(map) {
  const images = [
    { id: "marker-canon", url: canonPng },
    { id: "marker-shared", url: sharedPng },
    { id: "marker-legends", url: legendsPng },
    { id: "marker-error", url: errorPng },
  ];

  for (const { id, url } of images) {
    if (map.hasImage(id)) continue;
    const img = new Image();
    img.src = url;
    await new Promise((resolve) => {
      img.onload = () => {
        if (!map.hasImage(id)) {
          map.addImage(id, img, { sdf: false });
        }
        resolve();
      };
      img.onerror = resolve;
    });
  }
}

function addSystemLayers(map) {
  // Marker icons
  map.addLayer({
    id: "systems-markers",
    type: "symbol",
    source: "systems",
    layout: {
      "icon-image": [
        "match", ["get", "canonType"],
        "shared", "marker-shared",
        "canon", "marker-canon",
        "legends", "marker-legends",
        "marker-error",
      ],
      "icon-size": [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM, ["match", ["get", "starType"],
          "MajorStar", 0.3,
          "MinorStar", 0.14,
          "MicroStar", 0,
          0.3,
        ],
        MIN_ZOOM + 1, ["match", ["get", "starType"],
          "MajorStar", 0.4,
          "MinorStar", 0.2,
          "MicroStar", 0,
          0.4,
        ],
        MIN_ZOOM + 2, ["match", ["get", "starType"],
          "MajorStar", 0.5,
          "MinorStar", 0.3,
          "MicroStar", 0.14,
          0.5,
        ],
        MIN_ZOOM + 3, ["match", ["get", "starType"],
          "MajorStar", 0.6,
          "MinorStar", 0.4,
          "MicroStar", 0.2,
          0.6,
        ],
        MIN_ZOOM + 4, ["match", ["get", "starType"],
          "MajorStar", 0.6,
          "MinorStar", 0.5,
          "MicroStar", 0.24,
          0.6,
        ],
        MIN_ZOOM + 5, ["match", ["get", "starType"],
          "MajorStar", 0.8,
          "MinorStar", 0.6,
          "MicroStar", 0.28,
          0.8,
        ],
        MIN_ZOOM + 6, ["match", ["get", "starType"],
          "MajorStar", 0.9,
          "MinorStar", 0.7,
          "MicroStar", 0.44,
          0.9,
        ],
        MAX_ZOOM, ["match", ["get", "starType"],
          "MajorStar", 1.0,
          "MinorStar", 0.9,
          "MicroStar", 0.84,
          1.0,
        ],
      ],
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
      "symbol-sort-key": [
        "match", ["get", "starType"],
        "MajorStar", 0,
        "MinorStar", 1,
        "MicroStar", 2,
        3,
      ],
    },
    paint: {
      "icon-opacity": 1,
    },
  });

  // Hover highlight — larger icon for hovered system
  map.addLayer({
    id: "systems-markers-hover",
    type: "symbol",
    source: "systems",
    filter: ["==", ["id"], -1], // show nothing initially
    layout: {
      "icon-image": [
        "match", ["get", "canonType"],
        "shared", "marker-shared",
        "canon", "marker-canon",
        "legends", "marker-legends",
        "marker-error",
      ],
      "icon-size": [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM, 0.5,
        MIN_ZOOM + 3, 0.7,
        MIN_ZOOM + 5, 1.0,
        MAX_ZOOM, 1.3,
      ],
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
    paint: {
      "icon-opacity": 1,
    },
  });

  // System name labels
  map.addLayer({
    id: "systems-labels",
    type: "symbol",
    source: "systems",
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Bold"],
      "text-size": [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM, ["match", ["get", "starType"],
          "MajorStar", 0,
          0,
        ],
        MIN_ZOOM + 1, ["match", ["get", "starType"],
          "MajorStar", 15,
          0,
        ],
        MIN_ZOOM + 2, ["match", ["get", "starType"],
          "MajorStar", 25,
          0,
        ],
        MIN_ZOOM + 3, ["match", ["get", "starType"],
          "MajorStar", 30,
          "MinorStar", 18,
          0,
        ],
        MIN_ZOOM + 4, ["match", ["get", "starType"],
          "MajorStar", 35,
          "MinorStar", 25,
          0,
        ],
        MIN_ZOOM + 5, ["match", ["get", "starType"],
          "MajorStar", 40,
          "MinorStar", 35,
          "MicroStar", 18,
          40,
        ],
        MIN_ZOOM + 6, ["match", ["get", "starType"],
          "MajorStar", 50,
          "MinorStar", 40,
          "MicroStar", 20,
          50,
        ],
        MAX_ZOOM, ["match", ["get", "starType"],
          "MajorStar", 55,
          "MinorStar", 55,
          "MicroStar", 28,
          55,
        ],
      ],
      "text-anchor": [
        "case",
        ["get", "alignRight"], "right",
        "left",
      ],
      "text-offset": [
        "case",
        ["get", "alignRight"],
        ["literal", [-0.8, 0]],
        ["literal", [0.8, 0]],
      ],
      "text-allow-overlap": true,
      "text-ignore-placement": true,
    },
    paint: {
      "text-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false], 0,
        1,
      ],
      "text-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false], 0,
        1,
      ],
      "text-color": [
        "match", ["get", "canonType"],
        "shared", "#e09f58",
        "canon", "#e087cf",
        "legends", "#00a8f2",
        "red",
      ],
      "text-halo-color": "black",
      "text-halo-width": [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM, ["match", ["get", "starType"],
          "MajorStar", 0.8,
          "MinorStar", 0.6,
          "MicroStar", 0.8,
          0.5,
        ],
        MIN_ZOOM + 3, ["match", ["get", "starType"],
          "MajorStar", 0.8,
          "MinorStar", 0.6,
          "MicroStar", 0.8,
          0.5,
        ],
        MIN_ZOOM + 4, ["match", ["get", "starType"],
          "MajorStar", 1.0,
          "MinorStar", 0.8,
          "MicroStar", 0.8,
          0.8,
        ],
        MIN_ZOOM + 5, ["match", ["get", "starType"],
          "MajorStar", 1.2,
          "MinorStar", 1.0,
          "MicroStar", 0.8,
          1.0,
        ],
        MIN_ZOOM + 6, ["match", ["get", "starType"],
          "MajorStar", 1.5,
          "MinorStar", 1.0,
          "MicroStar", 0.8,
          1.5,
        ],
        MAX_ZOOM, ["match", ["get", "starType"],
          "MajorStar", 1.0,
          "MinorStar", 1.0,
          "MicroStar", 0.8,
          1.0,
        ],
      ],
    },
  });

  // Hover label — larger text for hovered system
  map.addLayer({
    id: "systems-labels-hover",
    type: "symbol",
    source: "systems",
    filter: ["==", ["id"], -1], // show nothing initially
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Bold"],
      "text-size": [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM, 18,
        MIN_ZOOM + 3, 28,
        MIN_ZOOM + 5, 40,
        MAX_ZOOM, 55,
      ],
      "text-anchor": [
        "case",
        ["get", "alignRight"], "right",
        "left",
      ],
      "text-offset": [
        "case",
        ["get", "alignRight"],
        ["literal", [-0.8, 0]],
        ["literal", [0.8, 0]],
      ],
      "text-allow-overlap": true,
      "text-ignore-placement": true,
    },
    paint: {
      "text-color": [
        "match", ["get", "canonType"],
        "shared", "#e09f58",
        "canon", "#e087cf",
        "legends", "#00a8f2",
        "red",
      ],
      "text-halo-color": "black",
      "text-halo-width": [
        "interpolate", ["linear"], ["zoom"],
        MIN_ZOOM, ["match", ["get", "starType"],
          "MajorStar", 0.8,
          "MinorStar", 0.6,
          "MicroStar", 0.8,
          0.5,
        ],
        MIN_ZOOM + 3, ["match", ["get", "starType"],
          "MajorStar", 0.8,
          "MinorStar", 0.6,
          "MicroStar", 0.8,
          0.5,
        ],
        MIN_ZOOM + 4, ["match", ["get", "starType"],
          "MajorStar", 1.0,
          "MinorStar", 0.8,
          "MicroStar", 0.8,
          0.8,
        ],
        MIN_ZOOM + 5, ["match", ["get", "starType"],
          "MajorStar", 1.2,
          "MinorStar", 1.0,
          "MicroStar", 0.8,
          1.0,
        ],
        MIN_ZOOM + 6, ["match", ["get", "starType"],
          "MajorStar", 1.5,
          "MinorStar", 1.0,
          "MicroStar", 0.8,
          1.5,
        ],
        MAX_ZOOM, ["match", ["get", "starType"],
          "MajorStar", 1.0,
          "MinorStar", 1.0,
          "MicroStar", 0.8,
          1.0,
        ],
      ],
    },
  });
}

function updateSystemFilters(map, activeFilters) {
  const conditions = [];
  if (activeFilters.includes("shared")) conditions.push(["==", ["get", "canonType"], "shared"]);
  if (activeFilters.includes("canon")) conditions.push(["==", ["get", "canonType"], "canon"]);
  if (activeFilters.includes("legends")) conditions.push(["==", ["get", "canonType"], "legends"]);

  // Always show errors
  conditions.push(["==", ["get", "canonType"], "error"]);

  const filter = ["any", ...conditions];

  if (map.getLayer("systems-markers")) map.setFilter("systems-markers", filter);
  if (map.getLayer("systems-labels")) map.setFilter("systems-labels", filter);
}

export default MapPage;
