"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

import { enablePmtilesProtocol } from "@/lib/pmtilesProtocol";
import { getCabMapStyle } from "@/lib/getCabMapStyle";

import "maplibre-gl/dist/maplibre-gl.css";

interface VendorMapProps {
  focusLocation?: [number, number] | null;
  scheduleItems?: any[];
}

export default function VendorMap({ focusLocation, scheduleItems }: VendorMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

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
      center: [75.3433, 19.8762], // Default center
      zoom: 10,
    });

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

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
        duration: 2000
      });
    }
  }, [focusLocation]);

  useEffect(() => {
    if (!mapInstance.current || !scheduleItems || scheduleItems.length === 0) return;

    const map = mapInstance.current;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const loadMarkers = async () => {
      const bounds = new maplibregl.LngLatBounds();
      let hasValidCoords = false;

      for (let i = 0; i < scheduleItems.length; i++) {
        const item = scheduleItems[i];
        if (!item.address) continue;

        try {
          // Delay to respect Nominatim API limits (1 req/sec)
          if (i > 0) await new Promise(res => setTimeout(res, 1100));
          
          const searchParams = new URLSearchParams({
            q: item.address,
            format: "json",
            limit: "1"
          });
          
          const response = await fetch(`https://nominatim.openstreetmap.org/search?${searchParams}`);
          const data = await response.json();
          
          let lat, lon;
          
          if (data && data.length > 0) {
             lat = parseFloat(data[0].lat);
             lon = parseFloat(data[0].lon);
          } else {
             // Fallback to city/state string matching from address
             const parts = item.address.split(",");
             if (parts.length >= 1) {
                 // Try last two parts (often city, state)
                 const fallbackQuery = (parts.length > 1 ? parts.slice(-2).join(",") : parts[0]).trim() + ", India";
                 const fbParams = new URLSearchParams({ q: fallbackQuery, format: "json", limit: "1" });
                 const fbRes = await fetch(`https://nominatim.openstreetmap.org/search?${fbParams}`);
                 const fbData = await fbRes.json();
                 
                 if (fbData && fbData.length > 0) {
                     lat = parseFloat(fbData[0].lat);
                     lon = parseFloat(fbData[0].lon);
                 }
             }
          }
          
          if (lat && lon) {
             hasValidCoords = true;
             
             // Create custom numbered marker
             const el = document.createElement("div");
             el.className = "w-8 h-8 bg-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:bg-emerald-600 transition-colors";
             el.innerHTML = `<span>${i + 1}</span>`;
             
             // Create popup with booking details
             const popup = new maplibregl.Popup({ offset: 15, closeButton: false }).setHTML(`
                <div class="p-2 min-w-[150px]">
                   <h3 class="font-bold text-emerald-800 text-sm">${item.serviceName || "Service"}</h3>
                   <p class="text-[11px] mt-1 text-gray-600 leading-tight">${item.address}</p>
                   <p class="text-[11px] font-bold mt-2 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md inline-block">?? ${item.bookingTime || "Time TBD"}</p>
                </div>
             `);
             
             const marker = new maplibregl.Marker({ element: el })
                .setLngLat([lon, lat])
                .setPopup(popup)
                .addTo(map);
                
             markersRef.current.push(marker);
             bounds.extend([lon, lat]);
          }
        } catch (e) {
          console.error("Geocoding failed for", item.address, e);
        }
      }
      
      if (hasValidCoords && !focusLocation) {
         map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
      }
    };
    
    loadMarkers();
    
  }, [scheduleItems, focusLocation]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-xl border-none"
    />
  );
}
