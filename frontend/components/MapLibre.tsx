import React, { useEffect, useState, useRef } from "react";
import {
  MapView,
  Camera,
  CameraRef,
  ShapeSource,
  FillLayer,
  PointAnnotation,
  Callout,
} from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import {
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import geoData from "./geo.json";

interface GeoFeature {
  type: "Feature";
  properties: {
    level: number;
    id: number;
  };
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

interface GeoJSON {
  type: "FeatureCollection";
  features: GeoFeature[];
}

const MapLibre = () => {
  const router = useRouter();
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
        animationDuration: 3500,
        animationMode: "easeTo",
      });

      // Remove animation after camera movement is complete
      setTimeout(() => {
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            animationDuration: 0,
            animationMode: "linearTo",
          });
        }
      }, 3500); // Match the animation duration
    }
  };

  const handleAreaPress = (event: any) => {
    if (event.features && event.features.length > 0) {
      const feature = event.features[0];
      const id = feature.properties.id;
      Alert.alert(
        "Location Selected",
        `You clicked on location with ID: ${id}`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Continue",
            onPress: () => router.push("/(tabs)/newTrip"),
          },
        ]
      );
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

        const newCoords = {
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
        };
        setCoords(newCoords);
        centerOnUser(); // Center on user once when we get initial location

        // Start watching location without moving the camera
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 3,
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
  }, []); // Empty dependency array since we only want to run this once

  if (loading) {
    return (
      <View className="flex-1 w-full h-full items-center justify-center">
        <View className="flex flex-row items-center gap-2">
          <ActivityIndicator size="large" color="#0D7377" />
        </View>
        <Text className="text-gray-800">Loading...</Text>
      </View>
    );
  } else {
    return (
      <View>
        <MapView
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
        >
          <Camera
            ref={cameraRef}
            animationDuration={3500}
            animationMode="easeTo"
          />
          {coords && (
            <PointAnnotation
              id="userLocation"
              coordinate={[coords.longitude, coords.latitude]}
            >
              <Callout>
                <View className="bg-white px-3 py-1 rounded-lg border border-gray-300">
                  <Text className="text-sm text-gray-800">You are here</Text>
                </View>
              </Callout>
            </PointAnnotation>
          )}
          <ShapeSource
            id="levelAreas"
            shape={geoData as GeoJSON}
            onPress={handleAreaPress}
          >
            <FillLayer
              id="levelAreasFill"
              style={{
                fillColor: [
                  "match",
                  ["get", "level"],
                  1,
                  "#90EE90", // Light green for level 1
                  2,
                  "#FFD700", // Yellow for level 2
                  3,
                  "#FF0000", // Red for level 3
                  "#808080", // Default gray
                ],
                fillOpacity: 0.3,
                fillOutlineColor: "#000000",
              }}
            />
          </ShapeSource>
        </MapView>
        {coords && (
          <TouchableOpacity
            onPress={centerOnUser}
            className="absolute top-4 right-4 bg-white p-4 rounded-full shadow-md"
          >
            <FontAwesome name="location-arrow" size={24} color="#0D7377" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
};

export default MapLibre;
