import React, { useEffect, useState } from "react";
import { MapView, Camera } from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { View, ActivityIndicator, Alert, Text } from "react-native";

const MapLibre = () => {
  const [coords, setCoords] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is needed to center the map."
        );
        setLoading(false);
        return;
      }

      let location = await Location.getLastKnownPositionAsync();
      if (location) {
        setCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0D7377" />
      </View>
    );
  }

  return (
    <View>
      <MapView
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
      >
        {coords ? (
          <Camera
            centerCoordinate={[coords.longitude, coords.latitude]}
            zoomLevel={11}
          />
        ) : (
          <Camera />
        )}
      </MapView>
    </View>
  );
};

export default MapLibre;
