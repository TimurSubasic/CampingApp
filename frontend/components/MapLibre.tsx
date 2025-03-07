import React, { useEffect, useState, useRef } from "react";
import {
  MapView,
  Camera,
  UserLocation,
  CameraRef,
} from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { View, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const MapLibre = () => {
  const cameraRef = useRef<CameraRef>(null);
  const [coords, setCoords] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const centerOnUser = () => {
    if (coords && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [coords.longitude, coords.latitude],
        zoomLevel: 11,
        animationDuration: 1000,
        animationMode: "easeTo",
      });
    }
  };

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
            accuracy: Location.Accuracy.Balanced,
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
              ref={cameraRef}
              centerCoordinate={[coords.longitude, coords.latitude]}
              zoomLevel={11}
              animationDuration={3500}
              animationMode="easeTo"
            />
          ) : null}
          <UserLocation
            renderMode="normal"
            visible={true}
            onUpdate={(location) => {
              setCoords({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
            }}
          />
        </MapView>
        <TouchableOpacity
          onPress={centerOnUser}
          className="absolute top-4 right-4 bg-white p-4 rounded-full shadow-md"
        >
          <FontAwesome name="location-arrow" size={24} color="#0D7377" />
        </TouchableOpacity>
      </View>
    );
  }
};

export default MapLibre;
