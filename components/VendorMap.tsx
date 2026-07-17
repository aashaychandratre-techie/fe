"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

import { enablePmtilesProtocol } from "@/lib/pmtilesProtocol";
import { getCabMapStyle } from "@/lib/getCabMapStyle";

import "maplibre-gl/dist/maplibre-gl.css";

export default function VendorMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Register PMTiles protocol
    enablePmtilesProtocol();

    // Create map
    const map = new maplibregl.Map({
      container: mapContainer.current,

      style: getCabMapStyle(
        process.env.NEXT_PUBLIC_PMTILES_URL
      ),

      center: [75.3433, 19.8762],
      zoom: 10,
    });

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    map.on("load", () => {
      console.log("IndusMaps Loaded Successfully");
    });

    map.on("error", (e) => {
      console.error("Map Error:", e.error);
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[400px] rounded-xl border"
    />
  );
}