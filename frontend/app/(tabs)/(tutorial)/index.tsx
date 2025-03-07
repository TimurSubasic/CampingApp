import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const TutorialIndex = () => {
  const router = useRouter();

  const options = [
    {
      title: "How To's",
      path: "/(tutorial)/tutorial",
      icon: "book",
    },
    {
      title: "Compass",
      path: "/(tutorial)/compass",
      icon: "compass",
    },
    {
      title: "Barometer",
      path: "/(tutorial)/barometer",
      icon: "mountain",
    },
  ];

  return (
    <View className="flex-1 p-4">
      <View className="flex gap-5">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex-row items-center"
            onPress={() => router.push(option.path as any)}
          >
            <FontAwesome
              name={option.icon as any}
              size={24}
              color="#0D7377"
              className="mr-4"
            />
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
