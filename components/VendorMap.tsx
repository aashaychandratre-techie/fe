"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

import { enablePmtilesProtocol } from "@/lib/pmtilesProtocol";
import { getCabMapStyle } from "@/lib/getCabMapStyle";

import "maplibre-gl/dist/maplibre-gl.css";

interface VendorMapProps {
  focusLocation?: [number, number] | null;
}

export default function VendorMap({ focusLocation }: VendorMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

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
    
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current && focusLocation) {
      mapInstance.current.flyTo({
        center: focusLocation,
        zoom: 14,
        essential: true,
        duration: 2000 // 2 seconds animation
      });
    }
  }, [focusLocation]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[400px] rounded-xl border"
    />
  );
}