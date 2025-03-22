import { View, Text } from "react-native";
import React from "react";
import CheckList1 from "@/components/CheckList1";
import TripPage from "@/components/TripPage";

const newTrip = () => {
  return (
    <View className="flex-1 gap-2 bg-white items-center justify-center p-5">
      <Text className="text-2xl font-bold p-3 shadow-lg shadow-black">
        newTrip
      </Text>
      <TripPage />
      <CheckList1 />
    </View>
  );
};

export default newTrip;
