// MapLibre GL base style — no tiles, just a background color + glyph source

export const baseStyle = {
  version: 8,
  name: "galaxy-map",
  // Open Sans SDF glyphs from MapTiler (free, works with MapLibre)
  glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
  sources: {},
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#26244a",
      },
    },
  ],
};
