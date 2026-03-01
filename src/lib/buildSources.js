// Builds all GeoJSON sources for MapLibre from existing data files.
// Returns a promise resolving to { sources, featureCollections } keyed by source name.

import { transformPolygonRing, transformCoords, transformCoord } from "./coordTransform.js";
import { makeCircleRing } from "./circlePolygon.js";

// ── helpers ────────────────────────────────────────────────────────────

function polygonFeature(id, coords, properties = {}) {
  return {
    type: "Feature",
    id,
    properties: { id, ...properties },
    geometry: { type: "Polygon", coordinates: [transformPolygonRing(coords)] },
  };
}

function lineFeature(id, segments, properties = {}) {
  // segments is [[lat,lng],...] or [[[lat,lng],...], ...] (multi-segment)
  if (segments.length === 0) return null;
  const isMulti = Array.isArray(segments[0][0]);
  if (isMulti) {
    if (segments.length === 1) {
      return {
        type: "Feature",
        id,
        properties: { id, ...properties },
        geometry: { type: "LineString", coordinates: transformCoords(segments[0]) },
      };
    }
    return {
      type: "Feature",
      id,
      properties: { id, ...properties },
      geometry: {
        type: "MultiLineString",
        coordinates: segments.map((seg) => transformCoords(seg)),
      },
    };
  }
  // flat — single segment
  return {
    type: "Feature",
    id,
    properties: { id, ...properties },
    geometry: { type: "LineString", coordinates: transformCoords(segments) },
  };
}

function pointFeature(id, coord, properties = {}) {
  return {
    type: "Feature",
    id,
    properties: { id, ...properties },
    geometry: { type: "Point", coordinates: transformCoord(coord) },
  };
}

function fc(features) {
  return { type: "FeatureCollection", features: features.filter(Boolean) };
}

// ── dynamic import helpers ─────────────────────────────────────────────

// Separate import functions per directory so Vite can analyze the glob patterns.
// Each uses a single template variable — matches the pattern the existing code uses.
const EXPORT_OVERRIDES = { tapani1: "tapani" };

async function importPlot(name) {
  const mod = await import(`../components/shapes/plots/${name}.jsx`);
  const exportName = EXPORT_OVERRIDES[name] || name;
  return mod[exportName] || [];
}

async function importNebula(name) {
  const mod = await import(`../components/shapes/nebula/${name}.jsx`);
  return mod[name] || [];
}

async function importTradeline(name) {
  const mod = await import(`../components/shapes/tradelines/${name}.jsx`);
  const exportName = EXPORT_OVERRIDES[name] || name;
  return mod[exportName] || [];
}

// ── Region polygons ────────────────────────────────────────────────────

const REGION_DEFS = [
  { name: "outerRim",        color: "#2D3E6E", order: 0 },
  { name: "midRim",          color: "#264476", order: 1 },
  { name: "expansionRegion", color: "#25538A", order: 2 },
  { name: "innerRim",        color: "#1B609F", order: 3 },
];

const CIRCLE_DEFS = [
  { center: [-128.2, 128], radius: 31.6, color: "#006CB5", id: "colonies" },
  { center: [-128.2, 128], radius: 23.9, color: "#0073BB", id: "coreWorlds" },
  { center: [-128.2, 128], radius: 14.4, color: "#0079C0", id: "deepCore" },
];

async function buildRegionSources() {
  const features = [];
  for (const def of REGION_DEFS) {
    const data = await importPlot(def.name);
    if (data.length) {
      features.push(polygonFeature(def.name, data, {
        color: def.color,
        order: def.order,
        name: def.name,
      }));
    }
  }
  // Add circle polygons
  for (const def of CIRCLE_DEFS) {
    const ring = makeCircleRing(def.center, def.radius);
    features.push({
      type: "Feature",
      id: def.id,
      properties: { id: def.id, color: def.color, name: def.id },
      geometry: { type: "Polygon", coordinates: [ring] },
    });
  }
  return fc(features);
}

// ── Territory polygons ─────────────────────────────────────────────────

const TERRITORY_DEFS = [
  { name: "huttSpace", color: "#2C446C", line: "#FF7200", opacity: 0.8, lineOpacity: 1 },
];

const CHOSEN_TERRITORY_DEFS = [
  { name: "empire",    color: "#4a6a3a", line: "#4a6a3a" },
  { name: "cis",       color: "#6a4a4a", line: "#6a4a4a" },
  { name: "mandalore", color: "#3a4a6a", line: "#3a4a6a" },
  { name: "maul",      color: "#6a3a5a", line: "#6a3a5a" },
  { name: "tarkin",    color: "#5a5a3a", line: "#5a5a3a" },
  { name: "rebel1",    color: "#3a6a5a", line: "#3a6a5a" },
  { name: "rebel2",    color: "#3a6a5a", line: "#3a6a5a" },
  { name: "rebel3",    color: "#3a6a5a", line: "#3a6a5a" },
  { name: "rebel4",    color: "#3a6a5a", line: "#3a6a5a" },
  { name: "rebel5",    color: "#3a6a5a", line: "#3a6a5a" },
  { name: "rebel6",    color: "#3a6a5a", line: "#3a6a5a" },
  { name: "rebel7",    color: "#3a6a5a", line: "#3a6a5a" },
  { name: "rebel8",    color: "#3a6a5a", line: "#3a6a5a" },
];

async function buildTerritorySources() {
  const features = [];
  for (const def of [...TERRITORY_DEFS]) {
    const data = await importPlot(def.name);
    if (data.length) {
      features.push(polygonFeature(def.name, data, {
        color: def.color,
        line: def.line,
        opacity: def.opacity ?? 1,
        lineOpacity: def.lineOpacity ?? 1,
        name: def.name,
      }));
    }
  }
  return fc(features);
}

// ── Nebula polygons ────────────────────────────────────────────────────

const NEBULA_NAMES = [
  "monsua", "adinax", "kiax", "thull", "starforge", "crushank", "kur",
  "kaliida", "roloo", "danjon", "recluse", "forveen", "utegetu", "rata",
  "quelugan", "zavian", "llon", "vulpinus", "koornacht", "ringall",
  "osssorck", "byrnum", "ryyk", "almegest", "dragon", "transitory1",
  "transitory2", "dinarii", "thandon", "stygian", "archeon", "ota",
  "starcave", "maw", "inamorata", "typhonic", "oktos",
];

async function buildNebulaSources() {
  const features = [];
  for (const name of NEBULA_NAMES) {
    const data = await importNebula(name);
    if (data.length) {
      features.push(polygonFeature(name, data, {
        color: "#A080A2",
        name,
      }));
    }
  }
  return fc(features);
}

// ── Trade lanes ────────────────────────────────────────────────────────

// Registry mapping plot name -> style level
const LANE_REGISTRY = {
  // Major
  corellian: "major", corellianspine: "major", rimma: "major", hydian: "major",
  perlemian: "major", triellus: "major", dead: "major", bootana: "major",
  hoth: "major",
  // Mid
  cov: "mid", manda: "mid", kinyen: "mid", daalang: "mid", naboo: "mid",
  skynara: "mid", triton: "mid", starforge: "mid", senex: "mid", veron: "mid",
  endor: "mid", batuu: "mid", xala: "mid", daelgoth: "mid", agarix: "mid",
  lipsec: "mid", sanrafsix: "mid", nothoiin: "mid", veils: "mid",
  desevran: "mid", shaltin: "mid", overic: "mid", calanon: "mid",
  entralla: "mid", veragit: "mid", braxant: "mid", phalanx: "mid",
  kashyyyk: "mid", sleheyron: "mid", llanic: "mid", ootmian: "mid",
  estaria: "mid", arcan: "mid", gadon: "mid", kegan: "mid", cyborrea: "mid",
  quellorrun: "mid", zeltose: "mid", shag: "mid", hollastin: "mid",
  kaaga: "mid", wroona: "mid",
  // Minor
  byssRun: "minor", mandalorian: "minor", schesa: "minor", houses: "minor",
  Vaagari: "minor", cressus: "minor", chasdemonus: "minor", listehol: "minor",
  ilosian: "minor", koda: "minor", ast: "minor", zorbia: "minor",
  kuna: "minor", vex: "minor", tibrin: "minor", velga: "minor",
  kassido: "minor", junex: "minor", ryloth: "minor", siskeen: "minor",
  vasch: "minor", vasch2: "minor", pii: "minor", excarga: "minor",
  csilla: "minor", kira: "minor", goluud: "minor", metellost: "minor",
  widek: "minor", shipwrights: "minor", agri: "minor", Namadii: "minor",
  corkid: "minor", corwak: "minor", twihya: "minor", brencomm: "minor",
  fedcomm: "minor", trelcomm: "minor", byssabre: "minor", exonan: "minor",
  vaathkree: "minor", shwuyexchange: "minor", giju: "minor", tanhapes: "minor",
  hapesquell: "minor", coth: "minor", shili: "minor", luuq: "minor",
  dohu: "minor", roxuli: "minor", moro: "minor", ariarch: "minor",
  barka: "minor", traval: "minor", chelenor: "minor", ejolus: "minor",
  asamin: "minor", kidriff: "minor", hewett: "minor", garqi: "minor",
  parshoone: "minor", thoden: "minor", gravlex: "minor", dolis: "minor",
  muun: "minor", cezith: "minor", tangrene: "minor", axxila: "minor",
  tierell: "minor", indosa: "minor", vandyne: "minor", hynah: "minor",
  selitan: "minor", arkuda: "minor", denarii: "minor", junction: "minor",
  jovan: "minor", lucazec: "minor", troos: "minor", ninn: "minor",
  ekibo: "minor", mytus: "minor", kamar: "minor", orron: "minor",
  kir: "minor", media: "minor", deltooine: "minor", reltooine: "minor",
  lur: "minor", irudiru: "minor", moraband: "minor", jaguada: "minor",
  ashas: "minor", ree: "minor", korriz: "minor", yutusk: "minor",
  stenos: "minor", tothis: "minor", mossak: "minor", rudrig: "minor",
  pakuuni: "minor", belderone: "minor", pasmin: "minor", sy: "minor",
  balshebr: "minor", astigone: "minor", eridicon: "minor",
  poseidenna: "minor", starcave: "minor", sulorine: "minor",
  klatooine: "minor", hutta: "minor", randa: "minor", moralan: "minor",
  kessel: "minor", deysum: "minor", thearterra: "minor", burnin: "minor",
  kiax: "minor",
  // Dash
  itani: "dash", kesselrun: "dash", carbonite: "dash",
  // Micro (tapani, hapes, senex numbered)
  ...Object.fromEntries(
    Array.from({ length: 19 }, (_, i) => [`tapani${i + 1}`, "micro"])
  ),
  ...Object.fromEntries(
    Array.from({ length: 11 }, (_, i) => [`hapes${i + 1}`, "micro"])
  ),
  ...Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [`senex${i + 1}`, "micro"])
  ),
};

async function buildTradeLaneSources() {
  const byLevel = { major: [], mid: [], minor: [], dash: [], micro: [] };

  const entries = Object.entries(LANE_REGISTRY);
  // Load all tradelines concurrently
  const results = await Promise.all(
    entries.map(async ([name, level]) => {
      const data = await importTradeline(name);
      return { name, level, data };
    })
  );

  for (const { name, level, data } of results) {
    if (!data || data.length === 0) continue;
    const feature = lineFeature(name, data, { name, level });
    if (feature) byLevel[level].push(feature);
  }

  return {
    major: fc(byLevel.major),
    mid: fc(byLevel.mid),
    minor: fc(byLevel.minor),
    dash: fc(byLevel.dash),
    micro: fc(byLevel.micro),
  };
}

// ── Grid ───────────────────────────────────────────────────────────────

function buildGridSources() {
  const squareSize = 11.616;
  const desiredTopRightCorner = [-111.508, 128.0];
  const bottomLeft = [
    desiredTopRightCorner[0] - squareSize * 15,
    desiredTopRightCorner[1] - squareSize * 11,
  ];

  const lines = [];
  const labels = [];

  // Horizontal lines (26 + 1 = 27 lines)
  for (let i = 0; i <= 26; i++) {
    const lat = bottomLeft[0] + i * squareSize;
    const startCoord = [lat, bottomLeft[1]];
    const endCoord = [lat, bottomLeft[1] + 26 * squareSize];
    lines.push({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [transformCoord(startCoord), transformCoord(endCoord)],
      },
    });
  }

  // Vertical lines (26 + 1 = 27 lines)
  for (let j = 0; j <= 26; j++) {
    const lng = bottomLeft[1] + j * squareSize;
    const startCoord = [bottomLeft[0], lng];
    const endCoord = [bottomLeft[0] + 26 * squareSize, lng];
    lines.push({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [transformCoord(startCoord), transformCoord(endCoord)],
      },
    });
  }

  // Labels at bottom-left corner of each cell
  for (let i = 0; i < 26; i++) {
    for (let j = 0; j < 26; j++) {
      const lat = bottomLeft[0] + i * squareSize;
      const lng = bottomLeft[1] + j * squareSize;
      const label = `${String.fromCharCode(65 + j)}${25 - i}`;
      labels.push(pointFeature(`grid-${label}`, [lat, lng], { label }));
    }
  }

  return {
    lines: fc(lines),
    labels: fc(labels),
  };
}

// ── Label data (trade route names + nebula names + zone titles) ────────

// Extracted from LanePlots.jsx, NebulaPlots.jsx, AreaPlots.jsx

const ZONE_TITLES = [
  { coords: [-127.317, 124.133], text: "D E E P\nC O R E" },
  { coords: [-137.037, 112.380], text: "C O R E\nW O R L D S" },
  { coords: [-144.506, 105.972], text: "C O L O N I E S" },
  { coords: [-154.320, 101.033], text: "I N N E R\nR I M" },
  { coords: [-165.041, 96.688], text: "E X P A N S I O N\nR E G I O N" },
  { coords: [-177.793, 98.407], text: "M I D\nR I M" },
  { coords: [-211.813, 105.938], text: "O U T E R\nR I M" },
  { coords: [-141.694, 51.192], text: "U N K N O W N\nR E G I O N S" },
  { coords: [-133.193, 218.485], text: "H U T T\nS P A C E" },
];

const TRADE_ROUTE_LABELS = [
  // Major lane labels
  { coords: [-117.908, 141.156], text: "Corellian Run", rotation: 50, style: "major" },
  { coords: [-160.188, 166.563], text: "Corellian Run", rotation: 45, style: "major" },
  { coords: [-201.909, 209.333], text: "Corellian Run", rotation: 38, style: "major" },
  { coords: [-152.555, 141.487], text: "Corellian Trade Spine", rotation: -72, style: "major" },
  { coords: [-190.847, 120.642], text: "Corellian Trade Spine", rotation: -71, style: "major" },
  { coords: [-233.130, 117.785], text: "Corellian Trade Spine", rotation: -90, style: "major" },
  { coords: [-158.206, 130.938], text: "Rimma Trade Route", rotation: 50, style: "major" },
  { coords: [-183.971, 143.488], text: "Rimma Trade Route", rotation: 75, style: "major" },
  { coords: [-227.830, 146.473], text: "Rimma Trade Route", rotation: 90, style: "major" },
  { coords: [-39.641, 200.938], text: "Hydian Way", rotation: 0, style: "major" },
  { coords: [-83.689, 148.533], text: "Hydian Way", rotation: -30, style: "major" },
  { coords: [-116.692, 142.035], text: "Hydian Way", rotation: 46, style: "major" },
  { coords: [-176.442, 153.505], text: "Hydian Way", rotation: -82, style: "major" },
  { coords: [-223.660, 133.235], text: "Hydian Way", rotation: -52, style: "major" },
  { coords: [-120.469, 234.219], text: "Triellus Trade Route", rotation: 65, style: "major" },
  { coords: [-109.219, 218.688], text: "The Dead Road", rotation: 70, style: "major" },
  { coords: [-125.156, 225.156], text: "The Dead Road", rotation: 70, style: "major" },
  { coords: [-120.688, 218.609], text: "Bootana Hutta", rotation: 0, style: "major" },
  { coords: [-133.250, 212.563], text: "Pabol Hutta", rotation: -34, style: "major" },
  // Mid lane labels  (minStyle text size)
  { coords: [-109.032, 131.041], text: "Perlemian Trade Route", rotation: -31, style: "mid" },
  { coords: [-74.236, 206.457], text: "Perlemian Trade Route", rotation: -60, style: "mid" },
  { coords: [-194.984, 124.906], text: "D'aelgoth Trade Route", rotation: 40, style: "mid" },
  { coords: [-205.844, 124.750], text: "Agarix Trade Route", rotation: 10, style: "mid" },
  { coords: [-215.406, 109.922], text: "Lipsec Run", rotation: -15, style: "mid" },
  { coords: [-223.250, 158.281], text: "Sanrafsix Corridor", rotation: -97, style: "mid" },
  { coords: [-209.250, 124.984], text: "Nothoiin Corridor", rotation: 18, style: "mid" },
  { coords: [-206.172, 174.422], text: "Five Veils Route", rotation: -12, style: "mid" },
  { coords: [-68.570, 218.773], text: "Desevran Trace", rotation: 90, style: "mid" },
  { coords: [-50.547, 209.453], text: "Shaltin Tunnels", rotation: -65, style: "mid" },
  { coords: [-59.555, 220.297], text: "Overic Griplink", rotation: 40, style: "mid" },
  { coords: [-59.500, 150.000], text: "Celanon Spur", rotation: -12, style: "mid" },
  { coords: [-54.281, 117.531], text: "Entralla Route", rotation: 94, style: "mid" },
  { coords: [-32.031, 133.406], text: "Veragit Run", rotation: -37, style: "mid" },
  { coords: [-72.211, 159.078], text: "Braxant Run", rotation: 0, style: "mid" },
  { coords: [-94.266, 72.164], text: "Phalanx Route", rotation: -12, style: "mid" },
  { coords: [-119.688, 209.281], text: "Pabol Kreeta", rotation: -70, style: "mid" },
  { coords: [-201.656, 185.781], text: "Llanic Spice Run", rotation: -45, style: "mid" },
  { coords: [-114.000, 199.656], text: "Pabol Sleheyron", rotation: -10, style: "major" },
  { coords: [-121.875, 178.344], text: "Ootmian Pabol", rotation: -50, style: "major" },
  { coords: [-125.125, 208.500], text: "Ootmian Pabol", rotation: 63, style: "major" },
  { coords: [-144.438, 217.688], text: "Hollastin Run", rotation: 30, style: "mid" },
  { coords: [-151.719, 215.359], text: "Pando Spur", rotation: 75, style: "mid" },
  { coords: [-136.359, 221.500], text: "Shag Pabol", rotation: -8, style: "mid" },
  // Minor lane labels
  { coords: [-122.487, 121.250], text: "Byss Run", rotation: -35, style: "mid" },
  { coords: [-78.281, 166.844], text: "Mandalorian Road", rotation: 30, style: "mid" },
  { coords: [-90.328, 70.015], text: "Way of Schesa", rotation: -20, style: "mid" },
  { coords: [-99.422, 60.429], text: "Path of the Houses", rotation: 35, style: "mid" },
  { coords: [-99.156, 65.187], text: "Vaagari Corridor", rotation: 8, style: "mid" },
  { coords: [-98.125, 50.976], text: "Cressus Route", rotation: -45, style: "mid" },
  { coords: [-90.609, 54.593], text: "Chasdemonus Route", rotation: -10, style: "mid" },
  { coords: [-71.719, 125.594], text: "Entralla Route", rotation: 60, style: "mid" },
  { coords: [-47.875, 204.531], text: "Listehol Run", rotation: 10, style: "mid" },
  { coords: [-93.555, 233.023], text: "Falko Run", rotation: 0, style: "mid" },
  { coords: [-113.125, 208.125], text: "Ilosian Spur", rotation: 90, style: "mid" },
  { coords: [-207.344, 107.188], text: "Koda Spur", rotation: 30, style: "mid" },
  // Dash lane labels
  { coords: [-112.863, 227.680], text: "Kessel Run", rotation: 0, style: "mid", color: "#c75d16" },
  { coords: [-117.363, 132.871], text: "Carbonite Run", rotation: 15, style: "mid", color: "#c75d16" },
];

const NEBULA_LABELS = [
  { coords: [-188.609, 88.781], text: "Monsua Nebula", rotation: 35 },
  { coords: [-191.219, 97.375], text: "Adinax Nebula", rotation: 30 },
  { coords: [-207.688, 115.355], text: "Kiax Nebula", rotation: 0 },
  { coords: [-204.316, 130.305], text: "Thull's Shroud", rotation: 0 },
  { coords: [-197.820, 138.938], text: "Starforge Nebula", rotation: -40 },
  { coords: [-226.195, 142.406], text: "Crushank Nebula", rotation: 40 },
  { coords: [-232.297, 142.570], text: "Kur Nebula", rotation: 12 },
  { coords: [-196.219, 170.672], text: "Kaliida Nebula", rotation: -16 },
  { coords: [-187.977, 179.938], text: "Ro-Loo Triangle", rotation: 0 },
  { coords: [-185.938, 202.953], text: "D'Anjon Nebula", rotation: 60 },
  { coords: [-69.891, 120.656], text: "Recluse's Nebula", rotation: 0 },
  { coords: [-70.984, 103.641], text: "Great Forveen Nebula", rotation: -40 },
  { coords: [-90.734, 94.102], text: "Utegetu Nebula", rotation: 0 },
  { coords: [-102.758, 56.953], text: "Rata Nebula", rotation: 40 },
  { coords: [-145.695, 91.359], text: "Quelugan Nebula", rotation: 0 },
  { coords: [-112.344, 177.156], text: "Zavian Abyss", rotation: -15 },
  { coords: [-177.609, 125.297], text: "Llon Nebula", rotation: 35 },
  { coords: [-180.875, 118.758], text: "Vulpinus Nebula", rotation: 0 },
  { coords: [-119.094, 115.567], text: "Koornacht\nCluster", rotation: 0 },
  { coords: [-105.832, 134.541], text: "Ringali\nNebula", rotation: 0 },
  { coords: [-141.080, 115.026], text: "Osssorck Nebula", rotation: -35 },
  { coords: [-92.383, 128.523], text: "Byrnum Maw", rotation: 0 },
  { coords: [-85.329, 159.922], text: "Ryyk Nebula", rotation: -10 },
  { coords: [-152.588, 105.297], text: "The Almagest", rotation: -15 },
  { coords: [-159.642, 117.977], text: "Dragon Void", rotation: 30 },
  { coords: [-103.408, 166.141], text: "Transitory Mists", rotation: -50 },
  { coords: [-68.414, 181.758], text: "Dinarii Nebula", rotation: -28 },
  { coords: [-40.555, 214.598], text: "Thandon Nebula", rotation: -90 },
  { coords: [-57.109, 205.406], text: "Stygian Caldera", rotation: -30 },
  { coords: [-81.250, 229.547], text: "Archeon Nebula", rotation: -56 },
  { coords: [-97.173, 230.922], text: "Starcave Nebula", rotation: 10 },
  { coords: [-107.938, 226.672], text: "Maw Nebulae", rotation: 10 },
  { coords: [-122.531, 239.422], text: "The Inamorata", rotation: -35 },
  { coords: [-125.531, 193.320], text: "Typhonic Nebula", rotation: -10 },
  { coords: [-138.188, 207.922], text: "Ganath Cloud", rotation: 0 },
];

function buildLabelSources() {
  let id = 0;

  // Trade route labels
  const routeFeatures = TRADE_ROUTE_LABELS.map((l) =>
    pointFeature(id++, l.coords, {
      text: l.text,
      rotation: l.rotation || 0,
      style: l.style,
      color: l.color || "white",
      type: "route",
    })
  );

  // Nebula labels
  const nebulaFeatures = NEBULA_LABELS.map((l) =>
    pointFeature(id++, l.coords, {
      text: l.text,
      rotation: l.rotation || 0,
      style: "nebula",
      color: "#A080A2",
      type: "nebula",
    })
  );

  return {
    routeLabels: fc(routeFeatures),
    nebulaLabels: fc(nebulaFeatures),
  };
}

// ── Master build ───────────────────────────────────────────────────────

export async function buildAllSources() {
  const [regions, territories, nebulae, lanes] = await Promise.all([
    buildRegionSources(),
    buildTerritorySources(),
    buildNebulaSources(),
    buildTradeLaneSources(),
  ]);

  const grid = buildGridSources();
  const labels = buildLabelSources();

  return {
    regions,
    territories,
    nebulae,
    lanes,       // { major, mid, minor, dash, micro }
    grid,        // { lines, labels }
    labels,      // { routeLabels, nebulaLabels }
    zoneTitles: ZONE_TITLES,
  };
}

export { LANE_REGISTRY, ZONE_TITLES, TRADE_ROUTE_LABELS, NEBULA_LABELS };
