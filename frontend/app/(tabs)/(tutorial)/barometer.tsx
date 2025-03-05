import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Barometer } from "expo-sensors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const BarometerScreen = () => {
  const [pressure, setPressure] = useState<number | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);
  const [previousPressure, setPreviousPressure] = useState<number | null>(null);
  const [showFeet, setShowFeet] = useState(false);

  useEffect(() => {
    let subscription;
    Barometer.setUpdateInterval(1000);

    subscription = Barometer.addListener((data) => {
      setPreviousPressure(pressure);
      setPressure(data.pressure);

      // Calculate altitude using the barometric formula
      // h = 44330 * (1 - (P/P0)^(1/5.255))
      // where P0 is standard pressure at sea level (1013.25 hPa)
      const altitudeMeters =
        44330 * (1 - Math.pow(data.pressure / 1013.25, 1 / 5.255));
      setAltitude(altitudeMeters);
    });

    return () => {
      subscription.remove();
    };
  }, [pressure]);

  const getTrendIcon = () => {
    if (!pressure || !previousPressure) return "minus";
    const diff = pressure - previousPressure;
    if (diff > 0.1) return "arrow-up";
    if (diff < -0.1) return "arrow-down";
    return "minus";
  };

  const getTrendColor = () => {
    if (!pressure || !previousPressure) return "gray";
    const diff = pressure - previousPressure;
    if (diff > 0.1) return "green";
    if (diff < -0.1) return "red";
    return "gray";
  };

  const formatAltitude = (meters: number) => {
    if (showFeet) {
      const feet = meters * 3.28084;
      return `${Math.round(feet)} ft`;
    }
    return `${Math.round(meters)} m`;
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      <View className="bg-white rounded-xl p-6 shadow-md w-full max-w-sm">
        <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
          Barometer
        </Text>

        <View className="space-y-4">
          <View className="bg-gray-50 rounded-lg p-4">
            <Text className="text-sm text-gray-600">Atmospheric Pressure</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-semibold text-gray-800">
                {pressure ? `${pressure.toFixed(2)} hPa` : "Loading..."}
              </Text>
              <FontAwesome
                name={getTrendIcon()}
                size={24}
                color={getTrendColor()}
              />
            </View>
          </View>

          <View className="bg-gray-50 rounded-lg p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600">Estimated Altitude</Text>
              <TouchableOpacity
                onPress={() => setShowFeet(!showFeet)}
                className="bg-gray-200 px-3 py-1 rounded-full"
              >
                <Text className="text-sm text-gray-700">
                  {showFeet ? "Switch to m" : "Switch to ft"}
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="text-2xl font-semibold text-gray-800">
              {altitude ? formatAltitude(altitude) : "Loading..."}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BarometerScreen;
