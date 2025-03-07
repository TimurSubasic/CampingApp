import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Barometer } from "expo-sensors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface BarometerData {
  pressure: number;
}

interface BarometerSubscription {
  remove: () => void;
}

const BarometerScreen = () => {
  const [pressure, setPressure] = useState<number | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);
  const [previousPressure, setPreviousPressure] = useState<number | null>(null);
  const [showFeet, setShowFeet] = useState(false);
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let subscription: BarometerSubscription | undefined;

    const setupBarometer = async () => {
      const available = await Barometer.isAvailableAsync();
      setIsAvailable(available);

      if (available) {
        Barometer.setUpdateInterval(1000);

        const calculateAltitude = (pressure: number) => {
          return 44330 * (1 - Math.pow(pressure / 1013.25, 1 / 5.255));
        };

        const updateTrend = (current: number, previous: number | null) => {
          if (!previous) return "stable";
          const diff = current - previous;
          if (diff < 0.1) return "up";
          if (diff > -0.1) return "down";
          return trend; // Keep current trend if change is small
        };

        subscription = Barometer.addListener((data: BarometerData) => {
          setPreviousPressure(pressure);
          setPressure(data.pressure);

          const newAltitude = calculateAltitude(data.pressure);
          setAltitude(newAltitude);

          setTrend(updateTrend(data.pressure, pressure));
        });
      }
    };

    setupBarometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [pressure, trend]);

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "arrow-up";
      case "down":
        return "arrow-down";
      default:
        return "minus";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "green";
      case "down":
        return "red";
      default:
        return "gray";
    }
  };

  const formatAltitude = (meters: number) => {
    if (showFeet) {
      const feet = meters * 3.28084;
      return `${Math.round(feet)} ft`;
    }
    return `${Math.round(meters)} m`;
  };

  if (isAvailable === null) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-4">
        <Text className="text-lg text-gray-800">
          Checking barometer availability...
        </Text>
      </View>
    );
  }

  if (!isAvailable) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-4">
        <Text className="text-lg text-gray-800">
          Barometer is not available on this device
        </Text>
      </View>
    );
  }

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
