import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const TutorialIndex = () => {
  const router = useRouter();

  const options = [
    {
      title: "How To's",
      path: "/(tutorial)/tutorial",
    },
    {
      title: "Compass",
      path: "/(tutorial)/compass",
    },
    {
      title: "Barometer",
      path: "/(tutorial)/barometer",
    },
  ];

  return (
    <View className="flex-1 p-4">
      <View className="flex gap-5">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white p-4 rounded-lg shadow-md"
            onPress={() => router.push(option.path as any)}
          >
            <Text className="text-lg font-semibold text-gray-800">
              {option.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TutorialIndex;
