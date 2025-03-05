import React, { useEffect, useState } from "react";
import {
  MapView,
  Camera,
  PointAnnotation,
  Callout,
} from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { View, ActivityIndicator, Alert, Text } from "react-native";

const MapLibre = () => {
  const [coords, setCoords] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const setupLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location access is needed to center the map."
          );
          setLoading(false);
          return;
        }

        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        setCoords({
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
        });

        // Start watching location
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 1,
          },
          (location) => {
            setCoords({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        );
      } catch (error) {
        Alert.alert("Error", "Failed to get location");
      } finally {
        setLoading(false);
      }
    };

    setupLocation();

    // Cleanup function
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  if (loading) {
    return (
      <View className="flex w-full h-full items-center justify-center">
        <ActivityIndicator size="large" color="#0D7377" />
      </View>
    );
  } else {
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
              animationDuration={3500}
              animationMode="easeTo"
            />
          ) : null}

          {coords && (
            <PointAnnotation
              id="user"
              coordinate={[coords.longitude, coords.latitude]}
              title="Your location"
              snippet="This is where you are located"
            >
              <Callout
                style={{
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text className="font-bold">You are here</Text>
              </Callout>
            </PointAnnotation>
          )}
        </MapView>
      </View>
    );
  }
};

export default MapLibre;
