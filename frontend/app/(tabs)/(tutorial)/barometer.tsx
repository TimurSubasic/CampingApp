import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Barometer } from "expo-sensors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  getBasePressure,
  setBasePressure,
  resetBasePressure,
} from "../../(auth)/userStore";

interface BarometerData {
  pressure: number;
}

interface BarometerSubscription {
  remove: () => void;
}

const BarometerScreen = () => {
  const [pressure, setPressure] = useState<number | null>(null);
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [basePressure, setLocalBasePressure] = useState<number | null>(null);

  useEffect(() => {
    // Load base pressure from store on mount
    setLocalBasePressure(getBasePressure());
  }, []);

  useEffect(() => {
    let subscription: BarometerSubscription | undefined;

    const setupBarometer = async () => {
      const available = await Barometer.isAvailableAsync();
      setIsAvailable(available);

      if (available) {
        Barometer.setUpdateInterval(1000);

        subscription = Barometer.addListener((data: BarometerData) => {
          setPressure(data.pressure);
          if (basePressure) {
            if (data.pressure === basePressure) {
              setTrend("stable");
            } else if (data.pressure > basePressure) {
              setTrend("up");
            } else {
              setTrend("down");
            }
          }
        });
      }
    };

    setupBarometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [pressure]);

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "sun";
      case "down":
        return "cloud-rain";
      default:
        return "cloud-sun";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "#FFA500"; // Orange for high pressure (clear, hot weather)
      case "down":
        return "#0ea5e9"; // Blue for low pressure (rain, storms)
      default:
        return "gray";
    }
  };

  const getWeatherTrend = () => {
    if (!pressure || !basePressure)
      return "Set base pressure to track weather changes";

    if (trend === "stable") return "Weather conditions are stable";

    if (trend === "up") {
      return "Pressure rising: Expect clearer, warmer weather";
    } else {
      return "Pressure falling: Possible rain or storms approaching";
    }
  };

  const handleSetBasePressure = () => {
    if (pressure) {
      setBasePressure(pressure);
      setLocalBasePressure(pressure);
      setTrend("stable");
    }
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
          Weather Monitor
        </Text>

        <View className="space-y-4">
          <View className="bg-gray-50 rounded-lg p-4">
            <Text className="text-sm text-gray-600">Current Pressure</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-semibold text-gray-800">
                {pressure ? `${pressure.toFixed(2)} hPa` : "Loading..."}
              </Text>
              <FontAwesome6
                name={getTrendIcon()}
                size={24}
                color={getTrendColor()}
              />
            </View>
          </View>

          <View className="bg-gray-50 rounded-lg p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600">Base Pressure</Text>
            </View>
            <Text className="text-xl font-semibold text-gray-800">
              {basePressure != null
                ? `${basePressure.toFixed(2)} hPa`
                : "Not set"}
            </Text>
          </View>

          <View className="bg-gray-50 rounded-lg p-4">
            <Text className="text-sm text-gray-600 mb-2">Weather Trend</Text>
            <Text className="text-base text-gray-800">{getWeatherTrend()}</Text>
          </View>
          <View className="my-3 flex flex-col items-center justify-center gap-2 w-full">
            <TouchableOpacity
              onPress={() => {
                resetBasePressure();
                setLocalBasePressure(null);
                setTrend("stable");
              }}
              className="bg-red-500 p-2 rounded-md flex items-center justify-center w-full"
            >
              <Text className="text-white">Remove Base Pressure</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSetBasePressure}
              className="bg-blue-500 p-2 rounded-md flex items-center justify-center w-full"
            >
              <Text className="text-white">Set Current as Base</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BarometerScreen;
