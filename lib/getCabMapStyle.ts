import { getEnabledPmtilesUrl } from "@/lib/pmtilesProtocol";

type MapStyle = {
  version: 8;
  glyphs: string;
  sources: Record<string, any>;
  layers: any[];
};

const esriSatelliteTiles = [
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
];

const defaultMapTiles = [
  "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
];

export function getCabMapStyle(pmtilesUrl?: string): MapStyle {
  const enabledPmtilesUrl = getEnabledPmtilesUrl() || pmtilesUrl;
  const hasVectorTiles =
    process.env.NEXT_PUBLIC_ENABLE_PMTILES === "true" &&
    Boolean(enabledPmtilesUrl);

  return {
    version: 8,
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      ...(hasVectorTiles
        ? {
            india: {
              type: "vector",
              url: `pmtiles://${enabledPmtilesUrl}`,
            },
          }
        : {}),
      esri: {
        type: "raster",
        tiles: esriSatelliteTiles,
        tileSize: 256,
      },
      defaultMap: {
        type: "raster",
        tiles: defaultMapTiles,
        tileSize: 256,
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#f6f3ee",
        },
      },
      {
        id: "default-map",
        type: "raster",
        source: "defaultMap",
        layout: {
          visibility: "visible",
        },
        paint: {
          "raster-opacity": 1,
        },
      },
      {
        id: "esri-satellite",
        type: "raster",
        source: "esri",
        layout: {
          visibility: "none",
        },
        paint: {
          "raster-opacity": 0.92,
        },
      },
      ...(hasVectorTiles
        ? [
            {
              id: "landcover",
              type: "fill",
              source: "india",
              "source-layer": "landcover",
              paint: {
                "fill-color": [
                  "match",
                  ["get", "class"],
                  "forest",
                  "#dfe8d3",
                  "wood",
                  "#dfe8d3",
                  "grass",
                  "#e7efdd",
                  "scrub",
                  "#edf2e5",
                  "#f3f4ef",
                ],
                "fill-opacity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  5,
                  0.9,
                  15,
                  0.4,
                  17,
                  0.15,
                ],
              },
            },
            {
              id: "landuse",
              type: "fill",
              source: "india",
              "source-layer": "landuse",
              maxzoom: 16,
              paint: {
                "fill-color": [
                  "match",
                  ["get", "class"],
                  "residential",
                  "#f5f3ef",
                  "commercial",
                  "#f4efe7",
                  "industrial",
                  "#ece7df",
                  "railway",
                  "#ece8e3",
                  "#f2efea",
                ],
                "fill-opacity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  5,
                  0.55,
                  15,
                  0.2,
                  17,
                  0.05,
                ],
              },
            },
            {
              id: "parks",
              type: "fill",
              source: "india",
              "source-layer": "park",
              maxzoom: 17,
              paint: {
                "fill-color": "#d6e9cb",
                "fill-opacity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  5,
                  0.85,
                  15,
                  0.55,
                  17,
                  0.25,
                ],
              },
            },
            {
              id: "water",
              type: "fill",
              source: "india",
              "source-layer": "water",
              paint: {
                "fill-color": "#c8def0",
              },
            },
            {
              id: "waterway",
              type: "line",
              source: "india",
              "source-layer": "waterway",
              paint: {
                "line-color": "#a9c8e6",
                "line-width": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  5,
                  0.4,
                  10,
                  1,
                  14,
                  2,
                  18,
                  5,
                ],
              },
            },
            {
              id: "boundaries",
              type: "line",
              source: "india",
              "source-layer": "boundary",
              maxzoom: 14,
              paint: {
                "line-color": "#d4cfc8",
                "line-opacity": 0.45,
                "line-width": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  3,
                  0.5,
                  10,
                  1.2,
                ],
              },
            },
            {
              id: "road-casing",
              type: "line",
              source: "india",
              "source-layer": "transportation",
              filter: [
                "match",
                ["get", "class"],
                ["motorway", "trunk", "primary", "secondary", "tertiary"],
                true,
                false,
              ],
              layout: {
                "line-cap": "round",
                "line-join": "round",
              },
              paint: {
                "line-color": "#d8d0c5",
                "line-width": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  5,
                  1,
                  10,
                  3,
                  15,
                  10,
                  18,
                  22,
                ],
              },
            },
            {
              id: "expressways",
              type: "line",
              source: "india",
              "source-layer": "transportation",
              filter: ["==", ["get", "expressway"], 1],
              layout: {
                "line-cap": "round",
                "line-join": "round",
              },
              paint: {
                "line-color": "#5b3fd1",
                "line-width": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  5,
                  0.8,
                  10,
                  3,
                  15,
                  9,
                  18,
                  18,
                ],
              },
            },
            {
              id: "national-highways",
              type: "line",
              source: "india",
              "source-layer": "transportation",
              filter: [
                "match",
                ["get", "class"],
                ["motorway", "trunk"],
                true,
                false,
              ],
              layout: {
                "line-cap": "round",
                "line-join": "round",
              },
              paint: {
                "line-color": "#f4c26b",
                "line-width": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  5,
                  0.8,
                  10,
                  2.5,
                  15,
                  8,
                  18,
                  16,
                ],
              },
            },
            {
              id: "state-highways",
              type: "line",
              source: "india",
              "source-layer": "transportation",
              minzoom: 6,
              filter: ["==", ["get", "class"], "primary"],
              layout: {
                "line-cap": "round",
                "line-join": "round",
              },
              paint: {
                "line-color": "#ffffff",
                "line-width": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  6,
                  0.5,
                  10,
                  1.5,
                  15,
                  5,
                  18,
                  10,
                ],
              },
            },
            {
              id: "secondary-roads",
              type: "line",
              source: "india",
              "source-layer": "transportation",
              minzoom: 10,
              filter: ["==", ["get", "class"], "secondary"],
              layout: {
                "line-cap": "round",
                "line-join": "round",
              },
              paint: {
                "line-color": "#ffffff",
                "line-width": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  10,
                  0.8,
                  15,
                  3,
                  18,
                  6,
                ],
              },
            },
            {
              id: "local-roads",
              type: "line",
              source: "india",
              "source-layer": "transportation",
              minzoom: 13,
              filter: [
                "match",
                ["get", "class"],
                ["street", "minor", "service", "track", "path"],
                true,
                false,
              ],
              layout: {
                "line-cap": "round",
                "line-join": "round",
              },
              paint: {
                "line-color": "#ffffff",
                "line-width": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  13,
                  0.4,
                  15,
                  1.8,
                  18,
                  5,
                ],
              },
            },
            {
              id: "buildings",
              type: "fill",
              source: "india",
              "source-layer": "building",
              minzoom: 13,
              maxzoom: 17,
              paint: {
                "fill-color": "#e4ded5",
                "fill-outline-color": "#d7d0c7",
                "fill-opacity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  13,
                  0.3,
                  15,
                  0.55,
                  17,
                  0.8,
                ],
              },
            },
            {
              id: "3d-buildings",
              type: "fill-extrusion",
              source: "india",
              "source-layer": "building",
              minzoom: 15,
              paint: {
                "fill-extrusion-color": "#cfc7bc",
                "fill-extrusion-height": [
                  "coalesce",
                  ["get", "render_height"],
                  6,
                ],
                "fill-extrusion-base": [
                  "coalesce",
                  ["get", "render_min_height"],
                  0,
                ],
                "fill-extrusion-opacity": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  15,
                  0,
                  16,
                  0.35,
                  18,
                  0.6,
                ],
              },
            },
            {
              id: "place-labels",
              type: "symbol",
              source: "india",
              "source-layer": "place",
              layout: {
                "text-field": [
                  "coalesce",
                  ["get", "name_en"],
                  ["get", "name"],
                ],
                "text-font": ["Open Sans Regular"],
                "text-size": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  3,
                  12,
                  8,
                  16,
                  15,
                  22,
                ],
                "text-max-width": 8,
                "text-allow-overlap": false,
                "text-ignore-placement": false,
              },
              paint: {
                "text-color": "#1f2937",
                "text-halo-color": "#ffffff",
                "text-halo-width": 3,
                "text-halo-blur": 0.35,
              },
            },
            {
              id: "road-labels",
              type: "symbol",
              source: "india",
              "source-layer": "transportation_name",
              minzoom: 10,
              layout: {
                "symbol-placement": "line",
                "text-field": [
                  "coalesce",
                  ["get", "name_en"],
                  ["get", "name"],
                ],
                "text-font": ["Open Sans Regular"],
                "text-size": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  10,
                  11,
                  14,
                  13,
                  18,
                  15,
                ],
                "text-allow-overlap": false,
                "text-ignore-placement": false,
              },
              paint: {
                "text-color": "#374151",
                "text-halo-color": "#ffffff",
                "text-halo-width": 2,
                "text-halo-blur": 0.2,
              },
            },
            {
              id: "poi-labels",
              type: "symbol",
              source: "india",
              "source-layer": "poi",
              minzoom: 14,
              filter: [
                "match",
                ["get", "class"],
                ["hospital", "school", "mall", "station", "airport"],
                true,
                false,
              ],
              layout: {
                "text-field": [
                  "coalesce",
                  ["get", "name_en"],
                  ["get", "name"],
                ],
                "text-font": ["Open Sans Regular"],
                "text-size": 13,
                "text-allow-overlap": false,
                "text-ignore-placement": false,
              },
              paint: {
                "text-color": "#263238",
                "text-halo-color": "#ffffff",
                "text-halo-width": 2,
                "text-halo-blur": 0.2,
              },
            },
            {
              id: "airport-labels",
              type: "symbol",
              source: "india",
              "source-layer": "aerodrome_label",
              minzoom: 8,
              layout: {
                "text-field": [
                  "coalesce",
                  ["get", "name_en"],
                  ["get", "name"],
                ],
                "text-font": ["Open Sans Regular"],
                "text-size": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  8,
                  10,
                  15,
                  14,
                ],
              },
              paint: {
                "text-color": "#6b7280",
                "text-halo-color": "#ffffff",
                "text-halo-width": 1.5,
              },
            },
          ]
        : []),
    ],
  };
}