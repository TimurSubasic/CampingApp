import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { Magnetometer } from "expo-sensors";

const Compass = () => {
  const [magnetometer, setMagnetometer] = useState(0);

  useEffect(() => {
    let subscription;
    Magnetometer.setUpdateInterval(100);

    subscription = Magnetometer.addListener((data) => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      setMagnetometer(angle);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <View className="w-64 h-64 items-center justify-center">
        <View
          style={[
            styles.arrow,
            {
              transform: [{ rotate: `${magnetometer}deg` }],
            },
          ]}
        />
        <Text className="mt-4 text-lg font-semibold text-gray-800">
          {Math.round(magnetometer)}°
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#0D7377",
  },
});

export default Compass;
