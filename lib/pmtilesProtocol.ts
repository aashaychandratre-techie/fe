import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";

let protocol: Protocol | null = null;

export function enablePmtilesProtocol() {
  if (!protocol) {
    protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
  }
}

export function getEnabledPmtilesUrl() {
  return process.env.NEXT_PUBLIC_PMTILES_URL;
}