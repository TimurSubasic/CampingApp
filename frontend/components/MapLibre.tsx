import { MapView } from "@maplibre/maplibre-react-native";
import React from "react";

const MapLibre = () => {
  return (
    <MapView
      style={{ width: "100%", height: "100%" }}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
    />
  );
};

export default MapLibre;
