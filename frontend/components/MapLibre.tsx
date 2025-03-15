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
      });
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
          compassEnabled={true}
          compassViewPosition={0}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
        >
          {coords && (
            <Camera
              ref={cameraRef}
              centerCoordinate={[coords.longitude, coords.latitude]}
              zoomLevel={11}
              animationDuration={3500}
              animationMode="easeTo"
            />
          )}

          {coords && (
            <PointAnnotation
              id="userLocation"
              coordinate={[coords.longitude, coords.latitude]}
            >
              <Callout>
                <View className="bg-white px-3 py-1 rounded-lg border border-gray-300">
                  <Text className="text-sm text-gray-800 font-semibold">
                    You are here
                  </Text>
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

        <View className="absolute top-4 right-4 flex flex-col gap-2">
          {coords && (
            <TouchableOpacity
              onPress={centerOnUser}
              className="flex items-center justify-center bg-white p-3 rounded-full shadow-lg shadow-black"
            >
              <FontAwesome name="location-arrow" size={24} color="#0D7377" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => alert("Map info page")}
            className="flex items-center justify-center bg-white p-3 rounded-full shadow-lg shadow-black"
          >
            <FontAwesome name="question" size={24} color="#0D7377" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default MapLibre;
